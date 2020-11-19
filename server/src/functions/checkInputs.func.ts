import isBlank from 'is-blank';

export function keyIsSetAndNotEmpty<T extends object, U extends keyof T>(obj: T, key: U): boolean {
    if (key in obj) {
        if (!isBlank(obj[key])) {
            return true;
        }
    }
    return false;
}

export function objectHasRequiredAndNotEmptyKeys<T extends object, U extends keyof T>(obj: T, keys: U[]): boolean {
    let notEmptyOrUnsetArray: boolean[] = keys.map((el) => keyIsSetAndNotEmpty(obj, el));
    let d = notEmptyOrUnsetArray.find(el => !el);
    return d == undefined;
}

export function keyIsNotSet<T extends object, U extends keyof T>(obj: T, key: U): boolean {
    if (!(key in obj)) {
        return true;
    }
    return false;
}

export function checkRequestKeysAreNotEmpty<T extends object, U extends keyof T>(obj: T, keys: U[]): boolean{
    let notEmptyOrSetArray: boolean[] = keys.map((el) => keyIsSetAndNotEmpty(obj, el) || keyIsNotSet(obj, el));
    let d = notEmptyOrSetArray.find(el => !el);
    return d == undefined;
}