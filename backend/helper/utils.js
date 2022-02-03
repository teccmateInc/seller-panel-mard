const utils = {
    asyncRequest: (theFunc) => (req, res, next) => {
        Promise.resolve(theFunc(req, res, next)).catch(next);
    },
    handleError: (res, errorMsg, obj = {}) => {
        return res.send({
            success: false,
            status: 'error',
            message: errorMsg ?? 'Not Found!',
            ...obj,
        });
    },
    handleErrorWithStatus: (res, statusCode, errorMsg, obj = {}, status = 'error') => {
        return res.status(statusCode).send({
            success: false,
            status,
            message: errorMsg ?? 'Not Found!',
            ...obj,
        });
    },
    generateValidationsErrors: (errors) => {
        if (utils.strictValidObjectWithKeys(errors)) {
            const { errors: errs, _message: msg } = errors;
            console.log(utils.strictValidObjectWithKeys(errs));
            if (utils.strictValidObjectWithKeys(errs)) {
                const requiredFields = Object.keys(errs).map((key) => {
                    return { ...errs[key]?.properties };
                });
                return { requiredFields, msg };
            } return { msg };
        }
    },
    strictValidObject: (obj) => {
        return obj &&
            obj === Object(obj) &&
            Object.prototype.toString.call(obj) !== '[object Array]';
    },
    strictValidObjectWithKeys: (obj) => {
        return utils.strictValidObject(obj) &&
            !!Object.keys(obj).length;
    },
    strictValidArray: (arr) => arr && Array.isArray(arr),

    strictValidArrayWithMinLength: (arr, minLength) =>
        utils.strictValidArray(arr) && arr.length >= minLength,

    isArrayOfStrings: (value) => {
        return Array.isArray(value) &&
            value.every((item) => Array.isArray(item));
    },
    isArrayOfNumbers: (value) => {
        return Array.isArray(value) &&
            value.every((item) => typeof item === 'number');
    },
};

module.exports = utils;
