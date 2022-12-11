import { ResponseDta } from "@model";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let returnData = new ResponseDta();
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const goodResponse = (
    response?: any,
    message?: string,
    meta?: any,
): ResponseDta => {

    return (returnData = {
        data: {
            data: response,
            meta: meta,
        },
        success: true,
        message: message,
        statusCode: 200,
    });
};

export const warrantyResponse = (
    response?: any,
    message?: string,
): ResponseDta => {

    return (returnData = {
        data: response,
        success: true,
        message: message,
        statusCode: 200,
    });
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const errorResponse = (error?: any): ResponseDta => {
    console.log('Log: error', error);
    if (error) {
        console.log('a--------');

        if (error.statusCode) {
            console.log('b--------');

            return (returnData = {
                data: {
                    data: {},
                    meta: {}
                },
                message: error.message,
                success: false,
                statusCode: error.statusCode,
                error: error.error,
            });
        } else if (error.response) {
            console.log('c--------');

            return (returnData = {
                data: {
                    data: {},
                    meta: {}
                },
                message: error.response.message[0],
                success: false,
                statusCode: error.response.statusCode,
                error: error.response.error,
            });
        } else {
            if (error.sqlMessage) {
                return (returnData = {
                    data: {
                        data: {},
                        meta: {}
                    },
                    message: 'Request failed',
                    success: false,
                    statusCode: 400,
                    error: error.sqlMessage,
                });
            }
            return (returnData = {
                data: {
                    data: {},
                    meta: {}
                },
                message: 'Request failed',
                success: false,
                statusCode: 400,
                error: '',
            });
        }
        return (returnData = {
            data: {
                data: {},
                meta: {}
            },
            message: error.response.message[0],
            success: false,
            statusCode: error.response.statusCode,
            error: error.response.error,
        });
    } else {
        return (returnData = {
            data: {
                data: {},
                meta: {}
            },
            message: error.response.message[0],
            success: false,
            statusCode: error.response.statusCode,
            error: error.response,
        });
    }
};