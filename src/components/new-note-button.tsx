'use client';

import {useState} from 'react';
import {useToast} from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, // Import AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useNotes} from '@/hooks/use-notes';
import {Textarea} from '@/components/ui/textarea';

export const NewNoteButton = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const {toast} = useToast();
  const {addNote} = useNotes();

  const handleCreateNote = async () => {
    if (!title.trim() || !body.trim()) {
      toast({
        title: 'Error',
        description: 'Title and body cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addNote({title, body, tags: []}); // Initialize tags as an empty array
      toast({
        title: 'Note Created',
        description: `Title: ${title}`,
      });

      setTitle('');
      setBody('');
    } catch (error: any) {
      toast({
        title: 'Error creating note',
        description: error.message || 'Failed to create note.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="accent">New Note</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Note</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the details for your new note.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="body" className="text-right">
              Body
            </Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleCreateNote}>
            Create
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

