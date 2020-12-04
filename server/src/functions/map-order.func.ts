import { IncomingOrder, IncomingUpdateOrder, InternalOrder } from '../interfaces/orders.interface';

export function mapOrder(incomingData: IncomingOrder, custId: string): InternalOrder {
    return {
        customerId: custId,
        consumption: incomingData.consumption,
        is_active: true,
        planId: incomingData.rateId,
        referrer: incomingData.agent,
        terminatedAt: null
    }
}

export function mapUpdateOrder(incomingData: IncomingUpdateOrder): InternalOrder {
    return {
        customerId: incomingData.customerId,
        planId: incomingData.rateId,
        referrer: incomingData.agent,
        consumption: incomingData.consumption,
        is_active: true,
        terminatedAt: null
    }
}
