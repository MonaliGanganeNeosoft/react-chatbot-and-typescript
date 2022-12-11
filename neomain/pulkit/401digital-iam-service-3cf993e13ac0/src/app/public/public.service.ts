import { HttpHelper } from '@401_digital/xrm-core';
import { Injectable } from '@nestjs/common';
import { AccountStatus } from 'src/constants';
import { BambooEntity } from 'src/entities/bamboo';
import { SG_HOST, SENDGRID_API_KEY } from '../../environment';
import { getRepository, ILike } from 'typeorm';
import { DealershipEntity } from '../dealership/dealership.entity';
import { DealershipService } from '../dealership/dealership.service';
import { PublicContactsEntity } from './public-contacts.entity';
import { ProvinceEntity } from './public-province.entity';
import { PublicContactDTO } from './public.dto';
import { bambmooUserLevel } from "../../constants";
import { MailService } from '@sendgrid/mail';

@Injectable()
export class PublicService {
    private http: HttpHelper<any>;
    private sgMail: MailService;
    constructor(private dealershipService: DealershipService) {
        this.http = new HttpHelper(SG_HOST);
        this.sgMail = new MailService();
        this.sgMail.setApiKey(SENDGRID_API_KEY);
    }

    async getTeams(query: any, isVisible: boolean) {
        // const response = await this.http.get(
        //   'api/gateway.php/401auto/v1/employees/directory',
        //   {
        //     Accept: 'application/json',
        //     Authorization: `Basic ${Buffer.from(BAMBOOHR_API_KEY)}`,
        //   },
        // );

        // let employees = response.employees;
        // if (query.photoUploaded == 'true') {
        //   employees = employees.filter((el: any) => el.photoUploaded == true);
        // }

        // const employeesEmails = employees.map(
        //   (employee: any) => employee.workEmail,
        // );

        // const employeeRepo = getRepository(EmployeeEntity);
        // const visibleDBEmployees = await employeeRepo
        //   .createQueryBuilder()
        //   .where('email IN (:...emails)', { emails: employeesEmails })
        //   .andWhere('is_visible = :isVisible', {
        //     isVisible: query.isVisible == 'true',
        //   })
        //   .getMany();

        // const dbEmails = visibleDBEmployees.map((emp) => emp.email);

        // const visibleEmails = employees.filter((em: any) =>
        //   dbEmails.includes(em.workEmail),
        // );

        console.log('query ', query)
        let whereClause = '';
        let whereobject = {};
        if (Object.keys(query).length) {
            if (query && query.location && query.location != 'all') {
                if (whereClause.length) {
                    whereClause += ' AND location ilike :location  AND level = :level AND customshowonwebsite = :customshowonwebsite'
                } else {
                    whereClause += 'location ilike :location  AND level = :level AND customshowonwebsite = :customshowonwebsite'
                }
                whereobject = { ...whereobject, location: `%${query.location}%` };
            } else {
                whereClause = 'level = :level AND customshowonwebsite = :customshowonwebsite'
            }
            if (query.searchFilter) {
                if (whereClause.length) {
                    whereClause += ' AND ( job_title ilike :keyword OR location ilike :keyword OR display_name ilike :keyword )  AND level = :level AND customshowonwebsite = :customshowonwebsite'
                } else {
                    whereClause += '( job_title ilike :keyword OR location ilike :keyword OR display_name ilike :keyword )  AND level = :level AND customshowonwebsite = :customshowonwebsite'
                }
                whereobject = {
                    ...whereobject,
                    keyword: `%${query.searchFilter}%`,
                };
            }
        } else {
            whereClause = 'level = :level AND customshowonwebsite = :customshowonwebsite'
        }
        console.log(whereClause);
        console.log(whereobject);
        const bambooRepo = getRepository(BambooEntity);
        const promises = bambmooUserLevel.map(async (element) => {
            const users = await bambooRepo.createQueryBuilder()
                .where(`${whereClause}`,
                    { level: element.level, ...whereobject, customshowonwebsite: isVisible })
                .orderBy('hire_date', 'ASC')
                .addOrderBy('job_title', 'ASC')
                .getMany()
            return { heirarchyLevel: element.name, heirarchyId: element.level, employees: users }
        });
        const result = await Promise.all(promises);

        result.forEach((record: any) => {
            record.employees.sort(this.compare)
        });
        return result;

        // let visibleEmails = await bambooRepo.find();
        // return visibleEmails;
        // return visibleEmails.map((employee: any) => ({
        //   displayName: `${employee.firstName} ${employee.lastName}`,
        //   firstName: employee.firstName,
        //   lastName: employee.lastName,
        //   jobTitle: '', //na
        //   workEmail: employee.email,
        //   department: '', //na
        //   photoUrl: employee.imageUrl,
        //   division: '', //na
        //   location: '',//na
        // }));
    }

    savePublicContact(payload: PublicContactDTO) {
        const repo = getRepository(PublicContactsEntity);
        return repo.save(payload);
    }

    async getDealerships() {
        const dealerGroup = await getRepository(DealershipEntity)
            .createQueryBuilder('dealerships')
            .leftJoinAndSelect('dealerships.images', 'images')
            .leftJoinAndSelect('dealerships.openingHours', 'openingHours')
            .where(
                'dealerships.isVisible = :isVisible AND dealerships.status = :status',
                { isVisible: true, status: AccountStatus.ACTIVE },
            )
            .getMany();
        dealerGroup.map((p) => {
            p.openingHours = p.openingHours.sort((a, b) => {
                if (a.id > b.id) return 1;
                return -1;
            });
            return p;
        });
        return dealerGroup;
    }

    async getProvince() {
        const repo = await getRepository(ProvinceEntity);
        return repo.find();
    }

    setEmptyValue(value) {
        return value != '' ? value : '';
    }

    async sendContactMail(payload) {
        const promise = new Promise((resolve, reject) => {
            this.sgMail
                .send({
                    to: payload.to,
                    from: payload.email,
                    subject: `${payload.fullname} sent you a contact us form`,
                    html: `<div><p> <strong>Name</strong>:  ${this.setEmptyValue(
                        payload.fullname,
                    )}</p><p> <strong>Company</strong>: ${this.setEmptyValue(
                        payload.company,
                    )} </p><p> <strong>Email</strong>:  ${this.setEmptyValue(
                        payload.email,
                    )} </p><p> <strong>Phone</strong>: ${this.setEmptyValue(
                        payload.phone,
                    )}</p><p> <strong>Address</strong>: ${this.setEmptyValue(
                        payload.address,
                    )} </p><p> <strong>Web Address</strong>:  ${this.setEmptyValue(
                        payload.webaddress,
                    )} </p><p> <strong>Message</strong>:  ${this.setEmptyValue(
                        payload.message,
                    )} </p></div>`,
                })
                .then((resp: any) => {
                    console.log('response ', resp[0].statusCode);
                    if (
                        (resp && resp[0].statusCode == 200) ||
                        resp[0].statusCode == 202
                    ) {
                        resolve('Mail sent');
                    }
                })
                .catch((err) => {
                    resolve('Mail Failed');
                });
        });
        return promise;
    }

    public compare(a, b) {
        if (a.internalSort < b.internalSort) {
            return -1;
        } else if (a.internalSort > b.internalSort) {
            return 1;
        } else {
            if (new Date(a.hireDate).getTime() > 0 && (new Date(a.hireDate).getTime() < new Date(b.hireDate).getTime())) {
                return -1;
            } else if (new Date(a.hireDate).getTime() < new Date(b.hireDate).getTime()) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}
