const validator = require('validator');

const requiredFields = [
    'id', 'url', 'title',
    'images', 'country', 'city',
    'address', 'lat', 'lng',
    'parcel', 'living', 'rooms',
    'price', 'currency', 'added'
];

const validateRawData = (processed, propertyData) => {
    let error = null;

    if (requiredFields.some((field) => {
            return typeof propertyData[field] === 'undefined' || !propertyData[field];
        })) {
        error = `Some fields are missing, check again please: ${requiredFields}`
    }
    if (!validator.isURL(propertyData['url'])) {
        error = 'url field should be valid url'
    }
    if (isNaN(propertyData['price'])) {
        error = 'price field should be valid numbers'
    }

    processed.push({
        error,
        raw: propertyData
    })
    return processed;
};

module.exports.validateData = (data) => {
    console.log(data)
    const processedData = data.reduce(validateRawData, []);
    return processedData;
};

module.exports.normalizeRow = ({
    raw: data
}) => {

    return {
        ...data,
        // location_city: data['location_city'].trim(),


    }
};