'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a follow-up note based on a given topic.
 *
 * - generateFollowUpNote - A function that generates a follow-up note.
 * - GenerateFollowUpNoteInput - The input type for the generateFollowUpNote function.
 * - GenerateFollowUpNoteOutput - The return type for the generateFollowUpNote function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateFollowUpNoteInputSchema = z.object({
  topic: z.string().describe('The topic to generate a follow-up note about.'),
  existingNoteContent: z.string().describe('The content of the existing note.'),
});
export type GenerateFollowUpNoteInput = z.infer<typeof GenerateFollowUpNoteInputSchema>;

const GenerateFollowUpNoteOutputSchema = z.object({
  followUpNote: z.string().describe('The generated follow-up note content.'),
});
export type GenerateFollowUpNoteOutput = z.infer<typeof GenerateFollowUpNoteOutputSchema>;

export async function generateFollowUpNote(input: GenerateFollowUpNoteInput): Promise<GenerateFollowUpNoteOutput> {
  return generateFollowUpNoteFlow(input);
}

const generateFollowUpNotePrompt = ai.definePrompt({
  name: 'generateFollowUpNotePrompt',
  input: {
    schema: z.object({
      topic: z.string().describe('The topic to generate a follow-up note about.'),
      existingNoteContent: z.string().describe('The content of the existing note.'),
    }),
  },
  output: {
    schema: z.object({
      followUpNote: z.string().describe('The generated follow-up note content.'),
    }),
  },
  prompt: `Given the existing note content: "{{{existingNoteContent}}}" and the follow-up topic: "{{{topic}}}", generate a concise and informative note about the topic that expands on the original note.`,
});

const generateFollowUpNoteFlow = ai.defineFlow<
  typeof GenerateFollowUpNoteInputSchema,
  typeof GenerateFollowUpNoteOutputSchema
>(
  {
    name: 'generateFollowUpNoteFlow',
    inputSchema: GenerateFollowUpNoteInputSchema,
    outputSchema: GenerateFollowUpNoteOutputSchema,
  },
  async input => {
    // [GoogleGenerativeAI Error]: API key expired. Please renew the API key.
    const {output} = await generateFollowUpNotePrompt(input);
    return output!;
  }
);

    

    