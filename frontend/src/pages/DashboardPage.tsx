import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAppDispatch } from '../store/hooks';

import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import type { RootState } from '../types';
import { fetchNotes } from '../store/slices/notesSlice';

function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const notes = useSelector((state: RootState) => state.notes.notes);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(()=>{
    dispatch(fetchNotes());
  },[dispatch])

  const handleNewNote = () => {
    // Create a new note
    const newNoteData = {
      title: 'Untitled Note',
      content: '',
      category: 'Personal',
    };
    
    // Dispatch will set currentNoteId in the reducer
    // dispatch(addNote(newNoteData));
    
    // Get the newly added note (it will be the last one after dispatch)
    // We need to access the updated state, so we'll navigate in the next tick
    setTimeout(() => {
      const state = notes;
      const newNote = state[state.length - 1];
      if (newNote) {
        navigate(`/editor/${newNote.id}`);
      }
    }, 0);
  };

  const handleNoteClick = (noteId: number) => {
    // dispatch(setCurrentNote(noteId.toString()));
    navigate(`/editor/${noteId}`);
  };

  const handleDeleteNote = (noteId: number) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      // dispatch(deleteNote(noteId));
    }
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleLogout = () => {
    navigate('/logout');
  };

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getPreview = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Filter notes based on selected category with trimmed comparison
  const filteredNotes = selectedCategory 
    ? notes.filter(note => note.category?.trim() === selectedCategory.trim())
    : notes;

  return (
    <div className="dashboard-container">
      <Sidebar 
        onLogout={handleLogout} 
        onCategorySelect={handleCategorySelect}
        activeCategory={selectedCategory}
      />
      
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">
            {selectedCategory ? `${selectedCategory} Notes` : 'My Notes'}
          </h1>
          <button className="new-note-btn" onClick={handleNewNote}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" fill="currentColor"/>
            </svg>
            <span>New Note</span>
          </button>
        </header>

        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              title={note.title}
              preview={getPreview(note.content)}
              timestamp={formatTimestamp(note.updated_at)}
              category={note.category}
              onClick={() => handleNoteClick(note.id)}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="empty-state">
            <p>No notes found in this category.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;
