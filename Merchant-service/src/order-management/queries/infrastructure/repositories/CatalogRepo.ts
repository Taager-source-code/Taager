import CatalogModel from '../../../../merchant/common/infrastructure/db/schemas/favouriteProducts.model';

export default class CatalogRepo {
  public async getAvailableProductsInCatalogCount(taagerId, country): Promise<number> {
    const catalog = await CatalogModel.findOne({
      country,
      taagerId,
    }).exec();

    if (!catalog || !catalog.products) return 0;
    return catalog.products.length;
  }
}


