import { SchedulerCycleEntity } from 'src/entities/scheduler-cycle';
import { SchedulerLogsEntity } from 'src/entities/scheduler-logs';
import { getRepository } from 'typeorm';

export abstract class BaseScheduler<D, E> {
  abstract toEntity(dto: D): E;
  abstract dbPerformer(items: E[]): void;
  protected schedulerLogger: SchedulerLogsEntity;
  constructor() {
    this.schedulerLogger = new SchedulerLogsEntity();
  }

  public async updateCycles(commands: any[]) {
    if (commands.length) {
      const scheduler = getRepository(SchedulerCycleEntity);
      const promises = [];
      commands.forEach((el) => {
        promises.push(scheduler.update(el.filter, el.updatePayload));
      });
      await Promise.all(promises);
    }
  }

  public createLog(log: SchedulerLogsEntity) {
    delete log.id;
    return getRepository(SchedulerLogsEntity).save(
      Object.assign(new SchedulerLogsEntity(), log),
    );
  }
}
