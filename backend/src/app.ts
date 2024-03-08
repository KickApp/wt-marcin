// read env vars from .env file
require('dotenv').config();

import express from 'express';
import {
  Configuration,
  CountryCode,
  LinkTokenCreateRequest,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from 'plaid';
import util from 'util';
import { envVars } from './envVars';
// import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';
// import moment from 'moment';
import cors from 'cors';
import { errorHandler } from './errorHandler';

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN: null | string = null;
let PUBLIC_TOKEN: null | string = null;
let ITEM_ID: null | string = null;
let ACCOUNT_ID = null;
// The payment_id is only relevant for the UK/EU Payment Initiation product.
// We store the payment_id in memory - in production, store it in a secure
// persistent data store along with the Payment metadata, such as userId .
let PAYMENT_ID = null;
// The transfer_id and authorization_id are only relevant for Transfer ACH product.
// We store the transfer_id in memory - in production, store it in a secure
// persistent data store
let AUTHORIZATION_ID = null;
let TRANSFER_ID = null;

// Initialize the Plaid client
// Find your API keys in the Dashboard (https://dashboard.plaid.com/account/keys)

const products = [Products.Auth, Products.Transactions] as const;
const optionalProducts = [Products.Liabilities] as const;

const configuration = new Configuration({
  basePath: PlaidEnvironments[envVars.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': envVars.PLAID_CLIENT_ID,
      'PLAID-SECRET': envVars.PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const countryCodes: CountryCode[] = [CountryCode.Us];

const client = new PlaidApi(configuration);

envVars;

// Create a new express application instance
const app: express.Application = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cors());

app.post('/api/info', function (request, response, next) {
  response.json({
    item_id: ITEM_ID,
    access_token: ACCESS_TOKEN,
    products,
  });
});

// Create a link token with configs which we can then use to initialize Plaid Link client-side.
// See https://plaid.com/docs/#create-link-token
app.post('/api/create_link_token', function (request, response, next) {
  Promise.resolve()
    .then(async function () {
      const linkTokenCreateRequest: LinkTokenCreateRequest = {
        user: {
          // This should correspond to a unique id for the current user.
          client_user_id: 'user-id',
        },
        client_name: 'Transaction Feed',
        products: [...products],
        optional_products: [...optionalProducts],
        country_codes: countryCodes,
        language: 'en',
        transactions: {
          days_requested: 730,
        },
        redirect_uri: envVars.PLAID_REDIRECT_URI || undefined,
      };
      const createTokenResponse = await client.linkTokenCreate(
        linkTokenCreateRequest
      );
      prettyPrintResponse(createTokenResponse);
      response.json(createTokenResponse.data);
    })
    .catch(next);
});

// Exchange token flow - exchange a Link public_token for
// an API access_token
// https://plaid.com/docs/#exchange-token-flow
app.post('/api/set_access_token', function (request, response, next) {
  PUBLIC_TOKEN = request.body.public_token;
  Promise.resolve()
    .then(async function () {
      const tokenResponse = await client.itemPublicTokenExchange({
        public_token: PUBLIC_TOKEN!,
      });
      prettyPrintResponse(tokenResponse);
      ACCESS_TOKEN = tokenResponse.data.access_token;
      ITEM_ID = tokenResponse.data.item_id;
      response.json({
        // the 'access_token' is a private token, DO NOT pass this token to the frontend in your production environment
        access_token: ACCESS_TOKEN,
        item_id: ITEM_ID,
        error: null,
      });
    })
    .catch(next);
});

app.get('/api/transactions2', function (request, response, next) {
  Promise.resolve()
    .then(async function () {
      const cursor = request.query.cursor;
      console.log('fetching more query', request.query, { cursor });
      const transactionsSyncResponse = await client.transactionsSync({
        access_token: ACCESS_TOKEN!,
        cursor: cursor ? String(cursor) : undefined,
        count: 9,
        options: {
          include_original_description: true,
        },
      });
      console.log('Got transactions', transactionsSyncResponse.data, {
        query: request.query,
      });
      response.json(transactionsSyncResponse.data);
    })
    .catch(next);
});

// Retrieve information about an Item
// https://plaid.com/docs/#retrieve-item
app.get('/api/item', function (request, response, next) {
  Promise.resolve()
    .then(async function () {
      // Pull the Item - this includes information about available products,
      // billed products, webhook information, and more.
      const itemResponse = await client.itemGet({
        access_token: ACCESS_TOKEN!,
      });
      // Also pull information about the institution
      const instResponse = await client.institutionsGetById({
        institution_id: itemResponse.data.item.institution_id!,
        country_codes: countryCodes,
      });
      prettyPrintResponse(itemResponse);
      response.json({
        item: itemResponse.data.item,
        institution: instResponse.data.institution,
      });
    })
    .catch(next);
});

// Retrieve an Item's accounts
// https://plaid.com/docs/#accounts
app.get('/api/accounts', function (request, response, next) {
  Promise.resolve()
    .then(async function () {
      const accountsResponse = await client.accountsGet({
        access_token: ACCESS_TOKEN!,
      });
      prettyPrintResponse(accountsResponse);
      response.json(accountsResponse.data);
    })
    .catch(next);
});

app.use(errorHandler);

const port = envVars.APP_PORT;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

const prettyPrintResponse = (response: { data: unknown }) => {
  console.log(util.inspect(response.data, { colors: true, depth: 4 }));
};
