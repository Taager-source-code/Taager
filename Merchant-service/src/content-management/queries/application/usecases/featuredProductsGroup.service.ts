import FeaturedProductsGroupRepository from '../../infrastructure/repositories/featuredProductsGroup.repository';
import { isObjectId } from '../../../../authentication/commands/infrastructure/utils/validations';
import { getOrderProducts as getProducts } from '../../../../order-management/queries/application/usecases/order-products/orderProducts.service';

const featuredProductsGroupRepositoryInstance = new FeaturedProductsGroupRepository();

const getOneFeaturedProductsGroup = async query => {
  return featuredProductsGroupRepositoryInstance.getOneFeaturedProductsGroup(query);
};

const sortProducts = prods => {
  const products = [...prods];
  return products.sort((a, b) => (a.sorting > b.sorting ? 1 : b.sorting > a.sorting ? -1 : 0));
};

const getSpeceficProductProps = products => {
  return products.map(product => ({
    _id: product._id,
    productName: product.productName,
    productPrice: product.productPrice,
    productProfit: product.productProfit,
    prodID: product.prodID,
    Category: product.Category,
    categoryId: product.categoryId,
    productPicture: product.productPicture,
    productAvailability: product.productAvailability,
    attributes: product.attributes || [],
  }));
};

const getProductDetails = async products => {
  const productsIds: string[] = [];
  products.forEach(({ _id }) => {
    if (isObjectId(_id)) {
      productsIds.push(_id);
    }
  });
  let result = await getProducts(productsIds);
  result = getSpeceficProductProps(result);
  return result;
};

export const featuredProductsGroupStatuses = Object.freeze({
  FEATURED_PRODUCTS_GROUP_NOT_FOUND: {
    code: 3,
    msg: "Featured product group with that type doesn't exist.",
  },
  FEATURED_PRODUCTS_GROUP_RETRIEVED_SUCCESSFULLY: {
    code: 4,
    msg: 'Featured product group with that type retrieved successfully.',
  },
});

export const getFeaturedProductsGroupByType = async (type, country) => {
  const featuredProductsGroup = await getOneFeaturedProductsGroup({
    type,
    country,
  });

  if (!featuredProductsGroup) {
    return {
      status: featuredProductsGroupStatuses.FEATURED_PRODUCTS_GROUP_NOT_FOUND.code,
      result: {
        data: {},
        msg: featuredProductsGroupStatuses.FEATURED_PRODUCTS_GROUP_NOT_FOUND,
      },
    };
  }
  let { products } = featuredProductsGroup;

  const data: any = {
    products: [],
    type: featuredProductsGroup.type,
  };

  if (products.length) {
    products = sortProducts(products);

    data.products = await getProductDetails(products);
  }

  return {
    status: featuredProductsGroupStatuses.FEATURED_PRODUCTS_GROUP_RETRIEVED_SUCCESSFULLY.code,
    result: {
      data,
      msg: featuredProductsGroupStatuses.FEATURED_PRODUCTS_GROUP_RETRIEVED_SUCCESSFULLY,
    },
  };
};


