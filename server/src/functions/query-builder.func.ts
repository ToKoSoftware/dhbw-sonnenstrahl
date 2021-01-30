import {Request} from 'express';
import isBlank from 'is-blank';
import {Vars} from '../vars';
import {FindOptions} from 'sequelize';

/**
 * Given an request and builder configuration, this the query builder will generate a sequelize query using get parameters
 * Currently supported are: Filters, Limit, Offset, (Like-) Search, Order
 * @param {QueryBuilderConfig} config
 * @param {Request} req
 */
export function buildQuery(config: QueryBuilderConfig, req: Request): QueryBuilderData {
    if (config.allowLimitAndOffset) {
        config.query = buildLimitAndOffset(config.query, req);
    }
    if (config.allowedSearchFields && config.searchString) {
        config.query = buildOrLikeSearchQuery(config.query, config.searchString, config.allowedSearchFields);
    }
    if (config.allowedFilterFields) {
        config.query = buildFilter(config.query, req, config.allowedFilterFields, config.customFilterResolver);
    }
    if (config.allowedOrderFields) {
        config.query = buildOrder(config.query, req, config.allowedOrderFields);
    }
    return config.query;
}

/**
 * Build Limit and Offset limitations
 * @param {QueryBuilderData} query
 * @param {Request} req
 */
export function buildLimitAndOffset(query: QueryBuilderData, req: Request): QueryBuilderData {
    if (req.query.limit && !isBlank(req.query.limit)) {
        if (req.query.offset && !isBlank(req.query.offset)) {
            return {
                ...query,
                ...{
                    offset: parseInt(req.query.offset as string),
                    limit: parseInt(req.query.limit as string),
                }
            };
        }
        return {
            ...query,
            ...{
                limit: parseInt(req.query.limit as string),
            }
        };
    }
    return query;
}

/**
 * Build sorting query
 * @param {QueryBuilderData} query
 * @param {Request} req
 * @param {string[]} allowedOrders
 */
export function buildOrder(query: QueryBuilderData, req: Request, allowedOrders: string[] = []): QueryBuilderData {
    if (req.query.order && !isBlank(req.query.order) || req.query.sort && !isBlank(req.query.sort)) {
        let o = req.query.order as string || req.query.sort as string;
        let direction = 'DESC';
        if (o.charAt(0) === '-') {
            direction = 'ASC';
            o = o.substring(1);
        }
        if (allowedOrders.includes(o)) {
            return {
                ...query,
                order: [
                    [o, direction]
                ]
            };
        }
    }
    return query;
}

/**
 * Allow multiple fields to be searched with Like
 * @param query
 * @param needle
 * @param allowedFields
 */
export function buildOrLikeSearchQuery(query: QueryBuilderData, needle: string, allowedFields: string[] = []): QueryBuilderData {
    const search = {
        [Vars.op.or]: allowedFields.map(
            field => {
                const a: { [name: string]: unknown } = {};
                a[field] = {
                    [Vars.op.iLike]: '%' + needle + '%'
                };
                return a;
            }
        )
    };
    query = mergeQueryBuilderField(query, search);
    return query;
}

/**
 * Allow elements to be filtered by exact field values
 * @param {QueryBuilderData} query
 * @param {Request} req
 * @param {string[]} allowedFields
 * @param {customFilterResolverMap | undefined} customResolver
 */
export function buildFilter(query: QueryBuilderData, req: Request, allowedFields: string[] = [], customResolver: customFilterResolverMap | undefined): QueryBuilderData {
    const filter: { [name: string]: string } = {};
    allowedFields.forEach(field => {
        let value = '';
        if (req.query[field] != undefined && !isBlank(req.query[field])) {
            value = req.query[field] as string;
        }
        if (customResolver != undefined) {
            if (customResolver.has(field) && customResolver.get(field) != undefined) {
                const fun = customResolver.get(field);
                if (fun != undefined) {
                    value = fun.call(0, field, req, value);
                }
            }
        }
        if (value !== '') {
            filter[field] = value;
        }
    });
    query = mergeQueryBuilderField(query, filter);
    return query;
}

/**
 * Given an existing query this function will merge fields or append values to the query
 * @param {QueryBuilderData} query
 * @param {object} newQuery
 * @param {string} fieldName
 */
function mergeQueryBuilderField(query: QueryBuilderData, newQuery: { [s: string]: unknown }, fieldName: keyof QueryBuilderData = 'where'): QueryBuilderData {
    if (Object.prototype.hasOwnProperty.call(query, fieldName)) {
        query[fieldName] = {
            ...query[fieldName],
            ...newQuery
        };
    } else {
        // !Object.keys(search).length is not working here, don't know why
        query[fieldName] = newQuery;
    }
    return query;
}

export interface QueryBuilderData extends FindOptions {
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
