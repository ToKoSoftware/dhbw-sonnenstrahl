/**
 * Given an array of objects, this function generates an CSV file
 * @param {Object[]} objectArray
 * @param {string} columnDelimiter
 * @param {string} lineDelimiter
 */
// eslint-disable-next-line
export function convertObjectArrayToCsv(objectArray: Object[], columnDelimiter = ';', lineDelimiter = '\n') {
    let result = '';
    const keys: string[] = Object.keys(objectArray[0]);
    // Set header line of csv data
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    objectArray.forEach(el => {
        result += Object.values(el).join(columnDelimiter);
        result += lineDelimiter;
    });
    return result;
}
