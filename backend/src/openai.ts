import OpenAI from 'openai';
import { envVars } from './envVars';

const openai = new OpenAI({
  apiKey: envVars.OPENAI_API_KEY,
});

export async function fetchDescriptions(prompt: string): Promise<string[]> {
  try {
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
    .split('\n')
    .map((item) => item.trim());
  console.log('parsed');
  return list;
}
