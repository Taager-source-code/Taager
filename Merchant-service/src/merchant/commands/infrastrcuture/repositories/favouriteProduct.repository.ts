import MongooseService from '../../../../shared-kernel/infrastructure/db/mongoose';
import FavouriteProductsModel from '../../../common/infrastructure/db/schemas/favouriteProducts.model';

const mongooseServiceInstance = new MongooseService(FavouriteProductsModel);

export async function addProductToFavouriteProducts({ taagerId, product, country }) {
  try {
    const query = {
      query: { taagerId, country },
      update: { $addToSet: { products: product } },
      options: { upsert: true },
    };
    return await mongooseServiceInstance.save(query);
  } catch (err) {
    return err;
  }
}

export async function removeProductFromFavouriteProducts({ country, taagerId, productObjectId }) {
  try {
    const query: any = {
      query: { taagerId, country },
      update: { $pull: { products: { _id: productObjectId } } },
    };
    return await mongooseServiceInstance.save(query);
  } catch (err) {
    return err;
  }
}

export async function findOneFavouriteProduct({ country, taagerId, productObjectId }) {
  try {
    return await mongooseServiceInstance.findOne({
      country,
      taagerId,
      products: { $elemMatch: { _id: productObjectId } },
    });
  } catch (err) {
    return err;
  }
}

export async function findFavouriteProduct({ country, taagerId }) {
  try {
    return await mongooseServiceInstance.findOne({ country, taagerId });
  } catch (err) {
    return err;
  }
}

export async function updateFavouriteProductPrice({ country, taagerId, productObjectId, price }) {
  try {
    return await mongooseServiceInstance.save({
      query: {
        country,
        taagerId,
        'products._id': productObjectId,
      },
      update: {
        $set: {
          'products.$.customPrice': price,
        },
      },
    });
  } catch (err) {
    return err;
  }
}


