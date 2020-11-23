import {IncomingOrder, InternalOrder} from '../interfaces/orders.interface';

export function mapOrder(incomingData: IncomingOrder, custId: string): InternalOrder {
    return {
        customerId: custId,
        consumption: incomingData.consumption,
        is_active: true,
        planId: incomingData.rateId,
        referrer: incomingData.agent
    }
}
