import { VEHICLE_API_KEY, VEHICLE_API_URL } from '@environments';
import { generateContractPdf, generateCSV, generatePdfInvoice } from '@config';
import { AddContractDTO, ContractCostDTO, ContractFilterDTO, ContractReportFilterDTO, ContractStatusDTO } from './contract.dto';
import { ContractEntity } from './contract.entity';
import { ConflictException, HttpService, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getFileNameFromUrl } from '../../helpers/Common.helper';
import {LimitOffset} from '../../helpers/Pagination.helper'
import { errorResponse, goodResponse } from '../../helpers/response.helper';
import { Between, In, Like, Repository } from 'typeorm';
import moment from 'moment';
import { DealershipEntity } from '../dealership/dealership.entity';
import { ServiceEntity } from './service.entity';
import { WarrantyServiceEntity } from '../warranty/warrantyServicies.entity';
import { warrantyClass } from '../../constants/warrantyPlanOption'

@Injectable()
export class ContractService {
    constructor(
        @InjectRepository(ContractEntity)
        private readonly contractRepository: Repository<ContractEntity>,
        @InjectRepository(DealershipEntity)
        private readonly dealerRepository: Repository<DealershipEntity>,
        @InjectRepository(ServiceEntity)
        private readonly serviceRepository: Repository<ServiceEntity>,
        @InjectRepository(WarrantyServiceEntity)
        private readonly warrantyServiceRepository: Repository<WarrantyServiceEntity>,
        private httpService: HttpService
    ) { }

    public async addContract(data: AddContractDTO) {

        const contract = await this.contractRepository.findOne({
            where: {
                unitVinNumber: data.unitVinNumber
            },
            relations: ['warrantyPlanId', 'userId', 'dealerId'],
            order: {
                id: 'DESC'
            }
        });
        let split_data = data.serviceDetails.split(';')
        const service = await this.serviceRepository.find({
            select: ['id', 'service_module', 'max_sp'],
            where: {
                service_module: In(split_data)
            }
        });

        let max_sum = 0
        for (let i = 0; i < service.length; i++) {
            max_sum = max_sum + parseFloat(service[i].max_sp)
        }

        if (contract && contract.status !== 'Void' && contract.status !== 'Expired') {
            throw new ConflictException('A valid contract already exists for the VIN number')
        }

        // vehicle data #start
        const vData = await this.getVehicleData(data.unitVinNumber);
        if (!vData.success) {
            return errorResponse('Invalid VIN Number');
        }
        const { Make: make, Model: model, Year: year, VehicleType: vehicleType, StockNumber: stockNumber, Odometer: odometer } = vData.message;
        data.unitMake = make;
        data.unitModel = model;
        data.unitYear = year;
        data.unitOdometer = odometer;
        // vehicle data #end
        const { make_name } = findClass(data.unitMake);
        const warr_service = await this.warrantyServiceRepository.findOne({
            select: ['max_sp'],
            where: {
                warranty_condition: Like(`%${data.warranty_service}%`),
                warranty_class: Like(`%${make_name}%`)
            }
        });

        if (data.warrantyFee > parseFloat(warr_service.max_sp))
            throw new ConflictException('Warranty fee should be less than or equal to Max Selling Price.')
        if (data.baseFee > max_sum)
            throw new ConflictException('Base fee should be less than or equal to Max Selling Price.')
        const res = await this.contractRepository.save(data);
        return goodResponse(res, "Contract saved successfully")
    }
    public async getContracts(filter: ContractFilterDTO) {

        let whereObj = {};

        if (filter.startDate && filter.endDate) {

            const dFormat = 'YYYY-MM-DD hh:mm:ss';
            const sDate = moment(filter.startDate).format(dFormat);
            const eDate = moment(filter.endDate).format(dFormat);

            if (!moment(sDate, dFormat, true).isValid() || !moment(eDate, dFormat, true).isValid()) throw new NotAcceptableException(`Invalid date format. Required:${dFormat}`)

            whereObj = {
                ...whereObj,
                created_at: Between(sDate, eDate)
            }
        }

        if (filter.type && filter.type != 'All') {
            whereObj = {
                ...whereObj,
                contractType: filter.type
            }
        }

        if (filter.dealer && filter.dealer != 'All') {
            const dealership = await this.dealerRepository.find({
                select: ['id'],
                where: {
                    name: Like(`%${filter.dealer}%`)
                }
            });
            const dealerId = dealership.map(m => m.id);
            whereObj = {
                ...whereObj,
                dealerId: dealerId.length ? In([dealerId]) : 0
            }

        }

        if (filter.firstName) {
            whereObj = {
                ...whereObj,
                firstName: Like(`%${filter.firstName}%`)
            }
        }

        if (filter.lastName) {
            whereObj = {
                ...whereObj,
                lastName: Like(`%${filter.lastName}%`)
            }
        }

        if (filter.vinNumber) {
            whereObj = {
                ...whereObj,
                unitVinNumber: filter.vinNumber
            }
        }

        if (filter.userId) {
            whereObj = {
                ...whereObj,
                userId: filter.userId
            }
        }


        // pagination #start
        let paginate = {};
        if (filter.limit && filter.currentPage) {
            const { limit, offset } = LimitOffset({
                limit: filter.limit,
                currentPage: filter.currentPage
            });
            paginate = {
                take: limit,
                skip: offset
            }
        }
        // pagination #end

        const contracts = await this.contractRepository.find({
            relations: ['warrantyPlanId', 'userId', 'dealerId'],
            where: {
                ...whereObj
            },
            ...paginate
        });
        return goodResponse(contracts, "Contract cost calculated")
    }
    public async contractCost(data: ContractCostDTO) {

        const { totalPrice, hstPrice, subTotal } = costCalculation(data.baseFee, data.taxExempt);

        return goodResponse({
            totalPrice,
            hstPrice,
            subTotal
        }, "Contract cost calculated")
    }

    public async vinSearchWithWarrentyCost(vinNumber: string) {
        try {
            console.log('-----vin search-----');
            const vData = await this.getVehicleData(vinNumber);
            if (!vData.success) {
                return errorResponse('No data found');
            }

            const { Make: make, Model: model, Year: year, VehicleType: vehicleType, StockNumber: stockNumber, Odometer: odometer } = vData.message;
            // EXTRA WARRANTY CALCULATION

            let extraWarrantyCost = 0;
            const unitMakes1 = ['RAM', 'ACURA', 'AUDI', 'BMW', 'MINI', 'SMART', 'CADILLAC', 'JAGUAR', 'MERCEDES', 'SAAB', 'VOLVO', 'INFINITI', 'LEXUS', 'HUMMER', 'LINCOLN'];
            // const unitMakes2 = ['ALFA ROMEO', 'RANGE ROVER', 'MASERATI', 'PORSCHE'];

            if (unitMakes1.includes(make.toUpperCase())) {
                extraWarrantyCost = 300
            }

            return goodResponse({
                vehicleData: {
                    make, model, year, vehicleType, stockNumber, odometer, extraWarrantyCost
                }
            }, "Vehicle details");

        } catch (error) {
            return errorResponse('No data found');
        }
    }

    public async getContractPdf(id: number) {

        const contract = await this.contractRepository.findOne(id, {
            relations: ['warrantyPlanId', 'userId', 'dealerId']
        });
        if (!contract) {
            throw new NotFoundException('Contract not found');
        }
        const dealerData = JSON.parse(JSON.stringify(contract.dealerId));
        const userData = JSON.parse(JSON.stringify(contract.userId));
        const warrantyPlanData = JSON.parse(JSON.stringify(contract.warrantyPlanId));

        let serviceDetailsArr = [];
        let dealerNumber = '';
        let dealerName = '';
        let dealerTelephone = '';
        let dealerFirstName = '';
        let dealerLastName = '';
        let dealerCity = '';
        let dealerStreetAddress = '';
        let dealerProvience = '';
        let salesFirstName = '';
        let salesLastName = '';
        let registrationNumber = '';
        let warrantyPlan = '';
        if (contract.warrantyPlanId) {
            warrantyPlan = warrantyPlanData.warrantyPlanFriendly;
        }
        if (contract.dealerId) {
            dealerNumber = dealerData.dealerNumber;
            dealerName = dealerData.name;
            dealerTelephone = dealerData.phone;
            dealerFirstName = dealerData.principleFirstName;
            dealerLastName = dealerData.principleLastName;
            dealerCity = dealerData.city;
            dealerStreetAddress = dealerData.streetAddress;
            dealerProvience = dealerData.province;
        }
        if (contract.userId) {
            salesFirstName = userData.firstName;
            salesLastName = userData.lastName;
            registrationNumber = userData.registrationNumber;
        }

        const UPurchaseDate = moment(new Date(contract.unitPurchaseDate)).format('YYYY/MM/DD');
        const UContractExpiryDate = moment(new Date(contract.unitContractExpiryDate)).format('YYYY/MM/DD');

        const { firstName, lastName, telephone, streetAddress, city, province, postalCode, unitYear, unitMake, unitModel, unitVinNumber, taxExemptStatusCardNum, coContractHolderFirstName, coContractHolderLastName, coContractHolderTelephone, unitOdometer, unitStockNumber, unitPurchaseDate, unitPurchasePrice, unitContractExpiryDate, vehicleAge, baseFee, optionPrice, serviceDetails, contractNumber, contractType } = contract;

        if (serviceDetails) { // serviceDetails are added ; separated eg.Electronic Rust Module;Undercoating Applied
            serviceDetailsArr = serviceDetails.split(";");
        }

        const { totalPrice, hstPrice, subTotal } = costCalculation(baseFee, taxExemptStatusCardNum ? 0 : 1);


        const contractData = {
            firstName, lastName, telephone, streetAddress, city, province, postalCode, unitYear, unitMake, unitModel, unitVinNumber, unitStockNumber, taxExemptStatusCardNum, coContractHolderFirstName, coContractHolderLastName, coContractHolderTelephone, unitOdometer, unitPurchaseDate, unitPurchasePrice, unitContractExpiryDate, vehicleAge, baseFee, optionPrice, serviceDetails, serviceDetailsArr, contractNumber, totalPrice, hstPrice, subTotal, dealerNumber, dealerName, dealerTelephone, dealerFirstName, dealerLastName, UPurchaseDate, UContractExpiryDate, contractType, dealerCity, dealerStreetAddress, dealerProvience, salesFirstName, salesLastName, registrationNumber, warrantyPlan
        }

        const pdfFile = await generateContractPdf(contractData);
        const fileName = getFileNameFromUrl(pdfFile.filename);

        return `contracts/${fileName}`

    }
    public async getContractById(id: number) {
        const contract = await this.contractRepository.findOne(id, {
            relations: ['warrantyPlanId', 'userId', 'dealerId']
        });

        return goodResponse({
            contract
        }, "Contract details")
    }
    public async changeContractStatus(id: number, data: ContractStatusDTO) {

        const contract = await this.contractRepository.findOne(id);
        if (!contract) throw new NotFoundException('Contract not found');
        const contractUpdate = await this.contractRepository.save({
            ...contract,
            ...data
        })
        return goodResponse({
            contractUpdate
        }, "Contract status updated")
    }

    public async generateReport(filter: ContractReportFilterDTO, url: any) {

        let whereObj = {};

        if (filter.startDate && filter.endDate) {

            const dFormat = 'YYYY-MM-DD hh:mm:ss';
            const sDate = moment(filter.startDate).format(dFormat);
            const eDate = moment(filter.endDate).format(dFormat);

            if (!moment(sDate, dFormat, true).isValid() || !moment(eDate, dFormat, true).isValid()) throw new NotAcceptableException(`Invalid date format. Required:${dFormat}`)

            whereObj = {
                ...whereObj,
                created_at: Between(sDate, eDate)
            }
        }

        if (filter.type && filter.type != 'All') {
            whereObj = {
                ...whereObj,
                contractType: filter.type
            }
        }

        if (filter.dealer && filter.dealer != 'All') {
            const dealership = await this.dealerRepository.find({
                select: ['id'],
                where: {
                    name: Like(`%${filter.dealer}%`)
                }
            });
            const dealerId = dealership.map(m => m.id);
            whereObj = {
                ...whereObj,
                dealerId: dealerId.length ? In([dealerId]) : 0
            }

        }


        const contracts = await this.contractRepository.find({
            relations: ['warrantyPlanId', 'userId', 'dealerId'],
            where: {
                ...whereObj
            },
        });
        const dataSet = getCsvDataSet(JSON.parse(JSON.stringify(contracts)));

        const fileName = 'contracts';
        if (filter.reportType === 'csv') {
            await generateCSV(dataSet, fileName)
            return `contracts/${fileName}.csv`
        }
        await generatePdfInvoice(dataSet, url);
        return `contracts/invoice.pdf`

    }
    private async getVehicleData(vinNumber) {
        const apiUrl = `${VEHICLE_API_URL}/${vinNumber}`;
        const vehicle = await this.httpService.get(apiUrl, {
            headers: {
                'x-api-key': VEHICLE_API_KEY,
            },
        }).toPromise();
        return vehicle.data;
    }
}

function costCalculation(bFee, taxExempt) {
    let baseFee = parseFloat(bFee.replace("$", "").replace(",", ""));
    if (isNaN(baseFee)) baseFee = 0;
    let totalPrice = baseFee;
    let hstPrice = 0;
    const subTotal = baseFee;
    if (!taxExempt) {
        hstPrice = parseFloat((baseFee * 0.13).toFixed(2));
        baseFee = parseFloat((baseFee * 1.13).toFixed(2));
        totalPrice = baseFee
    }

    return {
        totalPrice, hstPrice, subTotal
    }
}
function getCsvDataSet(contracts) {
    return contracts.map((c) => {
        return {
            'Contract Date': c.contractDate,
            'Stock Number': c.unitStockNumber,
            'Dealership Location': `${c.dealerId.streetAddress},${c.dealerId.city},${c.dealerId.province}`,
            'Sales Person': `${c.userId.firstName} ${c.userId.lastName}`,
            'Contract Number': c.contractNumber,
            'Contract Status': c.status,
            'Customer First Name': c.firstName,
            'Customer Last Name': c.lastName,
            'VIN': c.unitVinNumber,
            'Make': c.unitMake,
            'Model': c.unitModel,
            'Selected Product': c.warrantyPlanId.warrantyPlanFriendly,
            'Cost': 0,
            'Taxes(13%)': 0,
            'Total': 0,
            'Type': c.contractType
        }

    })
}
function findClass(make) {
    let getMake = warrantyClass.filter(item => item.makes.includes(make))
    let make_name: string = ''
    if (getMake.length)
        make_name = getMake[0].class

    return { make_name }
}


