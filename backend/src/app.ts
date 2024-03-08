import bodyParser from 'body-parser';
import cors from 'cors';
import crypto from 'crypto';
import express, { NextFunction, Request, Response } from 'express';
import { IncomingMessage } from 'http';
import {
  Configuration,
  CountryCode,
  LinkTokenCreateRequest,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from 'plaid';
import util from 'util';
import { completeTransactionDescriptions } from './completeTransactionDescriptions';
import { envVars } from './envVars';
import { errorHandler } from './errorHandler';

const clientName = 'Transaction Feed';
const language = 'en';
const countryCodes = [CountryCode.Us] as const;
const products = [Products.Auth, Products.Transactions] as const;
const optionalProducts = [Products.Liabilities] as const;

const client = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[envVars.PLAID_ENV],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': envVars.PLAID_CLIENT_ID,
        'PLAID-SECRET': envVars.PLAID_SECRET,
        'Plaid-Version': '2020-09-14',
      },
    },
  })
);

// Create a new express application instance
const app: express.Application = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cors());

// Create a link token with configs which we can then use to initialize Plaid Link client-side.
// See https://plaid.com/docs/#create-link-token
app.post('/api/create_link_token', async function (request, response, next) {
  try {
    const linkTokenCreateRequest: LinkTokenCreateRequest = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: 'user-id',
      },
      client_name: clientName,
      products: [...products],
      optional_products: [...optionalProducts],
      country_codes: [...countryCodes],
      language,
      transactions: {
        days_requested: 730,
      },
      redirect_uri: envVars.PLAID_REDIRECT_URI,
    };
    const createTokenResponse = await client.linkTokenCreate(
      linkTokenCreateRequest
    );
    // prettyPrintResponse(createTokenResponse);
    response.json(createTokenResponse.data);
  } catch (error) {
    next(error);
  }
});

const sessions: Map<
  string,
  {
    accessToken: string;
    itemId: string;
  }
> = new Map();

const SESSION_ID_HEADER_NAME = 'X-Session-ID';

// Exchange token flow - exchange a Link public_token for
// an API access_token
// https://plaid.com/docs/#exchange-token-flow
app.post('/api/set_access_token', async function (request, response, next) {
  try {
    const PUBLIC_TOKEN = request.body.public_token;
    const tokenResponse = await client.itemPublicTokenExchange({
      public_token: PUBLIC_TOKEN!,
    });

    const accessToken = tokenResponse.data.access_token;
    const itemId = tokenResponse.data.item_id;
    const sessionId = generateSessionId();

    response.setHeader(SESSION_ID_HEADER_NAME, sessionId);
    sessions.set(sessionId, {
      accessToken,
      itemId,
    });

    response.json({
      itemId,
    });
  } catch (error) {
    next(error);
  }
});

function getSession(req: IncomingMessage) {
  const sessionHeader = req.headers[SESSION_ID_HEADER_NAME.toLowerCase()];
  const sessionId = sessionHeader ? String(sessionHeader) : '';
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error('Missing session');
  }
  return session;
}

app.post('/api/info', function (request, response, next) {
  const { accessToken, itemId } = getSession(request);
  response.json({
    access_token: accessToken,
    item_id: itemId,
    products,
  });
});

app.get('/api/transactions', async function (request, response, next) {
  try {
    const { accessToken } = getSession(request);
    const cursor = request.query.cursor;
    const transactionsSyncResponse = await client.transactionsSync({
      access_token: accessToken,
      cursor: cursor ? String(cursor) : undefined,
      count: 9,
      options: {
        include_original_description: true,
      },
    });

    const { added } = transactionsSyncResponse.data;
    const txsNeedDesc = added.filter((t) => t.merchant_name == null);
    const descriptions = await completeTransactionDescriptions(txsNeedDesc);
    const data: typeof transactionsSyncResponse.data = {
      ...transactionsSyncResponse.data,
      added: added.map((tx) => {
        const index = txsNeedDesc.indexOf(tx);
        if (index === -1) {
          return tx;
        }

        return {
          ...tx,
          name: descriptions[index],
        };
      }),
    };

    response.json(data);
  } catch (error) {
    next(error);
  }
});

// Retrieve information about an Item
// https://plaid.com/docs/#retrieve-item
app.get('/api/item', async function (request, response, next) {
  try {
    const { accessToken } = getSession(request);

    // Pull the Item - this includes information about available products,
    // billed products, webhook information, and more.
    const itemResponse = await client.itemGet({
      access_token: accessToken,
    });
    // Also pull information about the institution
    const instResponse = await client.institutionsGetById({
      institution_id: itemResponse.data.item.institution_id!,
      country_codes: [...countryCodes],
    });
    prettyPrintResponse(itemResponse);
    response.json({
      item: itemResponse.data.item,
      institution: instResponse.data.institution,
    });
  } catch (error) {
    next(error);
  }
});

// Retrieve an Item's accounts
// https://plaid.com/docs/#accounts
app.get('/api/accounts', async function (request, response, next) {
  try {
    const { accessToken } = getSession(request);
    const accountsResponse = await client.accountsGet({
      access_token: accessToken,
    });
    prettyPrintResponse(accountsResponse);
    response.json(accountsResponse.data);
  } catch (error) {
    next(error);
  }
});

app.use(logRequestHeaders);
app.use(errorHandler);

const port = envVars.APP_PORT;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Function to generate a secure session ID token
function generateSessionId(): string {
  // Generate a random buffer
  const randomBuffer = crypto.randomBytes(32);

  // Convert buffer to a hexadecimal string
  const sessionId = randomBuffer.toString('hex');

  return sessionId;
}

function logRequestHeaders(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // console.log('Request Headers:', req.headers);
  next();
}

const prettyPrintResponse = (response: { data: unknown }) => {
  util;
  // console.log(util.inspect(response.data, { colors: true, depth: 4 }));
};
