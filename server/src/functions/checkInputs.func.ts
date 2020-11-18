import { Request } from 'express';
import isBlank from 'is-blank';
import { any } from 'sequelize/types/lib/operators';

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

export function checkRequestKeysAreNotEmpty(req: Request): boolean{
    let allKeysNotEmpty = true;
    req.body.forEach(el => { //TODO kein plan...
        allKeysNotEmpty = allKeysNotEmpty && (el != null);
    });
    return allKeysNotEmpty;
}