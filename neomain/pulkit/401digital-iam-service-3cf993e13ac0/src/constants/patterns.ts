export const ValidatorPatterns = {
    Date: {
        YYYYMMDD: /\d{4}-\d{2}-\d{2}/,
    },
    Time: {
        HHMM: /([01]?[0-9]|2[0-3]):[0-5][0-9]/,
    },
    PostalCodesPattern: new RegExp('([A-Z0-9][A-Z0-9][A-Z0-9][*]{3}$)|([A-Z0-9][A-Z0-9][A-Z0-9][*]{3},[A-Z0-9][A-Z0-9][A-Z0-9][*]{3})+$')
};
