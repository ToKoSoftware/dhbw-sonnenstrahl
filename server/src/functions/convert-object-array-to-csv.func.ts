import { Vars } from "../vars";

export function convertObjectArrayToCsv(objectArray: Object[], columnDelimiter: string = ";", lineDelimiter: string = "\n") {
    let result = "";
    const keys: string[] = Object.keys(objectArray[0])
    //Set headerline of csv data

    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    objectArray.forEach(el => {
        result += Object.values(el).join(columnDelimiter);
        result += lineDelimiter;
    })
    return result;
}