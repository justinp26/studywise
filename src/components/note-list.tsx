'use client';

import {useState, useEffect} from 'react';
import {generateContext} from '@/ai/flows/generate-context';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';

const notesData = [
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

export const NoteList = () => {
  const [notes, setNotes] = useState(notesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [aiContexts, setAiContexts] = useState({});

  useEffect(() => {
    const fetchAIContext = async () => {
      const contexts = {};
      for (const note of notes) {
        const context = await generateContext({noteContent: note.body});
        contexts[note.id] = context;
      }
      setAiContexts(contexts);
    };

    fetchAIContext();
  }, [notes]);

  useEffect(() => {
    const results = notes.filter((note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotes(results);
  }, [searchTerm, notes]);

  return (
    <div>
      <Input
        type="text"
        placeholder="Search notes..."
        className="mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredNotes.map((note) => (
        <Card key={note.id} className="mb-4">
          <CardHeader>
            <CardTitle>{note.title}</CardTitle>
            <CardDescription>{note.tags?.join(', ') || 'No tags'}</CardDescription>
          </CardHeader>
          <CardContent>
            {note.body}
            {aiContexts[note.id] && (
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="ai-context">
                  <AccordionTrigger>AI Context</AccordionTrigger>
                  <AccordionContent>
                    <h4 className="font-bold">Definitions:</h4>
                    <ul>
                      {aiContexts[note.id].definitions.map((def, index) => (
                        <li key={index}>{def}</li>
                      ))}
                    </ul>
                    <h4 className="font-bold mt-2">Explanations:</h4>
                    <ul>
                      {aiContexts[note.id].explanations.map((exp, index) => (
                        <li key={index}>{exp}</li>
                      ))}
                    </ul>
                    <h4 className="font-bold mt-2">Follow-up Topics:</h4>
                    <ul>
                      {aiContexts[note.id].followUpTopics.map((topic, index) => (
                        <li key={index}>{topic}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
