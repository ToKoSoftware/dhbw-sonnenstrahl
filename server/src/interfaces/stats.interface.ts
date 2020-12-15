import {Customer} from '../models/customer.models';
import {Order} from '../models/order.model';
import {Plan} from '../models/plan.model';
import {User} from '../models/user.model';

export type statEntityTypes = typeof User | typeof Customer | typeof Plan | typeof Order;