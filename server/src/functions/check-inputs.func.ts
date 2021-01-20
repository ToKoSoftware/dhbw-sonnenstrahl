import isBlank from 'is-blank';

/**
 * Given an object and a key, check if the key is set and not empty
 * @param obj
 * @param key
 * @return boolean
 */
// eslint-disable-next-line
export function keyIsSetAndNotEmpty<T extends object, U extends keyof T>(obj: T, key: U): boolean {
    if (key in obj) {
        if (!isBlank(obj[key])) {
            return true;
        }
    }
    return false;
}

/**
 * Given an an object and an array of keys, check if all required keys are set
 * @param obj
 * @param keys the required keys
 */
// eslint-disable-next-line
export function objectHasRequiredAndNotEmptyKeys<T extends object, U extends keyof T>(obj: T, keys: U[]): boolean {
    const notEmptyOrUnsetArray: boolean[] = keys.map((el) => keyIsSetAndNotEmpty(obj, el));
    const d = notEmptyOrUnsetArray.find(el => !el);
    return d == undefined;
}

/**
 * Given an object, check if keys are either not set or not empty
 * @param obj
 * @param allowedKeys
 */
// eslint-disable-next-line
export function checkKeysAreNotEmptyOrNotSet<T extends object>(obj: T, allowedKeys: string[]): boolean {
    const notEmptyOrNotSet = Object.keys(obj).map(el => {
        if (allowedKeys.includes(el)) {
            const value = obj[el as keyof object];// eslint-disable-line
            if (value != '') {
                return true; // key set and value not empty
            }
            return false; // key set and value empty
        }
        return true; // key not set
    });

    const d = notEmptyOrNotSet.find(el => !el);
    return d == undefined;
}
