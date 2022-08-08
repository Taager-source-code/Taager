process.env.SECRET = 'yallahabibi';
import request from 'supertest';
import * as expressServer from '../expressServer/expressServer';
import CountryModel from '../../src/shared-kernel/infrastructure/db/models/CountrySchema';
import { countryFixture, EGYPT, UNITED_ARAB_EMIRATES } from '../fixtures/countryFixture';
import Product from '../../src/content-management/queries/infrastructure/db/schemas/ProductModel';
import {
  aVariant,
  XL_L_SIZE_SET,
  XL_SIZE,
} from '../../src/content-management/common/infrastructure/db/product.testing.fixture';
import VariantGroup from '../../src/content-management/queries/infrastructure/db/schemas/VariantGroupModel';
import MongooseService from '../../src/shared-kernel/infrastructure/db/mongoose';
import CartModel from '../../src/order-management/common/infrastructure/db/schemas/cart.model';
import { GenericContainer } from 'testcontainers';
import {
  connectDefaultConnectionToMongoDB,
  createNonDefaultMongoConnection,
  disconnectDefaultFromMongoDB,
  disconnectNonDefaultFromMongoDB,
} from '../../src/shared-kernel/infrastructure/config/mongoose';
import { secondaryConnection } from '../../src/shared-kernel/infrastructure/config/mongoose-secondary';

describe('User APIs', () => {
  let app: any = null;
  let accessToken: string;
  let taagerMongoId: any;
  let returnedProd1: any;
  let returnedProd2: any;
  let variant1_id: any;

  const generateAccessToken = async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'testUser',
        password: '123456789',
        phoneNum: '01234567891',
        email: 'test@gmail.com',
      });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: '01234567891',
        password: '123456789',
      });

    accessToken = response.body.data;
    taagerMongoId = response.body.user._id;
  };

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
    await createVariantGroup('1D');
    await createVariantGroup('2D');
    await createVariantGroup('3D');
  }
  const createCountries = async () => {
    await CountryModel.insertMany(countryFixture);
  };

  async function createUserCart(country, productsArray) {
    const userCart = {
      userID: taagerMongoId,
      products: productsArray,
      country,
    };
    await new MongooseService(CartModel).create(userCart);
  }

  beforeAll(async () => {
    const container = await new GenericContainer('mongo').withExposedPorts(27017).start();

    const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}/bla`;

    await connectDefaultConnectionToMongoDB(mongoUri);
    await createNonDefaultMongoConnection(secondaryConnection, mongoUri);

    app = expressServer.setupServer();
    await createCountries();
    await createVariantGroups();
    await generateAccessToken();
  });
  describe('Cart api endpoints', () => {
    beforeEach(async () => {
      const prodId1 = await createVariantGroup('ID1', 'EGY');
      const prodId2 = await createVariantGroup('ID2', 'EGY');
      variant1_id = prodId1.variant._id;
      const productsArray = [
        { qty: 3, product: prodId1.variant._id, preferredMerchantPrice: 300 },
        { qty: 5, product: prodId2.variant._id, preferredMerchantPrice: 310 },
      ];
      returnedProd1 = {
        productProfit: 200,
        sellerName: 'sellerName',
        productName: 'some product name',
        productPrice: 300,
        Category: 'some category',
        id: prodId1.variant._id.toString(),
        image: 'http://some-product-image.com',
        productPicture: 'http://some-product-image.com',
        pid: 'ID1',
        qty: 3,
        productAvailability: 'available',
      };
      returnedProd2 = {
        productProfit: 210,
        sellerName: 'sellerName',
        productName: 'some product name',
        productPrice: 310,
        Category: 'some category',
        id: prodId2.variant._id.toString(),
        image: 'http://some-product-image.com',
        productPicture: 'http://some-product-image.com',
        pid: 'ID2',
        qty: 5,
        productAvailability: 'available',
      };
      await createUserCart(EGYPT.countryIsoCode3, productsArray);
    });

    test('GET /user/getCart should return correct cart for user, no country in header return EGY cart', async () => {
      // GET /user/getCart
      const userCartResponse = await request(app)
        .get(`/api/user/GetCart`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(userCartResponse.statusCode).toEqual(200);
      expect(userCartResponse.body.data).toMatchObject([returnedProd1, returnedProd2]);
    });

    test('GET /user/getCart should empty cart, country header ARE', async () => {
      // GET /user/getCart
      const userCartResponse = await request(app)
        .get(`/api/user/GetCart`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', 'ARE');

      // Assert
      expect(userCartResponse.statusCode).toEqual(200);
      expect(userCartResponse.body.data).toMatchObject([]);
    });

    test(
      'GET /user/getCart should return ARE cart, country header ARE and ' + 'EGY cart if country header EGY',
      async () => {
        // Arrange
        const prodId = await createVariantGroup('IDARE', 'ARE');
        const productsArray = [{ qty: 4, product: prodId.variant._id, preferredMerchantPrice: 400 }];
        await createUserCart(UNITED_ARAB_EMIRATES.countryIsoCode3, productsArray);

        // GET /user/getCart
        const userCartResponse = await request(app)
          .get(`/api/user/GetCart`)
          .set('Authorization', `Bearer ${accessToken}`)
          .set('country', 'ARE');

        // Assert
        expect(userCartResponse.statusCode).toEqual(200);
        expect(userCartResponse.body.data.length).toEqual(1);
        expect(userCartResponse.body.data).toMatchObject([
          {
            productProfit: 300,
            sellerName: 'sellerName',
            productName: 'some product name',
            productPrice: 400,
            Category: 'some category',
            id: prodId.variant._id.toString(),
            image: 'http://some-product-image.com',
            productPicture: 'http://some-product-image.com',
            pid: 'IDARE',
            qty: 4,
            productAvailability: 'available',
          },
        ]);

        // GET /user/getCart
        const userCartResponse2 = await request(app)
          .get(`/api/user/GetCart`)
          .set('Authorization', `Bearer ${accessToken}`)
          .set('country', 'EGY');

        // Assert
        expect(userCartResponse2.statusCode).toEqual(200);
        expect(userCartResponse2.body.data.length).toEqual(2);
        expect(userCartResponse2.body.data).toMatchObject([returnedProd1, returnedProd2]);
      },
    );

    test('GET /user/getCart with wrong header should return 400', async () => {
      // GET /user/getCart
      const response = await request(app)
        .get(`/api/user/GetCart`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', 'ARE1');

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(response.body.msg).toEqual('Invalid country header: ARE1');
    });

    test(
      'PATCH /user/addToCart/:pid/:sellerName/:qty/:overwriteQuantity should add product in cart,' +
        ' no country in header add to EGY cart',
      async () => {
        // Act
        const prodId3 = await createVariantGroup('ID3', 'EGY');
        const returnedProd3 = {
          productProfit: 100,
          sellerName: 'sellerName',
          productName: 'some product name',
          productPrice: 200,
          Category: 'some category',
          id: prodId3.variant._id.toString(),
          image: 'http://some-product-image.com',
          productPicture: 'http://some-product-image.com',
          pid: 'ID3',
          qty: 2,
          productAvailability: 'available',
        };
        const overwriteQuantity = false;
        const qty = 2;
        const sellerName = 'sellerName';
        const pid = prodId3.variant._id;

        // GET /user/getCart
        const userCartResponse = await request(app)
          .patch(`/api/user/addToCart/${pid}/${sellerName}/${qty}/${overwriteQuantity}`)
          .set('Authorization', `Bearer ${accessToken}`);

        // Assert
        expect(userCartResponse.statusCode).toEqual(200);
        expect(userCartResponse.body.msg).toEqual('Product added to your cart');

        // Act to get cart products
        const userCartResponse2 = await request(app)
          .get(`/api/user/GetCart`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(userCartResponse2.statusCode).toEqual(200);
        expect(userCartResponse2.body.data).toMatchObject([returnedProd1, returnedProd2, returnedProd3]);
      },
    );

    test(
      'PATCH /user/addToCart/:pid/:sellerName/:qty/:overwriteQuantity should add product in cart,' +
        ' country header ARE should add in ARE cart',
      async () => {
        // Act
        const prodId3 = await createVariantGroup('ID3', 'ARE');
        const returnedProd3 = {
          productProfit: 100,
          sellerName: 'sellerName',
          productName: 'some product name',
          productPrice: 200,
          Category: 'some category',
          id: prodId3.variant._id.toString(),
          image: 'http://some-product-image.com',
          productPicture: 'http://some-product-image.com',
          pid: 'ID3',
          qty: 2,
          productAvailability: 'available',
        };
        const overwriteQuantity = false;
        const qty = 2;
        const sellerName = 'sellerName';
        const pid = prodId3.variant._id;

        // GET /user/addCart
        const userCartResponse = await request(app)
          .patch(`/api/user/addToCart/${pid}/${sellerName}/${qty}/${overwriteQuantity}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .set('country', 'ARE');

        // Assert
        expect(userCartResponse.statusCode).toEqual(200);
        expect(userCartResponse.body.msg).toEqual('Product added to your cart');

        // Act to get cart products for EGY
        const userCartResponse2 = await request(app)
          .get(`/api/user/GetCart`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(userCartResponse2.statusCode).toEqual(200);
        expect(userCartResponse2.body.data.length).toEqual(2);
        expect(userCartResponse2.body.data).toMatchObject([returnedProd1, returnedProd2]);

        // Act to get cart products for ARE
        const userCartResponse3 = await request(app)
          .get(`/api/user/GetCart`)
          .set('Authorization', `Bearer ${accessToken}`)
          .set('country', 'ARE');

        expect(userCartResponse3.statusCode).toEqual(200);
        expect(userCartResponse3.body.data.length).toEqual(1);
        expect(userCartResponse3.body.data).toMatchObject([returnedProd3]);
      },
    );

    test('PATCH /user/addToCart/:pid/:sellerName/:qty/:overwriteQuantity wrong header should return 400', async () => {
      // Act
      const prodId3 = await createVariantGroup('ID3', 'ARE');
      const overwriteQuantity = false;
      const qty = 2;
      const sellerName = 'sellerName';
      const pid = prodId3.variant._id;

      // GET /user/addCart
      const userCartResponse = await request(app)
        .patch(`/api/user/addToCart/${pid}/${sellerName}/${qty}/${overwriteQuantity}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', 'ARE1');

      // Assert
      expect(userCartResponse.statusCode).toEqual(400);
      expect(userCartResponse.body.msg).toEqual('Invalid country header: ARE1');
    });

    test('PATCH /user/addToCart should add product in cart,no country in header', async () => {
      // Act
      const prodId3 = await createVariantGroup('ID3', 'EGY');
      const returnedProd3 = {
        productProfit: 150,
        sellerName: 'sellerName',
        productName: 'some product name',
        productPrice: 250,
        Category: 'some category',
        id: prodId3.variant._id.toString(),
        image: 'http://some-product-image.com',
        productPicture: 'http://some-product-image.com',
        pid: 'ID3',
        qty: 2,
        productAvailability: 'available',
      };
      const requestBody = {
        productId: prodId3.variant._id,
        quantity: 2,
        shouldOverwriteQuantity: false,
        preferredMerchantPrice: 250,
      };

      // GET /user/getCart
      const userCartResponse = await request(app)
        .patch(`/api/user/addToCart`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestBody);

      // Assert
      expect(userCartResponse.statusCode).toEqual(200);

      // Act to get cart products
      const userCartResponse2 = await request(app)
        .get(`/api/user/GetCart`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(userCartResponse2.statusCode).toEqual(200);
      expect(userCartResponse2.body.data).toMatchObject([returnedProd1, returnedProd2, returnedProd3]);
    });

    test(
      'PATCH /user/addToCart should add product in cart, country header ARE' + 'should return ARE cart',
      async () => {
        // Act
        const prodId3 = await createVariantGroup('ID3', 'ARE');
        const returnedProd3 = {
          productProfit: 150,
          sellerName: 'sellerName',
          productName: 'some product name',
          productPrice: 250,
          Category: 'some category',
          id: prodId3.variant._id.toString(),
          image: 'http://some-product-image.com',
          productPicture: 'http://some-product-image.com',
          pid: 'ID3',
          qty: 2,
          productAvailability: 'available',
        };
        const requestBody = {
          productId: prodId3.variant._id,
          quantity: 2,
          shouldOverwriteQuantity: false,
          preferredMerchantPrice: 250,
        };

        // GET /user/getCart
        const userCartResponse = await request(app)
          .patch(`/api/user/addToCart`)
          .set('Authorization', `Bearer ${accessToken}`)
          .set('country', 'ARE')
          .send(requestBody);

        // Assert
        expect(userCartResponse.statusCode).toEqual(200);

        // Act to get cart products for EGY
        const userCartResponse2 = await request(app)
          .get(`/api/user/GetCart`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(userCartResponse2.statusCode).toEqual(200);
        expect(userCartResponse2.body.data.length).toEqual(2);
        expect(userCartResponse2.body.data).toMatchObject([returnedProd1, returnedProd2]);

        // Act to get cart products for ARE
        const userCartResponse3 = await request(app)
          .get(`/api/user/GetCart`)
          .set('Authorization', `Bearer ${accessToken}`)
          .set('country', 'ARE');

        expect(userCartResponse3.statusCode).toEqual(200);
        expect(userCartResponse3.body.data.length).toEqual(1);
        expect(userCartResponse3.body.data).toMatchObject([returnedProd3]);
      },
    );

    test('PATCH /user/addToCart wrong header should return 400', async () => {
      // Act
      const prodId3 = await createVariantGroup('ID3', 'ARE');
      prodId3.variant._id.toString();
      const requestBody = {
        productId: prodId3.variant._id,
        quantity: 2,
        shouldOverwriteQuantity: false,
        preferredMerchantPrice: 250,
      };

      // GET /user/addCart
      const userCartResponse = await request(app)
        .patch(`/api/user/addToCart`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', 'ARE1')
        .send(requestBody);

      // Assert
      expect(userCartResponse.statusCode).toEqual(400);
      expect(userCartResponse.body.msg).toEqual('Invalid country header: ARE1');
    });

    test('PATCH /user/removeFromCart/:pid should add product in cart, no country in header', async () => {
      // Act
      const pid = variant1_id;

      // GET /user/getCart
      const userCartResponse = await request(app)
        .patch(`/api/user/removeFromCart/${pid}`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(userCartResponse.statusCode).toEqual(200);
      expect(userCartResponse.body.msg).toEqual('Product removed from your cart');

      // Act to get cart products
      const userCartResponse2 = await request(app)
        .get(`/api/user/GetCart`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(userCartResponse2.statusCode).toEqual(200);
      expect(userCartResponse2.body.data.length).toEqual(1);
      expect(userCartResponse2.body.data).toMatchObject([returnedProd2]);
    });

    test('PATCH /user/removeFromCart/:pid should remove products from EGY cart, no country in header', async () => {
      // Act
      const pid = variant1_id;

      // GET /user/getCart
      const userCartResponse = await request(app)
        .patch(`/api/user/removeFromCart/${pid}`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(userCartResponse.statusCode).toEqual(200);
      expect(userCartResponse.body.msg).toEqual('Product removed from your cart');

      // Act to get cart products
      const userCartResponse2 = await request(app)
        .get(`/api/user/GetCart`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', 'EGY');

      expect(userCartResponse2.statusCode).toEqual(200);
      expect(userCartResponse2.body.data.length).toEqual(1);
      expect(userCartResponse2.body.data).toMatchObject([returnedProd2]);
    });

    test('PATCH /user/removeFromCart/:pid should remove products from ARE cart, country header ARE', async () => {
      // Act
      const prodId3 = await createVariantGroup('ID3', 'ARE');
      prodId3.variant._id.toString();
      const overwriteQuantity = false;
      const qty = 2;
      const sellerName = 'sellerName';
      const pid = prodId3.variant._id;

      // GET /user/addCart
      await request(app)
        .patch(`/api/user/addToCart/${pid}/${sellerName}/${qty}/${overwriteQuantity}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', 'ARE');

      // Patch /api/user/removeFromCart
      const userCartResponse2 = await request(app)
        .patch(`/api/user/removeFromCart/${pid}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', 'ARE');

      // Assert
      expect(userCartResponse2.statusCode).toEqual(200);
      expect(userCartResponse2.body.msg).toEqual('Product removed from your cart');

      // Act to get cart products EGY
      const userCartResponse3 = await request(app)
        .get(`/api/user/GetCart`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', 'EGY');

      // Assert
      expect(userCartResponse3.statusCode).toEqual(200);
      expect(userCartResponse3.body.data.length).toEqual(2);
      expect(userCartResponse3.body.data).toMatchObject([returnedProd1, returnedProd2]);

      // Act to get cart products ARE
      const userCartResponse4 = await request(app)
        .get(`/api/user/GetCart`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', 'ARE');

      // Assert
      expect(userCartResponse4.statusCode).toEqual(200);
      expect(userCartResponse4.body.data.length).toEqual(0);
    });

    test('PATCH /user/removeFromCart/:pid/:sellerName should add product in cart, no country in header', async () => {
      // Act
      const pid = variant1_id;
      const sellerName = 'sellerName';
      // GET /user/getCart
      const userCartResponse = await request(app)
        .patch(`/api/user/removeFromCart/${pid}/${sellerName}`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(userCartResponse.statusCode).toEqual(200);
      expect(userCartResponse.body.msg).toEqual('Product removed from your cart');

      // Act to get cart products
      const userCartResponse2 = await request(app)
        .get(`/api/user/GetCart`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(userCartResponse2.statusCode).toEqual(200);
      expect(userCartResponse2.body.data.length).toEqual(1);
      expect(userCartResponse2.body.data).toMatchObject([returnedProd2]);
    });

    afterEach(async () => {
      await CartModel.deleteMany({});
      await Product.deleteMany({});
      await VariantGroup.deleteMany({});
    });
  });

  afterAll(async () => {
    await disconnectDefaultFromMongoDB();
    await disconnectNonDefaultFromMongoDB(secondaryConnection);
    app = null;
  });
});


