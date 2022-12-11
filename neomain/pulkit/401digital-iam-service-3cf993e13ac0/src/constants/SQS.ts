export const SQS = {
    forgetPassword: {
        type: 'FORGET_PASSWORD',
        operationalTypeForCustomer: 'CUSTOMER_FORGET_PASSWORD',
        operationalTypeForStaff: 'STAFF_FORGET_PASSWORD'
    },
    reminderEmail:{
        type:'REMINDER_EMAIL',
        operationalTypeForStaff:'STAFF_REMINDER_EMAIL'
    },
    manualPasswordChange:{
        type:'MANUAL_PASSWORD',
        operationalTypeForStaff:'MANUAL_PASSWORD_EMAIL'
    }
}
