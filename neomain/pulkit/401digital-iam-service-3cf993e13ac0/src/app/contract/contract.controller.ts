import { Body, Controller, Get, Header, Logger, Param, Patch, Post, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger/dist';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ResponseDta } from '@model';
import { AddContractDTO, ContractCostDTO, ContractFilterDTO, ContractReportFilterDTO, ContractStatusDTO } from './contract.dto';
import { ContractService } from './contract.service';
import { PORT } from '@environments';
import { AuthGuard } from '../../core/auth.guard'

@ApiTags('Contract')
@UseGuards(AuthGuard())
@Controller('contract')
export class ContractController {
    private logger = new Logger('ContractController');

    constructor(private contractService: ContractService) { }

    @Post()
    @ApiOperation({ summary: 'Add new contract' })
    async addContract(@Body() data: AddContractDTO): Promise<ResponseDta> {
        this.logger.log('AddiDatang ' + data);
        return this.contractService.addContract(data);
    }
    @Get()
    @ApiOperation({ summary: 'List contracts with filters.Which can be used in track sales page' })
    async getContracts(@Query() data: ContractFilterDTO): Promise<ResponseDta> {
        this.logger.log('AddiDatang ' + data);
        return this.contractService.getContracts(data);
    }

    @Post('contractCost')
    @ApiOperation({ summary: 'Get contract cost' })
    async contractCost(@Body() data: ContractCostDTO): Promise<ResponseDta> {
        this.logger.log('AddiDatang ' + data);
        return this.contractService.contractCost(data);
    }

    @Get('vinSearch/:vinNumber')
    @ApiOperation({ summary: 'Vin search with extra warranty cost eg.1C6RR7GT3DS660394' })
    async vinSearchWithWarrentyCost(@Param('vinNumber') vinNumber: string): Promise<ResponseDta> {
        this.logger.log('AddiDatang ' + vinNumber);
        return this.contractService.vinSearchWithWarrentyCost(vinNumber);
    }

    @Get('generateReport')
    @ApiOperation({ summary: 'Generate csv - Use the url with filter params on browser for properfile download experience ' })
    async generateReport(@Query() data: ContractReportFilterDTO, @Req() req, @Res() res) {
        const url = `${req.protocol}://${req.hostname}:${PORT}`;
        const fileData = await this.contractService.generateReport(data, url);
        return res.redirect(`${req.protocol}://${req.hostname}:${PORT}/${fileData}`);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get contract by id' })
    async getContractById(@Param('id') id: number): Promise<ResponseDta> {
        return await this.contractService.getContractById(id);
    }

    @Patch('status/:id')
    @ApiBody({
        description: 'Contract status toggle',
        type: ContractStatusDTO,
    })
    async changeContractStatus(@Param('id') id: number, @Body() data: ContractStatusDTO): Promise<ResponseDta> {
        return await this.contractService.changeContractStatus(id, data);
    }


    @Get('getContractPdf/:id')
    @ApiOperation({ summary: 'Generate csv - use the url on browser along with contract id for proper file download experience' })
    async getContractPdf(@Param('id') id: number, @Req() req, @Res() res: any) {
        const fileData = await this.contractService.getContractPdf(id);
        return res.redirect(`${req.protocol}://${req.hostname}:${PORT}/${fileData}`);
    }


}
