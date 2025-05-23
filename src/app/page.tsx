import {NoteList} from '@/components/note-list';
import {NewNoteButton} from '@/components/new-note-button';
import {StudySummary} from '@/components/study-summary';
import {Toaster} from '@/components/ui/toaster';
import {SidebarProvider} from '@/components/ui/sidebar';
import {NotesProvider} from '@/hooks/use-notes';

export default function Home() {
  return (
    <SidebarProvider>
      <NotesProvider>
        <div className="flex flex-col min-h-screen bg-background">
          <div className="container mx-auto p-4 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">StudyWise</h1>
            <StudySummary />
            <NewNoteButton />
            <NoteList />
          </div>
          <Toaster />
        </div>
      </NotesProvider>
    </SidebarProvider>
  );
}
