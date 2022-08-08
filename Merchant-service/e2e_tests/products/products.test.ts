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

describe('/Variants and Products APIs', () => {
  let app: any = null;
  let firstVariant;
  let firstVariantGroup;

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
    ({ variantGroup: firstVariantGroup, variant: firstVariant } = await createVariantGroup('1D'));
    await createVariantGroup('2D');
    await createVariantGroup('3D');
  }
  const createCountries = async () => {
    await CountryModel.insertMany(countryFixture);
  };
  async function constructCartAndCatalog() {
    const prodId6 = await createVariantGroup(Math.random().toString());
    const prodId7 = await createVariantGroup(Math.random().toString());
    const prodId8 = await createVariantGroup(Math.random().toString());

    const cartProducts = [
      { qty: 3, product: prodId6.variant._id, preferredMerchantPrice: 300 },
      { qty: 5, product: prodId7.variant._id, preferredMerchantPrice: 310 },
      { qty: 7, product: prodId8.variant._id, preferredMerchantPrice: 320 },
    ];

    const catalogProductOne = {
      _id: prodId6.variant._id,
    };
    return {
      cartProducts,
      catalogProduct: catalogProductOne,
    };
  }

  beforeAll(async () => {
    const container = await new GenericContainer('mongo').withExposedPorts(27017).start();

    const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}/bla`;

    await connectDefaultConnectionToMongoDB(mongoUri);
    await createNonDefaultMongoConnection(secondaryConnection, mongoUri);

    app = expressServer.setupServer();
    await createCountries();
    await createVariantGroups();
  });
  describe('Variant apis', () => {
    test('getting variants should successes', async () => {
      const accessToken = (await expressServer.registerAndLogin(app)).data;
      // GET variantGroup/:id
      const variantGroupByIdResponse = await request(app)
        .get(`/api/variantGroup/${firstVariantGroup._id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(variantGroupByIdResponse.statusCode).toEqual(200);
      expect(String(firstVariantGroup._id)).toEqual(variantGroupByIdResponse.body._id);
      // GET variantGroup/variant/:variantId
      const variantGroupByVariantResponse = await request(app)
        .get(`/api/variantGroup/variant/${firstVariant._id}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(variantGroupByVariantResponse.statusCode).toEqual(200);

      // GET /product/viewProduct/:id
      const productResponse = await request(app)
        .get(`/api//product/viewProduct/${firstVariant._id}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(productResponse.statusCode).toEqual(200);
      console.log(productResponse.body.data);
      expect(productResponse.body.data).toMatchObject({
        _id: firstVariant._id.toString(),
        productAvailability: 'available',
        sellerName: 'sellerName',
        country: 'EGY',
        prodID: '1D',
        productName: 'some product name',
        productPrice: 200,
        prodPurchasePrice: 200,
        productProfit: 100,
        productQuantity: 1,
        productDescription: 'some description',
      });
    });
    test('getting variants in diff country should fail', async () => {
      const accessToken = (await expressServer.registerAndLogin(app)).data;
      // GET variantGroup/:id
      const variantGroupByIdResponse = await request(app)
        .get(`/api/variantGroup/${firstVariantGroup._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', 'ARE');

      expect(variantGroupByIdResponse.statusCode).toEqual(404);

      // GET variantGroup/variant/:variantId
      const variantGroupByVariantResponse = await request(app)
        .get(`/api/variantGroup/variant/${firstVariant._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', 'ARE');
      expect(variantGroupByVariantResponse.statusCode).toEqual(404);
    });
    test('searching for variant groups should succeed', async () => {
      const accessToken = (await expressServer.registerAndLogin(app)).data;
      const searchResponse = await request(app)
        .post(`/api/variantGroups/search`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          sortBy: 'createdAt',
        });
      expect(searchResponse.statusCode).toEqual(200);
      expect(searchResponse.body.results.length).toEqual(3);
    });
    test('searching for variant groups should get search only in SAU ', async () => {
      const accessToken = (await expressServer.registerAndLogin(app)).data;
      await createVariantGroup(Math.random().toString(), 'SAU');
      const searchResponse = await request(app)
        .post(`/api/variantGroups/search`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          sortBy: 'createdAt',
        })
        .set('country', 'SAU');

      expect(searchResponse.statusCode).toEqual(200);
      expect(searchResponse.body.results.length).toEqual(1);
    });
  });

  describe('/api/product/request', () => {
    test('request new product flow', async () => {
      // Arrange
      const accessToken = (await expressServer.registerAndLogin(app)).data;
      // Act
      const updateResponse = await request(app)
        .post('/api/product/request')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          category: 'Toys',
          productDetails: 'SuperMan',
        });
      // Assert
      expect(updateResponse.statusCode).toEqual(201);
    });
    describe('/favourite/:id/set', () => {
      test('200', async () => {
        // Arrange
        const accessToken = (await expressServer.registerAndLogin(app)).data;
        const { catalogProduct } = await constructCartAndCatalog();
        const catalogResponse = await request(app)
          .patch(`/api/product/favourite/${catalogProduct._id}/set`)
          .set('Authorization', `Bearer ${accessToken}`);
        // Assert
        expect(catalogResponse.statusCode).toEqual(200);
      });
    });
    describe('/favourite', () => {
      test('200', async () => {
        // Arrange
        const accessToken = (await expressServer.registerAndLogin(app)).data;
        const { catalogProduct } = await constructCartAndCatalog();
        const updateResponse = await request(app)
          .patch(`/api/product/favourite/${catalogProduct._id}/set`)
          .set('Authorization', `Bearer ${accessToken}`);
        expect(updateResponse.statusCode).toEqual(200);
        // Act
        const catalogResponse = await request(app)
          .get('/api/product/favourite')
          .set('Authorization', `Bearer ${accessToken}`);

        // Assert
        expect(catalogResponse.statusCode).toEqual(200);
        expect(catalogResponse.body.map(product => product._id)).toEqual([catalogProduct._id.toString()]);
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


