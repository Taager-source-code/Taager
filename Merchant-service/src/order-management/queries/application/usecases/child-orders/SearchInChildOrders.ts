import { ChildOrderRepo } from '../../contracts/ChildOrderRepo';
import { ChildOrdersResponse } from '../../models/child-orders/ChildOrdersResponse';
import { Service } from 'typedi';
import { SearchChildOrdersRequest } from '../../models/child-orders/SearchChildOrdersRequest';

@Service({ global: true })
export default class SearchInChildOrders {
  private childOrderRepo: ChildOrderRepo;

  constructor(childOrderRepo: ChildOrderRepo) {
    this.childOrderRepo = childOrderRepo;
  }

  async execute(searchInChildOrders: SearchChildOrdersRequest): Promise<ChildOrdersResponse> {
    return this.childOrderRepo.searchInChildOrders(searchInChildOrders);
  }
}


