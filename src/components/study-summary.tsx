'use client';

import {useEffect, useState} from 'react';
import {generateSummary} from '@/ai/flows/generate-summary';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useNotes} from '@/hooks/use-notes';

export const StudySummary = () => {
  const [summary, setSummary] = useState<string>('');
  const {notes} = useNotes();

  useEffect(() => {
    const fetchSummary = async () => {
      if (notes && notes.length > 0) {
        try {
          const summaryData = await generateSummary({
            notes: notes.map((note) => ({
              title: note.title,
              body: note.body,
              tags: note.tags,
            })),
          });
          setSummary(summaryData.summary);
        } catch (error) {
          console.error('Failed to generate study summary:', error);
          setSummary('Failed to generate summary.');
        }
      } else {
        setSummary('No notes available to summarize.');
      }
    };

    fetchSummary();
  }, [notes]);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Study Summary</CardTitle>
      </CardHeader>
      <CardContent>{summary}</CardContent>
    </Card>
  );
};
