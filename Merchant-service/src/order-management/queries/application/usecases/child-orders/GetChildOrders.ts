import { GetChildOrdersRequest } from '../../models/child-orders/GetChildOrdersRequest';
import { ChildOrderRepo } from '../../contracts/ChildOrderRepo';
import { ChildOrdersResponse } from '../../models/child-orders/ChildOrdersResponse';
import { Service } from 'typedi';

@Service({ global: true })
export default class GetChildOrders {
  private childOrderRepo: ChildOrderRepo;

  constructor(childOrderRepo: ChildOrderRepo) {
    this.childOrderRepo = childOrderRepo;
  }

  async execute(getChildOrders: GetChildOrdersRequest): Promise<ChildOrdersResponse> {
    return this.childOrderRepo.getChildOrders(getChildOrders);
  }
}


