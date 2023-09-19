const convertCamelToSnakeCase = (obj: any): any => {

    if (typeof obj !== 'object' || obj === null) {
        return obj; // Return as is if it's not an object
    }

    const snakeObj: any = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
            snakeObj[snakeKey] = convertCamelToSnakeCase(obj[key]);
        }
    }

    return snakeObj;

};

export default convertCamelToSnakeCase;