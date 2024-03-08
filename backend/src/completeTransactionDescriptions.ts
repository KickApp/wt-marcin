import OpenAI from 'openai';
import { Transaction } from 'plaid';
import { envVars } from './envVars';

const openai = new OpenAI({
  apiKey: envVars.OPENAI_API_KEY,
});

export async function completeTransactionDescriptions(
  txs: Transaction[]
): Promise<string[]> {
  if (txs.length === 0) {
    return [];
  }
  try {
    const prompt = `\
Translate each bank statement description into a concise, readable description indicating the merchant or service and the transaction nature. No markers are used, just descriptions in the same order and separated by exactly one newline character.

${txs
  .map((tx) =>
    Object.entries({
      Description: tx.original_description ?? tx.name,
      Category: tx.personal_finance_category?.primary,
      Detail: tx.personal_finance_category?.detailed,
      Website: tx.website,
      Channel: tx.payment_channel,
    })
      .map(([key, value]) => (value ? `${key}: ${value}` : ''))
      .filter(Boolean)
      .join(', ')
  )
  .join('\n')}`;

    console.log(`SENDING PROMPT:\n\n${prompt}`);

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    const [choice] = completion.choices;
    const content = choice?.message.content;
    if (content == null) {
      throw new Error('!');
    }

    const descriptions = parseResponseAndRemoveLineNumbers(content);
    console.log('Response\n', content, 'Parsed\n', descriptions);
    return descriptions;
  } catch (error) {
    console.error('Error fetching completion:', error);
    return [];
  }
}

function parseResponseAndRemoveLineNumbers(response: string) {
  // Removing line numbers using regex and splitting by newline
  const list = response
    .replace(/^\d+\.\s?/gm, '')
    .split(/\n+/)
    .map((item) => item.trim());
  return list;
}
