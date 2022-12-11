import { Injectable } from '@nestjs/common';
import { getRepository, In } from 'typeorm';
import { HttpHelper } from '@401_digital/xrm-core';
import { bambmooUserLevel } from '../constants';

import { ConfigService } from '@nestjs/config';

import { BAMBOOEMPDIR, BAMBOOEMPDETAIL, BAMBOOEMPFIELD } from '../environment';
import { EmployeeEntity } from 'src/entities/employee';
import { BambooEntity } from 'src/entities/bamboo';

@Injectable()
export class BambooHelpers {
    private http: HttpHelper<any>;
    constructor(private config: ConfigService) {
        this.http = new HttpHelper(this.config.get('BAMBOOHR_HOST'));
    }

    public async getEmployeeDirectory() {
        try {
            const { employees } = await this.http.get(BAMBOOEMPDIR, {
                Accept: 'application/json',
                Authorization: `Basic ${Buffer.from(
                    this.config.get('BAMBOOHR_API_KEY'),
                )}`,
            })
            // console.log(JSON.stringify(employees))
            employees.forEach((element) => {
                element.level = this.getUserLevelForBamboo(element.division);
                element.is_read = true;
                element.id = parseInt(element.id, 10);
            });
            return employees;
        } catch (err) {
            console.log('employee directory error :', err);
        }
    }

    public async mapExistingUser() {
        const employeeList = await this.getEmployeeDirectory(); // fetch all employee from bamboo
        // console.log('employeeList :', employeeList);
        if (employeeList && employeeList.length) {
            const bambooemails = employeeList.map((ele) => ele.workEmail); // take all email ids

            const employeeRepo = getRepository(EmployeeEntity);
            const existEmployees = await employeeRepo.find({
                // check how many of emails are in employee table
                email: In([...bambooemails]),
            });

            const dbEmail = existEmployees.map((ele) => ele.email);
            const employeeToFetchDetails = employeeList.filter((
                em: any, // take only those employee whose email is available in employee
            ) => dbEmail.includes(em.workEmail));

            const BambooRepo = getRepository(BambooEntity);
            const BambooData = await BambooRepo.find({
                id: In([...employeeList.map((ele) => ele.id)]),
            }); //check if we have fetched bamboo data already exist

            const emailExistInBamboo = BambooData.map((ele) => ele.id);
            const newEmployee = employeeList.filter(
                (ele) => !emailExistInBamboo.includes(ele.id),
            ); // check for new employee compare with bamboodb data and final employee list to update visible data
            // console.log('newEmployee.length :', JSON.stringify(employeeList))
            return { newEmployee, employeeToFetchDetails, employeeList, dataExist: true };
        } else {
            return { dataExist: false }
        }
    }

    public getUserLevelForBamboo(division) {
        const userLevel = bambmooUserLevel.filter(
            (userLevel) => division && userLevel.name == division,
        );
        return userLevel.length ? userLevel[0].level : null;
    }

    public setInternalSort(employee) { // use it for internal sort
        employee.internalSort = 999;
        if (employee.division) {
            const level = bambmooUserLevel.find(userLevel => userLevel.name == employee.division);
            if (level) {
                const indexOfSublevel = level.sort.indexOf(employee.jobTitle);
                if (indexOfSublevel >= 0) {
                    employee.internalSort = indexOfSublevel;
                }
                return employee.internalSort;
            } else {
                return employee.internalSort;
            }
        } else {
            return employee.internalSort;
        }
    }

    public async getRecordsFromBamboo() {
        // const { employeeToFetchDetails, newEmployee, employeeList } = await this.mapExistingUser();
        const records = await this.mapExistingUser();
        // console.log('new', newEmployee.length)
        if (records.dataExist) {
            if (records.newEmployee && records.newEmployee.length) { // new employee to insert in Bamboo
                const bambmooRepo = await getRepository(BambooEntity)
                bambmooRepo.createQueryBuilder()
                    .insert()
                    .values(records.newEmployee)
                    .execute()
            } else if (records.employeeToFetchDetails && records.employeeToFetchDetails.length == 0) {
                console.log('employee list is empty')
            } else {
                try {
                    this.updatecustomerViewJson(records.employeeList);
                } catch (err) {
                    console.log('employee details error :', err)
                }
            }
        } else {
            console.log("bamboo directory api error")
        }
    }

    public getIsVisibleflag(body) {
        if (body.customshowonwebsite) {
            return body.customshowonwebsite == "Yes" ? true : false;
        } else {
            return false;
        }
    }

    public async updatecustomerViewJson(employeeList) {
        const bambooRepo = getRepository(BambooEntity);
        let getUnreadBambooRecord = await bambooRepo.createQueryBuilder().where("is_read = false ORDER BY id ASC").getMany();
        if (getUnreadBambooRecord.length == 0) {
            console.log('reset')
            await bambooRepo.update({}, { is_read: false });
        } else {
            let subset = getUnreadBambooRecord.slice(0, 10);
            let promises = []

            subset.forEach((bamboouser: any,) => {
                // console.log('bamboouser.id :', bamboouser.id)
                const promise = new Promise((resolve) => {
                    this.http.get(
                        `${BAMBOOEMPDETAIL}/${bamboouser.id}/?${BAMBOOEMPFIELD}`,
                        {
                            Accept: 'application/json',
                            Authorization: `Basic ${Buffer.from(this.config.get('BAMBOOHR_API_KEY'))}`,
                        },
                    ).then((result: any) => {
                        const { hireDate, ...rest } = result
                        resolve({ ...bamboouser, ...rest, hireDate: new Date(hireDate), photoUrl: employeeList.find(ele=> ele.id == bamboouser.id)?.photoUrl });
                    }).catch((error: any) => {
                        resolve({ id: bamboouser.id })
                    })
                });
                promises.push(promise)
            });
            const data = await Promise.all(promises);
            if (data.length) {
                data.forEach((employee, index) => {
                    if (employee.id && employee.firstName) {
                        if (employee.workEmail) {
                            const employeeRepo = getRepository(EmployeeEntity);
                            employeeRepo.update({ email: employee.workEmail }, { isVisible: this.getIsVisibleflag(employee) })
                        }
                        let extraObject = {};
                        if (employee.division) {
                            // console.log('this.setInternalSort(employee) :', this.setInternalSort(employee), employee.division);
                            extraObject = { ...extraObject, level: this.getUserLevelForBamboo(employee.division), internalSort: this.setInternalSort(employee) }
                        }
                        if (employee.hireDate) {
                            extraObject = { ...extraObject, hireDate: checkDate(employee.hireDate) }
                        }
                        const { id, createdAt, updatedAt, ...rest } = employee
                        // console.log('success :', employee)
                        // console.log('customshow >', { ...rest, is_read: true, ...extraObject, customshowonwebsite: this.getIsVisibleflag(employee) }, employee.id, employee.customshowonwebsite);
                        bambooRepo.update({ id: parseInt(employee.id, 10) }, { ...rest, is_read: true, ...extraObject, customshowonwebsite: this.getIsVisibleflag(employee) })
                            .then((resp) => { })
                            .catch(err => console.log('err :', err));
                    } else {
                        // console.log('delete :', employee.id)
                        bambooRepo.delete({ id: parseInt(employee.id, 10) })
                    }
                });

                function checkDate(hireDate) {
                    if (isNaN(new Date(hireDate).getTime())) {
                        return null
                    } else {
                        return new Date(hireDate)
                    }
                }
            }
        }
    }



}

