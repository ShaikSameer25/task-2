'use server';

/**
 * @fileOverview Summarizes files in a Google Drive folder using AI.
 *
 * - summarizeFiles - A function that takes a folder path and returns a summary of the files within it.
 * - SummarizeFilesInput - The input type for the summarizeFiles function.
 * - SummarizeFilesOutput - The return type for the summarizeFiles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeFilesInputSchema = z.object({
  folderPath: z.string().describe('The path to the Google Drive folder.'),
  fileContents: z.array(z.string()).describe('Array of file contents to summarize')
});
export type SummarizeFilesInput = z.infer<typeof SummarizeFilesInputSchema>;

const SummarizeFilesOutputSchema = z.object({
  summary: z.string().describe('A summary of the files in the folder.'),
});
export type SummarizeFilesOutput = z.infer<typeof SummarizeFilesOutputSchema>;

export async function summarizeFiles(input: SummarizeFilesInput): Promise<SummarizeFilesOutput> {
  return summarizeFilesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeFilesPrompt',
  input: {schema: SummarizeFilesInputSchema},
  output: {schema: SummarizeFilesOutputSchema},
  prompt: `You are an AI assistant that summarizes the content of files in a given folder.

  Please provide a concise summary of the following file contents:

  {{#each fileContents}}
  File {{@index}}:
  {{this}}
  {{/each}}

  Folder Path: {{{folderPath}}}
  Summary: `,
});

const summarizeFilesFlow = ai.defineFlow(
  {
    name: 'summarizeFilesFlow',
    inputSchema: SummarizeFilesInputSchema,
    outputSchema: SummarizeFilesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
