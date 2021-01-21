import {IncomingExternalOrder, IncomingInternalOrder, InternalOrder} from '../interfaces/orders.interface';

/**
 * Map incoming order data into internal format for external api requests
 * @param {IncomingExternalOrder} incomingData
 * @param {string} custId
 * @returns {InternalOrder}
 */
export function mapOrder(incomingData: IncomingExternalOrder, custId: string): InternalOrder {
    return {
        customerId: custId,
        consumption: incomingData.consumption,
        is_active: true, // A new order is always active
        planId: incomingData.rateId,
        referrer: incomingData.agent,
        terminatedAt: null // A new order is always not terminated
    };
}

/**
 * Map incoming order data into internal format
 * @param incomingData
 * @returns {InternalOrder}
 */
export function mapInternalOrder(incomingData: IncomingInternalOrder): InternalOrder {
    return {
        customerId: incomingData.customerId,
        planId: incomingData.planId,
        referrer: incomingData.agent,
        consumption: incomingData.consumption,
        is_active: true, // A new order is always active
        terminatedAt: null // A new order is always not terminated
    };
}
