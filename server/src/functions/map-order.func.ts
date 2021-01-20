import {IncomingExternalOrder, IncomingInternalOrder, InternalOrder} from '../interfaces/orders.interface';

/**
 * Map incoming order data into internal format for external api requests
 * @param incomingData
 * @param custId
 */
export function mapOrder(incomingData: IncomingExternalOrder, custId: string): InternalOrder {
    return {
        customerId: custId,
        consumption: incomingData.consumption,
        is_active: true,
        planId: incomingData.rateId,
        referrer: incomingData.agent,
        terminatedAt: null
    };
}

/**
 * Map incoming order data into internal format
 * @param incomingData
 */
export function mapInternalOrder(incomingData: IncomingInternalOrder): InternalOrder {
    return {
        customerId: incomingData.customerId,
        planId: incomingData.planId,
        referrer: incomingData.agent,
        consumption: incomingData.consumption,
        is_active: true,
        terminatedAt: null
    };
}
