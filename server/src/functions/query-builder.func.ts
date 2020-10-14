import {Request} from "express";
import isBlank from "is-blank";
import Sequelize, {Op} from "sequelize";

export function buildQuery(config: QueryBuilderConfig, req: Request): QueryBuilderData {
    if (config.allowLimitAndOffset) {
        config.query = buildLimitAndOffset(config.query, req);
    }
    if (config.allowedSearchFields && config.searchString) {
        console.log(2)
        config.query = buildOrLikeSearchQuery(config.query, config.searchString, config.allowedSearchFields);
    }
    if (config.allowedFilterFields && config.customFilterResolver) {
        config.query = buildFilter(config.query, req, config.allowedFilterFields, config.customFilterResolver)
    }
    if (config.allowedOrderFields) {
        config.query = buildOrder(config.query, req, config.allowedOrderFields)
    }
    return config.query;
}

export function buildLimitAndOffset(query: QueryBuilderData, req: Request) {
    if (req.query.limit && !isBlank(req.query.limit)) {
        if (req.query.offset && !isBlank(req.query.offset)) {
            return {
                ...query,
                ...{
                    offset: parseInt(req.query.offset as string),
                    limit: parseInt(req.query.limit as string),
                }
            }
        }
        return {
            ...query,
            ...{
                limit: parseInt(req.query.limit as string),
            }
        }
    }
    return query;
}

export function buildOrder(query: QueryBuilderData, req: Request, allowedOrders: string[] = []) {
    if (req.query.order && !isBlank(req.query.order) || req.query.sort && !isBlank(req.query.sort)) {
        let o = req.query.order as string || req.query.sort as string;
        const direction = o.charAt(0) == "-" ? "ASC" : "DESC";
        o = o.substring(1);
        if (allowedOrders.includes(o)) {
            return {
                ...query,
                order: [
                    [o, direction]
                ]
            }
        }
    }
    return query;
}

export function buildOrLikeSearchQuery(query: QueryBuilderData, needle: string, allowedFields: string[] = []) {
    let lenght = 0;
    let search = {
        [Sequelize.Op.or]: allowedFields.map(field => {
                let a: { [name: string]: unknown } = {};
                a[field] = {
                    [Sequelize.Op.iLike]: '%' + needle + '%'
                }
                lenght++;
                return a;
            }
        )
    }
    if (query?.where) {
        query.where = {
            ...query,
            ...search
        }
    } else if (lenght != 0) {
        // !Object.keys(search).length is not working here, don't know why
        query.where = search;
    }
    return query;
}


export function buildFilter(query: QueryBuilderData, req: Request, allowedFields: string[] = [], customResolver: customFilterResolverMap) {
    let filter: { [name: string]: string } = {};
    allowedFields.forEach(field => {
        let value = '';
        if (req.query[field] != undefined && !isBlank(req.query[field])) {
            value = req.query[field] as string;
        }
        if (customResolver.has(field) && customResolver.get(field) != undefined) {
            let fun = customResolver.get(field);
            if (fun != undefined) {
                value = fun.call(0, field, req, value);
            }
        }
        if (value != '') {
            filter[field] = value;
        }
    });
    if (query?.where) {
        query.where = {
            ...query,
            ...filter
        }
    } else if (Object.keys(filter).length != 0) {
        query.where = filter;
    }
    return query;
}

export interface QueryBuilderData {
    where?: any;
    offset?: number;
    limit?: number;
    raw?: boolean;
}

export type customFilterValueResolver = ((field: string, req: Request, value: string) => any);
export type customFilterResolverMap = Map<string, customFilterValueResolver>;
export interface QueryBuilderConfig {
    query: QueryBuilderData;
    allowedOrderFields?: string[];
    allowedSearchFields?: string[];
    allowLimitAndOffset: boolean;
    allowedFilterFields?: string[];
    customFilterResolver?: customFilterResolverMap;
    searchString?: string;
}
