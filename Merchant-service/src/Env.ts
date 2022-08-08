/* eslint-disable prettier/prettier */
export default class Env {

    // region server
    static NODE_ENV : string = process.env.NODE_ENV? process.env.NODE_ENV : '';
    static ENVIRONMENT : string = process.env.ENVIRONMENT? process.env.ENVIRONMENT : 'dev';
    static PORT : string = process.env.PORT? process.env.PORT : '';
    static SECRET : string = process.env.SECRET? process.env.SECRET : '';
    static MONGO_URI : string = process.env.MONGO_URI? process.env.MONGO_URI : '';
    static MEDIA_FOLDER : string = process.env.MEDIA_FOLDER? process.env.MEDIA_FOLDER : '';
    static FRONTEND_URI : string = process.env.FRONTEND_URI? process.env.FRONTEND_URI : '';
    static SCANII_API_KEY : string = process.env.SCANII_API_KEY? process.env.SCANII_API_KEY : '';
    // endregion

    //region MAILER
    static MAILER_SENDER : string = process.env.MAILER_SENDER? process.env.MAILER_SENDER : '';
    static MAILER_PASS : string = process.env.MAILER_PASS? process.env.MAILER_PASS : '';
    static MAILER_HOST : string = process.env.MAILER_HOST? process.env.MAILER_HOST : '';
    static MAILER_PORT : string = process.env.MAILER_PORT? process.env.MAILER_PORT : '';
    // endregion

    // region BOSTA
    static BOSTA_API_KEY : string = process.env.BOSTA_API_KEY? process.env.BOSTA_API_KEY : '';
    static DREEVO_SECURE_KEY : string = process.env.DREEVO_SECURE_KEY? process.env.DREEVO_SECURE_KEY : '';
    //endregion

    // region CACHE
    static CACHE_TTL : string = process.env.CACHE_TTL? process.env.CACHE_TTL : '';
    static CACHE_MAX_ITEMS : string = process.env.CACHE_MAX_ITEMS? process.env.CACHE_MAX_ITEMS : '';
    static CACHE_UPDATE_ITEMS_ONGET : string = process.env.CACHE_UPDATE_ITEMS_ONGET? process.env.CACHE_UPDATE_ITEMS_ONGET : '';

    static SNOWFLAKE_CACHE_TTL_IN_MINUTES : string = process.env.SNOWFLAKE_CACHE_TTL_IN_MINUTES? process.env.SNOWFLAKE_CACHE_TTL_IN_MINUTES : (30).toString();
    static SNOWFLAKE_CACHE_MAX_ITEM : string = process.env.SNOWFLAKE_CACHE_MAX_ITEM? process.env.SNOWFLAKE_CACHE_MAX_ITEM : (10000).toString();
    // endregion

    // region LOYALTY
    static GOLD: number = process.env.GOLD ? Number.parseInt(process.env.GOLD) : 0;
    static SILVER: number = process.env.SILVER ? Number.parseInt(process.env.SILVER) : 0;
    static PLATINUM: number = process.env.PLATINUM ? Number.parseInt(process.env.PLATINUM) : 0;
    static FREE_SHIPPING_THRESHOLD: number = process.env.FREE_SHIPPING_THRESHOLD ? Number.parseInt(process.env.FREE_SHIPPING_THRESHOLD) : 1000000;
    // endregion

    // region GOOGLE
    static GOOGLE_AUDIENCES: [] = process.env.GOOGLE_AUDIENCES ? JSON.parse(process.env.GOOGLE_AUDIENCES) : [];
    static FACEBOOK_APP_ID: string = process.env.FACEBOOK_APP_ID? process.env.FACEBOOK_APP_ID :'';
    static FACEBOOK_APP_SECRET: string = process.env.FACEBOOK_APP_SECRET? process.env.FACEBOOK_APP_SECRET :'';
    // endregion

    // region SPACES
    static SPACES_ENDPOINT : string = process.env.SPACES_ENDPOINT? process.env.SPACES_ENDPOINT : '';
    static SPACES_ACCESS_KEY : string = process.env.SPACES_ACCESS_KEY? process.env.SPACES_ACCESS_KEY : '';
    static SPACES_SECRET_KEY : string = process.env.SPACES_SECRET_KEY? process.env.SPACES_SECRET_KEY : '';
    static SPACES_BUCKET : string = process.env.SPACES_BUCKET? process.env.SPACES_BUCKET : '';
    // endregion

    // region ARAMEX
    static ARAMEX_CREATE_SHIPMENTS_URL : string = process.env.ARAMEX_CREATE_SHIPMENTS_URL? process.env.ARAMEX_CREATE_SHIPMENTS_URL : '';
    static ARAMEX_TRACK_SHIPMENTS_URL : string = process.env.ARAMEX_TRACK_SHIPMENTS_URL? process.env.ARAMEX_TRACK_SHIPMENTS_URL : '';
    static ARAMEX_PRINT_LABEL_URL : string = process.env.ARAMEX_PRINT_LABEL_URL? process.env.ARAMEX_PRINT_LABEL_URL : '';
    static ARAMEX_USER_NAME : string = process.env.ARAMEX_USER_NAME? process.env.ARAMEX_USER_NAME : '';
    static ARAMEX_PASSWORD : string = process.env.ARAMEX_PASSWORD? process.env.ARAMEX_PASSWORD : '';
    static ARAMEX_ACCOUNT_NUMBER : string = process.env.ARAMEX_ACCOUNT_NUMBER? process.env.ARAMEX_ACCOUNT_NUMBER : '';
    static ARAMEX_ACCOUNT_PIN : string = process.env.ARAMEX_ACCOUNT_PIN? process.env.ARAMEX_ACCOUNT_PIN : '';
    //endregion

    // region SNOWFLAKE
    static SNOWFLAKE_ACCOUNT : string = process.env.SNOWFLAKE_ACCOUNT ? process.env.SNOWFLAKE_ACCOUNT : '';
    static SNOWFLAKE_USERNAME : string = process.env.SNOWFLAKE_USERNAME ? process.env.SNOWFLAKE_USERNAME : '';
    static SNOWFLAKE_PASSWORD : string = process.env.SNOWFLAKE_PASSWORD ? process.env.SNOWFLAKE_PASSWORD : '';
    static SNOWFLAKE_DATABASE : string = process.env.SNOWFLAKE_DATABASE ? process.env.SNOWFLAKE_DATABASE : '';
    static SNOWFLAKE_SCHEMA : string = process.env.SNOWFLAKE_SCHEMA ? process.env.SNOWFLAKE_SCHEMA : '';
    static SNOWFLAKE_WAREHOUSE : string = process.env.SNOWFLAKE_WAREHOUSE ? process.env.SNOWFLAKE_WAREHOUSE : '';
    static SNOWFLAKE_ROLE : string = process.env.SNOWFLAKE_ROLE ? process.env.SNOWFLAKE_ROLE : '';
    static SNOWFLAKE_MOCK_ENABLED : string = process.env.SNOWFLAKE_MOCK_ENABLED ? process.env.SNOWFLAKE_MOCK_ENABLED : 'true';

    // endregion
    // region GITLAB
    static GITLAB_FEATURE_FLAGS_URL: string = process.env.GITLAB_FEATURE_FLAGS_URL ? process.env.GITLAB_FEATURE_FLAGS_URL : '';
    static GITLAB_FEATURE_FLAGS_INSTANCE_ID: string = process.env.GITLAB_FEATURE_FLAGS_INSTANCE_ID ? process.env.GITLAB_FEATURE_FLAGS_INSTANCE_ID : '';
    static GITLAB_FEATURE_FLAGS_ENVIRONMENT: string = process.env.GITLAB_FEATURE_FLAGS_ENVIRONMENT ? process.env.GITLAB_FEATURE_FLAGS_ENVIRONMENT : '';
    // endregion
    static INCENTIVE_PROGRAM_START_DATE: string = process.env.INCENTIVE_PROGRAM_START_DATE ? process.env.INCENTIVE_PROGRAM_START_DATE : '2021-11-01';
    static INCENTIVE_PROGRAM_END_DATE: string = process.env.INCENTIVE_PROGRAM_END_DATE ? process.env.INCENTIVE_PROGRAM_END_DATE : '2021-11-29';

    // region Customer.io
    static CUSTOMER_IO_SITE_ID: string = process.env.CUSTOMER_IO_SITE_ID ? process.env.CUSTOMER_IO_SITE_ID : '';
    static CUSTOMER_IO_API_KEY: string = process.env.CUSTOMER_IO_API_KEY ? process.env.CUSTOMER_IO_API_KEY : '';
    // endregion

    // region Pulsar
    static PULSAR_SERVICE_URL: string = process.env.PULSAR_SERVICE_URL ? process.env.PULSAR_SERVICE_URL : '';
    static PULSAR_AUTH_ISSUER_URL: string = process.env.PULSAR_AUTH_ISSUER_URL ? process.env.PULSAR_AUTH_ISSUER_URL : '';
    static PULSAR_AUTH_MERCHANT_SA_CLIENT_ID: string = process.env.PULSAR_AUTH_MERCHANT_SA_CLIENT_ID ? process.env.PULSAR_AUTH_MERCHANT_SA_CLIENT_ID : '';
    static PULSAR_AUTH_MERCHANT_SA_CLIENT_SECRET: string = process.env.PULSAR_AUTH_MERCHANT_SA_CLIENT_SECRET ? process.env.PULSAR_AUTH_MERCHANT_SA_CLIENT_SECRET : '';
    static PULSAR_AUTH_AUDIENCE: string = process.env.PULSAR_AUTH_AUDIENCE ? process.env.PULSAR_AUTH_AUDIENCE : '';
    // endregion

    // region Order limitation
    static ORDER_PRICE_LIMIT: number = process.env.ORDER_PRICE_LIMIT ? Number.parseInt(process.env.ORDER_PRICE_LIMIT) : 50000;
    // endregion
}


