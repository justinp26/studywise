'use client';

import {useState, useEffect, useCallback, createContext, useContext} from 'react';
import {useToast} from '@/hooks/use-toast';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {db} from '@/lib/firebase';

type Note = {
  id?: string;
  title: string;
  body: string;
  tags: string[];
  createdAt?: Date;
};

type NotesContextType = {
  notes: Note[] | null;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => Promise<void>;
  updateNote: (noteId: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({children}: {children: React.ReactNode}) => {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const {toast} = useToast();

  useEffect(() => {
    if (!db) return;

    const notesCollection = collection(db, 'notes');
    const notesQuery = query(notesCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(), // Properly convert Firestore Timestamp to JavaScript Date
      })) as Note[];
      setNotes(notesData);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const addNote = useCallback(
    async (note: Omit<Note, 'id' | 'createdAt'>) => {
      if (!db) {
        toast({
          title: 'Error',
          description: 'Firebase not initialized',
          variant: 'destructive',
        });
        return;
      }
      try {
        const notesCollection = collection(db, 'notes');
        await addDoc(notesCollection, {
          ...note,
          createdAt: serverTimestamp(), // Use serverTimestamp for accurate time
        });
        toast({
          title: 'Success',
          description: 'Note added successfully!',
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to add note',
          variant: 'destructive',
        });
        console.error('Error adding note:', error);
      }
    },
    [toast]
  );

  const updateNote = useCallback(
    async (noteId: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
      if (!db) {
        toast({
          title: 'Error',
          description: 'Firebase not initialized',
          variant: 'destructive',
        });
        return;
      }
      try {
        const noteDocRef = doc(db, 'notes', noteId);
        await updateDoc(noteDocRef, updates);
        toast({
          title: 'Success',
          description: 'Note updated successfully!',
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to update note',
          variant: 'destructive',
        });
        console.error('Error updating note:', error);
      }
    },
    [toast]
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      if (!db) {
        toast({
          title: 'Error',
          description: 'Firebase not initialized',
          variant: 'destructive',
        });
        return;
      }
      try {
        const noteDocRef = doc(db, 'notes', noteId);
        await deleteDoc(noteDocRef);
        toast({
          title: 'Success',
          description: 'Note deleted successfully!',
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete note',
          variant: 'destructive',
        });
        console.error('Error deleting note:', error);
      }
    },
    [toast]
  );

  const value: NotesContextType = {
    notes,
    addNote,
    updateNote,
    deleteNote,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
