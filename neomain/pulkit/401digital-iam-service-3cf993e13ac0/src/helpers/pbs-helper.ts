import { SchedulerCycleEntity } from 'src/entities/scheduler-cycle';
import moment from 'moment';
import { ServiceTypes } from 'src/constants';
import { Injectable, Logger } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { HttpHelper, SerialNumbers } from '@401_digital/xrm-core';
import { PbsCustomersDTO } from 'src/dto';
import { ConfigService } from '@nestjs/config';
import { SchedulerLogsEntity } from 'src/entities/scheduler-logs';

interface PbsRecordsKeys {
  serviceType: string;
  resultKey: string;
  pbsApi: string;
  instances: SerialNumbers[];
}

@Injectable()
export class PbsHelpers {
  private readonly logger = new Logger(PbsHelpers.name);
  private http: HttpHelper<any>;
  constructor(private config: ConfigService) {
    this.http = new HttpHelper(this.config.get('PBS_HOST'));
  }
  private getPayloads(sc: SchedulerCycleEntity) {
    const since = moment.utc(sc.lastCycle).toDate();
    if (sc.serviceType == ServiceTypes.EmployeeGet) {
      return {
        searchPayload: {
          SerialNumber: sc.serialNumber,
          ModifiedSince: since,
          IncludeInactive: true,
        },
        successUpdatePayload: {
          lastCycle: new Date(),
        },
        failureUpdatePayload: {
          lastCycle: since,
        },
      };
    }
  }

  public async logError(log: SchedulerLogsEntity) {
    return getRepository(SchedulerLogsEntity).save(log).catch();
  }

  public async getRecordsFromPBS(keys: PbsRecordsKeys) {
    const scheculerRepo = getRepository(SchedulerCycleEntity);
    const promises = [];
    const commands: Array<{ filter: any; updatePayload: any }> = [];
    keys.instances.forEach(async (serialNumber) => {
      const serialLogs = new SchedulerLogsEntity();
      serialLogs.serialNumber = serialNumber;
      serialLogs.serviceType = keys.serviceType;
      serialLogs.startTime = new Date();

      const promise = new Promise(async (resolve) => {
        scheculerRepo
          .findOne({ serviceType: keys.serviceType, serialNumber })
          .then((sc) => {
            const filter = {
              serialNumber: sc.serialNumber,
              serviceType: sc.serviceType,
            };
            if (sc.lastCycle <= new Date()) {
              const payloads = this.getPayloads(sc);
              this.logger.log(
                `Reading Data from ${sc.lastCycle} for Service ${sc.serviceType} on Serial ${payloads.searchPayload.SerialNumber}`,
              );
              this.http
                .post(keys.pbsApi, payloads.searchPayload, {
                  Authorization: `Basic ${Buffer.from(
                    this.config.get('PBS_USERNAME') +
                      ':' +
                      this.config.get('PBS_PASSWORD'),
                  ).toString('base64')}`,
                })
                .then(async (result) => {
                  commands.push({
                    filter: filter,
                    updatePayload: payloads.successUpdatePayload,
                  });
                  resolve(
                    (result[keys.resultKey] as PbsCustomersDTO[]).map(
                      (customer) => {
                        if (!customer.SerialNumber)
                          customer.SerialNumber = serialNumber;
                        return customer;
                      },
                    ),
                  );
                })
                .catch(async (error) => {
                  serialLogs.error = error.message;
                  serialLogs.pbsReadTime = new Date();
                  serialLogs.endTime = new Date();
                  serialLogs.success = false;
                  this.logError(serialLogs);
                  console.log(
                    `Pbs Read Error for Serial ${serialNumber}`,
                    error,
                  );
                  commands.push({
                    filter: filter,
                    updatePayload: payloads.failureUpdatePayload,
                  });
                  resolve([]);
                });
            } else {
              commands.push({
                filter: filter,
                updatePayload: { lastCycle: new Date() },
              });
              resolve([]);
            }
          })
          .catch(async (error) => {
            this.logger.log(error);
          });
      });
      promises.push(promise);
    });
    return {
      records: (await Promise.all(promises)).reduce((a, b) => a.concat(b), []),
      commands,
    };
  }
}
