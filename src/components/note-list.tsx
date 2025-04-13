'use client';

import {useState, useEffect} from 'react';
import {generateContext} from '@/ai/flows/generate-context';
import {generateFollowUpNote} from '@/ai/flows/generate-followup-note';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {useNotes} from '@/hooks/use-notes';

export const NoteList = () => {
  const {notes, addNote} = useNotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [aiContexts, setAiContexts] = useState({});

  useEffect(() => {
    const fetchAIContext = async () => {
      if (!notes) return;

      try {
        const contexts = await Promise.all(
          notes.map(async note => {
            try {
              const context = await generateContext({noteContent: note.body});
              return {noteId: note.id, context};
            } catch (error) {
              console.error(`Failed to generate context for note ${note.id}:`, error);
              return {noteId: note.id, context: null};
            }
          })
        );

        const contextsMap = {};
        contexts.forEach(({noteId, context}) => {
          if (context) {
            contextsMap[noteId] = context;
          }
        });
        setAiContexts(contextsMap);
      } catch (error) {
        console.error('Failed to fetch AI contexts:', error);
      }
    };

    fetchAIContext();
  }, [notes]);

  useEffect(() => {
    if (notes) {
      const results = notes.filter((note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(results);
    }
  }, [searchTerm, notes]);

  const handleGenerateFollowUpNote = async (topic: string, existingNoteContent: string) => {
    try {
      const followUpNoteData = await generateFollowUpNote({
        topic: topic,
        existingNoteContent: existingNoteContent,
      });

      await addNote({
        title: `Follow-up: ${topic}`,
        body: followUpNoteData.followUpNote,
        tags: ['AI Generated', 'Follow-up'],
      });
    } catch (error) {
      console.error('Failed to generate follow-up note:', error);
    }
  };

  return (
    <div>
      <Input
        type="text"
        placeholder="Search notes..."
        className="mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredNotes?.map((note) => (
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
                        <li key={index}>
                          {topic}
                          <Button
                            variant="secondary"
                            size="sm"
                            className="ml-2"
                            onClick={() => handleGenerateFollowUpNote(topic, note.body)}
                          >
                            Generate Note
                          </Button>
                        </li>
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

    