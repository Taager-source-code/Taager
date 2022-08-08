process.env.SECRET = 'yallahabibi';
import request from 'supertest';
import * as expressServer from '../expressServer/expressServer';
import CountryModel from '../../src/shared-kernel/infrastructure/db/models/CountrySchema';
import { countryFixture } from '../fixtures/countryFixture';
import Product from '../../src/content-management/queries/infrastructure/db/schemas/ProductModel';
import {
  aVariant,
  XL_L_SIZE_SET,
  XL_SIZE,
} from '../../src/content-management/common/infrastructure/db/product.testing.fixture';
import VariantGroup from '../../src/content-management/queries/infrastructure/db/schemas/VariantGroupModel';
import Catalog from '../../src/merchant/common/infrastructure/db/schemas/favouriteProducts.model';
import { GenericContainer } from 'testcontainers';
import {
  connectDefaultConnectionToMongoDB,
  createNonDefaultMongoConnection,
  disconnectDefaultFromMongoDB,
  disconnectNonDefaultFromMongoDB,
} from '../../src/shared-kernel/infrastructure/config/mongoose';
import { secondaryConnection } from '../../src/shared-kernel/infrastructure/config/mongoose-secondary';

const callAddToCatalogAPI = (app, productObjectId, accessToken) => {
  return request(app)
    .patch(`/api/product/favourite/${productObjectId}/set`)
    .set('Authorization', `Bearer ${accessToken}`);
};

const callAddToCatalogWithCountryHeaderAPI = (app, productObjectId, accessToken, country) => {
  return request(app)
    .patch(`/api/product/favourite/${productObjectId}/set`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('country', country);
};

const callRemoveProductFromCatalogAPI = (app, productObjectId, accessToken) => {
  return request(app)
    .patch(`/api/product/favourite/${productObjectId}/unset`)
    .set('Authorization', `Bearer ${accessToken}`);
};

const callRemoveProductFromCatalogWithCountryHeaderAPI = (app, productObjectId, accessToken, country) => {
  return request(app)
    .patch(`/api/product/favourite/${productObjectId}/unset`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('country', country);
};

const callIsProductInCatalogAPI = (app, productObjectId, accessToken) => {
  return request(app)
    .get(`/api/product/favourite/${productObjectId}`)
    .set('Authorization', `Bearer ${accessToken}`);
};

const callIsProductInCatalogWithCountryHeaderAPI = (app, productObjectId, accessToken, country) => {
  return request(app)
    .get(`/api/product/favourite/${productObjectId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('country', country);
};

const callUpdateProductPriceInCatalogAPI = (app, productObjectId, accessToken, newPrice) => {
  return request(app)
    .patch(`/api/product/favourite/${productObjectId}`)
    .send({ price: newPrice })
    .set('Authorization', `Bearer ${accessToken}`);
};

const callUpdateProductPriceInCatalogWithCountryHeaderAPI = (app, productObjectId, accessToken, newPrice, country) => {
  return request(app)
    .patch(`/api/product/favourite/${productObjectId}`)
    .send({ price: newPrice })
    .set('Authorization', `Bearer ${accessToken}`)
    .set('country', country);
};

const callGetCatalogAPI = (app, accessToken) => {
  return request(app)
    .get(`/api/product/favourite`)
    .set('Authorization', `Bearer ${accessToken}`);
};

const callGetCatalogWithCountryHeaderAPI = (app, accessToken, country) => {
  return request(app)
    .get(`/api/product/favourite`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('country', country);
};

describe('/Catalog APIs', () => {
  let app: any = null;

  let firstVariant;

  async function createVariantGroup(id, country = 'EGY') {
    const createdProduct = await Product.create(aVariant(id, [XL_SIZE], country));
    const variantGroup = {
      attributeSets: [XL_L_SIZE_SET],
      variants: [createdProduct._id],
      primaryVariant: createdProduct._id,
      name: 'name',
      country: country,
    };
    const createdVariantGroup = await VariantGroup.create(variantGroup);
    return {
      variantGroup: createdVariantGroup,
      variant: createdProduct,
    };
  }

  async function createVariantGroups() {
    ({ variant: firstVariant } = await createVariantGroup('1D'));

    await createVariantGroup('2D');
    await createVariantGroup('3D');
  }

  const createCountries = async () => {
    await CountryModel.insertMany(countryFixture);
  };

  beforeAll(async () => {
    const container = await new GenericContainer('mongo').withExposedPorts(27017).start();

    const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}/bla`;

    await connectDefaultConnectionToMongoDB(mongoUri);
    await createNonDefaultMongoConnection(secondaryConnection, mongoUri);

    app = expressServer.setupServer();
    await createCountries();
    await createVariantGroups();
  });

  describe('/api/product', () => {
    describe('/favourite/:id - Check if a product is in catalog', () => {
      describe('200', () => {
        test('Response should return false if there is no product in catalog', async () => {
          // Arrange
          const accessToken = (await expressServer.registerAndLogin(app)).data;

          // Act
          const isProductInCatalogResponse = await callIsProductInCatalogAPI(app, firstVariant._id, accessToken);

          // Assert
          expect(isProductInCatalogResponse.statusCode).toEqual(200);
          expect(isProductInCatalogResponse.body).toEqual(false);
        });

        test('Response should return false if there is no product in catalog with country header is SAU', async () => {
          // Arrange
          const accessToken = (await expressServer.registerAndLogin(app)).data;

          // Act
          const isProductInCatalogResponse = await callIsProductInCatalogWithCountryHeaderAPI(
            app,
            firstVariant._id,
            accessToken,
            'SAU',
          );

          // Assert
          expect(isProductInCatalogResponse.statusCode).toEqual(200);
          expect(isProductInCatalogResponse.body).toEqual(false);
        });

        test('Response should return true if there is a product in catalog', async () => {
          // Arrange
          const accessToken = (await expressServer.registerAndLogin(app)).data;
          await callAddToCatalogAPI(app, firstVariant._id, accessToken);

          // Act
          const isProductInCatalogResponse = await callIsProductInCatalogAPI(app, firstVariant._id, accessToken);

          // Assert
          expect(isProductInCatalogResponse.statusCode).toEqual(200);
          expect(isProductInCatalogResponse.body).toEqual(true);
        });

        test('Response should return true if there is a product in catalog with country header is SAU', async () => {
          // Arrange
          const accessToken = (await expressServer.registerAndLogin(app)).data;
          const { variant } = await createVariantGroup('5D', 'SAU');
          await callAddToCatalogWithCountryHeaderAPI(app, variant._id, accessToken, 'SAU');

          // Act
          const isProductInCatalogResponse = await callIsProductInCatalogWithCountryHeaderAPI(
            app,
            variant._id,
            accessToken,
            'SAU',
          );

          // Assert
          expect(isProductInCatalogResponse.statusCode).toEqual(200);
          expect(isProductInCatalogResponse.body).toEqual(true);
        });
      });

      describe('400', () => {
        test('Response code should be 400 with country header is EGY_IS_WRONG_HEADER', async () => {
          // Arrange
          const accessToken = (await expressServer.registerAndLogin(app)).data;

          // Act
          const isProductInCatalogResponse = await callIsProductInCatalogWithCountryHeaderAPI(
            app,
            firstVariant._id,
            accessToken,
            'EGY_IS_WRONG_HEADER',
          );

          // Assert
          expect(isProductInCatalogResponse.statusCode).toEqual(400);
        });
      });
    });

    describe('/favourite/:id - Update product price in catalog', () => {
      describe('200', () => {
        test('Update product price in catalog', async () => {
          // Arrange
          const accessToken = (await expressServer.registerAndLogin(app)).data;
          const catalogResponseBeforeAddingTheProduct = await callGetCatalogAPI(app, accessToken);
          await callAddToCatalogAPI(app, firstVariant._id, accessToken);
          const catalogResponseAfterAddingTheProduct = await callGetCatalogAPI(app, accessToken);
          const newPrice = 500;

          // Act
          const updateProductPriceInCatalogResponse = await callUpdateProductPriceInCatalogAPI(
            app,
            firstVariant._id,
            accessToken,
            newPrice,
          );

          // Assert
          const catalogResponseAfterUpdatingTheProduct = await callGetCatalogAPI(app, accessToken);

          expect(updateProductPriceInCatalogResponse.statusCode).toEqual(200);
          expect(catalogResponseBeforeAddingTheProduct.body).toEqual([]);
          expect(catalogResponseAfterAddingTheProduct.body[0].customPrice).toEqual(firstVariant.productPrice);
          expect(catalogResponseAfterUpdatingTheProduct.body[0].customPrice).toEqual(newPrice);
        });

        test('Should Update product price in catalog with country header is ARE', async () => {
          // Arrange
          const { variant } = await createVariantGroup('15D', 'ARE');
          const accessToken = (await expressServer.registerAndLogin(app)).data;
          const catalogResponseBeforeAddingTheProduct = await callGetCatalogWithCountryHeaderAPI(
            app,
            accessToken,
            'ARE',
          );
          await callAddToCatalogWithCountryHeaderAPI(app, variant._id, accessToken, 'ARE');
          const catalogResponseAfterAddingTheProduct = await callGetCatalogWithCountryHeaderAPI(
            app,
            accessToken,
            'ARE',
          );
          const newPrice = 500;

          // Act
          const updateProductPriceInCatalogResponse = await callUpdateProductPriceInCatalogWithCountryHeaderAPI(
            app,
            variant._id,
            accessToken,
            newPrice,
            'ARE',
          );

          // Assert
          const catalogResponseAfterUpdatingTheProduct = await callGetCatalogWithCountryHeaderAPI(
            app,
            accessToken,
            'ARE',
          );

          expect(updateProductPriceInCatalogResponse.statusCode).toEqual(200);
          expect(catalogResponseBeforeAddingTheProduct.body).toEqual([]);
          expect(catalogResponseAfterAddingTheProduct.body[0].customPrice).toEqual(variant.productPrice);
          expect(catalogResponseAfterUpdatingTheProduct.body[0].customPrice).toEqual(newPrice);
        });
      });

      describe('400', () => {
        test('Should not Update product price in catalog with country header is ARE1', async () => {
          // Arrange
          const accessToken = (await expressServer.registerAndLogin(app)).data;
          const newPrice = 500;

          // Act
          const updateProductPriceInCatalogResponse = await callUpdateProductPriceInCatalogWithCountryHeaderAPI(
            app,
            firstVariant._id,
            accessToken,
            newPrice,
            'ARE1',
          );

          // Assert
          expect(updateProductPriceInCatalogResponse.statusCode).toEqual(400);
        });
      });
    });

    describe('/favourite - Get catalog products', () => {
      describe('200', () => {
        test('Get catalog products', async () => {
          // Arrange
          const accessToken = (await expressServer.registerAndLogin(app)).data;
          const catalogResponseBeforeAddingTheProduct = await callGetCatalogAPI(app, accessToken);
          await callAddToCatalogAPI(app, firstVariant._id, accessToken);

          // Act
          const catalogResponseAfterAddingTheProduct = await callGetCatalogAPI(app, accessToken);

          // Assert
          expect(catalogResponseAfterAddingTheProduct.statusCode).toEqual(200);
          expect(catalogResponseBeforeAddingTheProduct.body).toEqual([]);
          expect(catalogResponseAfterAddingTheProduct.body[0].customPrice).toEqual(firstVariant.productPrice);
        });

        test('Get catalog products with country header is SAU', async () => {
          // Arrange
          const accessToken = (await expressServer.registerAndLogin(app)).data;
          const catalogResponseBeforeAddingTheProduct = await callGetCatalogAPI(app, accessToken);
          const { variant } = await createVariantGroup('7D', 'SAU');
          await callAddToCatalogWithCountryHeaderAPI(app, variant._id, accessToken, 'SAU');

          // Act
          const catalogResponseAfterAddingTheProduct = await callGetCatalogWithCountryHeaderAPI(
            app,
            accessToken,
            'SAU',
          );

          // Assert
          expect(catalogResponseAfterAddingTheProduct.statusCode).toEqual(200);
          expect(catalogResponseBeforeAddingTheProduct.body).toEqual([]);
          expect(catalogResponseAfterAddingTheProduct.body[0].customPrice).toEqual(firstVariant.productPrice);
        });
      });

      describe('400', () => {
        test('Should not get catalog products and the response code should be 400 with country header is wrong', async () => {
          // Arrange
          const accessToken = (await expressServer.registerAndLogin(app)).data;

          // Act
          const catalogResponse = await callGetCatalogWithCountryHeaderAPI(app, accessToken, 'WRONG');

          // Assert
          expect(catalogResponse.statusCode).toEqual(400);
        });
      });
    });

    describe('/favourite/:id/set - Add product to catalog', () => {
      describe('200', () => {
        test('Add product to catalog', async () => {
          // Arrange
          const accessToken = (await expressServer.registerAndLogin(app)).data;
          const isProductInCatalogResponseBeforeAddingTheProduct = await callIsProductInCatalogAPI(
            app,
            firstVariant._id,
            accessToken,
          );

          // Act
          const catalogResponse = await callAddToCatalogAPI(app, firstVariant._id, accessToken);

          // Assert
          const isProductInCatalogResponseAfterAddingTheProduct = await callIsProductInCatalogAPI(
            app,
            firstVariant._id,
            accessToken,
          );

          expect(catalogResponse.statusCode).toEqual(200);
          expect(isProductInCatalogResponseBeforeAddingTheProduct.body).toEqual(false);
          expect(isProductInCatalogResponseAfterAddingTheProduct.body).toEqual(true);
        });
      });

      describe('400', () => {
        test('Should not add product to catalog and the response should be 400 with country header is AREEGY', async () => {
          // Arrange
          const accessToken = (await expressServer.registerAndLogin(app)).data;

          // Act
          const catalogResponse = await callAddToCatalogWithCountryHeaderAPI(
            app,
            firstVariant._id,
            accessToken,
            'AREEGY',
          );

          // Assert
          expect(catalogResponse.statusCode).toEqual(400);
        });
      });

      describe('404', () => {
        test('Add SAU product to ARE catalog should fail and the response should 404', async () => {
          // Arrange
          const accessToken = (await expressServer.registerAndLogin(app)).data;
          const { variant } = await createVariantGroup('9D', 'SAU');

          // Act
          const catalogResponse = await callAddToCatalogWithCountryHeaderAPI(app, variant._id, accessToken, 'ARE');

          // Assert
          expect(catalogResponse.statusCode).toEqual(404);
        });
      });
    });

    describe('/favourite/:id/unset - Remove product to catalog', () => {
      describe('200', () => {
        test('Remove product from catalog', async () => {
          // Arrange
          const accessToken = (await expressServer.registerAndLogin(app)).data;
          await callAddToCatalogAPI(app, firstVariant._id, accessToken);
          const isProductInCatalogResponseBeforeRemove = await callIsProductInCatalogAPI(
            app,
            firstVariant._id,
            accessToken,
          );

          // Act
          const removeProductFromCatalogResponse = await callRemoveProductFromCatalogAPI(
            app,
            firstVariant._id,
            accessToken,
          );

          // Assert
          const isProductInCatalogResponseAfterRemove = await callIsProductInCatalogAPI(
            app,
            firstVariant._id,
            accessToken,
          );

          expect(removeProductFromCatalogResponse.statusCode).toEqual(200);
          expect(isProductInCatalogResponseBeforeRemove.body).toEqual(true);
          expect(isProductInCatalogResponseAfterRemove.body).toEqual(false);
        });

        test('Remove product from catalog with country header is EGY', async () => {
          // Arrange
          const accessToken = (await expressServer.registerAndLogin(app)).data;
          await callAddToCatalogWithCountryHeaderAPI(app, firstVariant._id, accessToken, 'EGY');
          const isProductInCatalogResponseBeforeRemove = await callIsProductInCatalogWithCountryHeaderAPI(
            app,
            firstVariant._id,
            accessToken,
            'EGY',
          );

          // Act
          const removeProductFromCatalogResponse = await callRemoveProductFromCatalogWithCountryHeaderAPI(
            app,
            firstVariant._id,
            accessToken,
            'EGY',
          );

          // Assert
          const isProductInCatalogResponseAfterRemove = await callIsProductInCatalogWithCountryHeaderAPI(
            app,
            firstVariant._id,
            accessToken,
            'EGY',
          );

          expect(removeProductFromCatalogResponse.statusCode).toEqual(200);
          expect(isProductInCatalogResponseBeforeRemove.body).toEqual(true);
          expect(isProductInCatalogResponseAfterRemove.body).toEqual(false);
        });
      });

      describe('400', () => {
        test('Should not remove product from catalog and the response code should be 400 with country header is EGY4', async () => {
          // Arrange
          const accessToken = (await expressServer.registerAndLogin(app)).data;

          // Act
          const removeProductFromCatalogResponse = await callRemoveProductFromCatalogWithCountryHeaderAPI(
            app,
            firstVariant._id,
            accessToken,
            'EGY4',
          );

          // Assert

          expect(removeProductFromCatalogResponse.statusCode).toEqual(400);
        });
      });
    });
  });

  afterEach(async () => {
    await Catalog.deleteMany({});
  });

  afterAll(async () => {
    await disconnectDefaultFromMongoDB();
    await disconnectNonDefaultFromMongoDB(secondaryConnection);
    app = null;
  });
});


