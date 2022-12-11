import { ErrorResponse, StatusCodes } from '@401_digital/xrm-core';
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    BadRequestException,
} from '@nestjs/common';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        console.error(exception);
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
       // console.log("payload : ", request.body);
        const response = ctx.getResponse();
        let status, message;
        if (exception instanceof BadRequestException) {
            message = (exception as any).response.message;
        } else {
            message = exception.message;
        }
        if (exception.statusCode) {
            status = exception.statusCode;
        } else {
            status = exception instanceof HttpException ? exception.getStatus() : StatusCodes.INTERNAL_SERVER_ERROR;
        }
        const errorResponse = new ErrorResponse(message) as any;
        if (exception.errorCode || (exception.response && exception.response.errorCode)) {
            errorResponse.errorCode = exception.errorCode || exception.response.errorCode
        }
        response.status(status).json(errorResponse);
    }
}
