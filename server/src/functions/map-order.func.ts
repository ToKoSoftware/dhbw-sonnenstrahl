import {IncomingExternalOrder, IncomingInternalOrder, InternalOrder} from '../interfaces/orders.interface';

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
