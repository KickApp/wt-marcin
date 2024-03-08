import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/PathReporter';

const stringToNumber = new t.Type<number, number, unknown>(
  'stringToNumber',
  t.number.is,
  (input, context) => {
    const number = parseFloat(input as string);
    return isNaN(number) ? t.failure(input, context) : t.success(number);
  },
  t.identity
);

const numberInRange = (min: number, max: number) =>
  t.refinement(
    t.number,
    (n): n is number => n >= min && n <= max,
    `numberInRange(${min}, ${max})`
  );

const nonEmptyString = t.refinement(
  t.string,
  (x) => x.trim() !== '',
  'nonEmptyString'
);

const portNumber = numberInRange(1, 65535);

const stringToPortNumber = new t.Type<number, number, unknown>(
  'stringToPortNumber',
  (input: unknown): input is number =>
    stringToNumber.is(input) &&
    pipe(stringToNumber.decode(input), portNumber.is),
  (input, context) =>
    pipe(stringToNumber.validate(input, context), (x) =>
      E.isRight(x) ? portNumber.validate(x.right, context) : x
    ),
  t.identity
);

const EnvironmentVariables = t.type({
  APP_PORT: stringToPortNumber,
  PLAID_CLIENT_ID: nonEmptyString,
  PLAID_SECRET: nonEmptyString,
  PLAID_ENV: t.union([t.literal('sandbox'), t.literal('development')]),
  PLAID_REDIRECT_URI: t.union([t.undefined, t.string]),
});

type EnvironmentVariables = t.TypeOf<typeof EnvironmentVariables>;

const validatedEnv = EnvironmentVariables.decode(process.env);
export const envVars = pipe(
  validatedEnv,
  E.getOrElseW(() => {
    console.error(`\
Environment variable validation errors:

${PathReporter.report(validatedEnv).join('\n')}`);
    process.exit(1);
  })
);
