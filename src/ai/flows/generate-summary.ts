'use server';
/**
 * @fileOverview A study summary AI agent.
 *
 * - generateSummary - A function that handles the study summary generation process.
 * - GenerateSummaryInput - The input type for the generateSummary function.
 * - GenerateSummaryOutput - The return type for the generateSummary function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateSummaryInputSchema = z.object({
  notes: z.array(
    z.object({
      title: z.string().describe('The title of the note.'),
      body: z.string().describe('The body of the note.'),
      tags: z.array(z.string()).optional().describe('The tags associated with the note.'),
    })
  ).describe('An array of notes to summarize.'),
});
export type GenerateSummaryInput = z.infer<typeof GenerateSummaryInputSchema>;

const GenerateSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of all the notes.'),
});
export type GenerateSummaryOutput = z.infer<typeof GenerateSummaryOutputSchema>;

export async function generateSummary(input: GenerateSummaryInput): Promise<GenerateSummaryOutput> {
  return generateSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSummaryPrompt',
  input: {
    schema: z.object({
      notes: z.array(
        z.object({
          title: z.string().describe('The title of the note.'),
          body: z.string().describe('The body of the note.'),
          tags: z.array(z.string()).optional().describe('The tags associated with the note.'),
        })
      ).describe('An array of notes to summarize.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of all the notes.'),
    }),
  },
  prompt: `Summarize the main points and themes from all of the student's notes below. Keep it clear, concise, and helpful for revision.\n\nNotes:\n{{#each notes}}\nTitle: {{{title}}}\nBody: {{{body}}}\nTags: {{#if tags}}{{{tags}}}{{else}}No tags{{/if}}\n{{/each}}`,
});

const generateSummaryFlow = ai.defineFlow<
  typeof GenerateSummaryInputSchema,
  typeof GenerateSummaryOutputSchema
>({
  name: 'generateSummaryFlow',
  inputSchema: GenerateSummaryInputSchema,
  outputSchema: GenerateSummaryOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});

