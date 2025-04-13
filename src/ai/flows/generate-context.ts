'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating context for a given note.
 *
 * - generateContext - A function that generates context for a given note.
 * - GenerateContextInput - The input type for the generateContext function.
 * - GenerateContextOutput - The return type for the generateContext function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateContextInputSchema = z.object({
  noteContent: z.string().describe('The content of the note to generate context for.'),
});
export type GenerateContextInput = z.infer<typeof GenerateContextInputSchema>;

const GenerateContextOutputSchema = z.object({
  definitions: z.array(z.string()).describe('Definitions of key terms in the note.'),
  explanations: z.array(z.string()).describe('Explanations of related concepts.'),
  followUpTopics: z.array(z.string()).describe('Suggested follow-up topics to explore.'),
});
export type GenerateContextOutput = z.infer<typeof GenerateContextOutputSchema>;

export async function generateContext(input: GenerateContextInput): Promise<GenerateContextOutput> {
  return generateContextFlow(input);
}

const generateContextPrompt = ai.definePrompt({
  name: 'generateContextPrompt',
  input: {
    schema: z.object({
      noteContent: z.string().describe('The content of the note to generate context for.'),
    }),
  },
  output: {
    schema: z.object({
      definitions: z.array(z.string()).describe('Definitions of key terms in the note.'),
      explanations: z.array(z.string()).describe('Explanations of related concepts.'),
      followUpTopics: z.array(z.string()).describe('Suggested follow-up topics to explore.'),
    }),
  },
  prompt: `You are an AI assistant helping students understand their notes better. Given the following note content, please provide definitions of key terms, explanations of related concepts, and suggested follow-up topics to explore.\n\nNote Content: {{{noteContent}}}\n\nDefinitions of Key Terms:\n{% for definition in definitions %}{{definition}}\n{% endfor %}\n\nExplanations of Related Concepts:\n{% for explanation in explanations %}{{explanation}}\n{% endfor %}\n\nSuggested Follow-up Topics:\n{% for topic in followUpTopics %}{{topic}}\n{% endfor %}`,
});

const generateContextFlow = ai.defineFlow<
  typeof GenerateContextInputSchema,
  typeof GenerateContextOutputSchema
>(
  {
    name: 'generateContextFlow',
    inputSchema: GenerateContextInputSchema,
    outputSchema: GenerateContextOutputSchema,
  },
  async input => {
    const {output} = await generateContextPrompt(input);
    return output!;
  }
);
