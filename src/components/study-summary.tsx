'use client';

import {useEffect, useState} from 'react';
import {generateSummary} from '@/ai/flows/generate-summary';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

const dummyNotes = [
  {
    id: '1',
    title: 'Introduction to React',
    body: 'React is a JavaScript library for building user interfaces.',
    tags: ['JavaScript', 'React', 'UI'],
  },
  {
    id: '2',
    title: 'Hooks in React',
    body: 'Hooks are functions that let you “hook into” React state and lifecycle features from function components.',
    tags: ['JavaScript', 'React', 'Hooks'],
  },
  {
    id: '3',
    title: 'Components in React',
    body: 'Components let you split the UI into independent, reusable pieces.',
    tags: ['JavaScript', 'React', 'Components'],
  },
];

export const StudySummary = () => {
  const [summary, setSummary] = useState<string>('');

  useEffect(() => {
    const fetchSummary = async () => {
      const notes = dummyNotes; // Replace with your actual notes data
      if (notes && notes.length > 0) {
        const summaryData = await generateSummary({
          notes: notes.map((note) => ({
            title: note.title,
            body: note.body,
            tags: note.tags,
          })),
        });
        setSummary(summaryData.summary);
      } else {
        setSummary('No notes available to summarize.');
      }
    };

    fetchSummary();
  }, []);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Study Summary</CardTitle>
      </CardHeader>
      <CardContent>{summary}</CardContent>
    </Card>
  );
};
