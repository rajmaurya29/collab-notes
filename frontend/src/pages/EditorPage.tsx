import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../types';
import { useAppDispatch } from '../store/hooks';

// import { updateNote } from '../store/slices/notesSlice';
import ThemeToggle from '../components/ThemeToggle';
import Loader from '../components/Loader';
import { updateNote } from '../store/slices/notesSlice';

function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notes, loading } = useSelector((state: RootState) => state.notes);

  // Convert id to number for comparison
  const noteId = id ? Number(id) : null;
  const note = notes.find(n => n.id === noteId);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Load note data when component mounts or note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setBody(note.content);
      setCategory(note.category || '');
      if (bodyRef.current) {
        bodyRef.current.innerHTML = note.content;
      }
    } else if (id && !loading && notes.length > 0) {
      // Note not found after loading is complete, redirect to dashboard
      console.log('Note not found, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [note, id, navigate, loading, notes.length]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
  };

  const handleBodyInput = () => {
    if (bodyRef.current) {
      const newBody = bodyRef.current.innerHTML;
      setBody(newBody);
    }
  };

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
    if (bodyRef.current) {
      bodyRef.current.focus();
    }
  };

  const handleBack = async () => {
    // Actually save to backend when back button is clicked
    if (id) {
      try {
        setIsSaving(true);
        await dispatch(updateNote({ id, title, content: body, category })).unwrap();
      } catch (err) {
        console.error("Failed to save note", err);
      } finally {
        setIsSaving(false);
      }
    }
    
    navigate('/dashboard');
  };

  if (loading) {
    return <Loader fullScreen message="Loading note..." />;
  }

  if (!note) {
    return <Loader fullScreen message="Note not found..." />;
  }

  return (
    <div className="editor-container">
      {isSaving && <Loader fullScreen message="Saving note..." />}
      <nav className="editor-nav">
        <button className="back-btn" onClick={handleBack} aria-label="Back to dashboard">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" fill="currentColor"/>
          </svg>
          <span>Back</span>
        </button>

        <div className="save-status">
          <svg className="save-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z" fill="currentColor"/>
          </svg>
          <span>All changes saved</span>
        </div>

        <div className="editor-nav-right">
          <div className="editor-owner">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" fill="currentColor"/>
            </svg>
            <span>{note.ownerName|| 'Unknown'}</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="editor-content">
        <div className="editor-controls">
          <div className="editor-toolbar">
            <button 
              className="toolbar-btn" 
              onClick={() => handleFormat('bold')}
              aria-label="Bold"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 4h6a4 4 0 014 4 4 4 0 01-4 4H5V4z" fill="currentColor"/>
                <path d="M5 12h7a4 4 0 014 4 4 4 0 01-4 4H5v-8z" fill="currentColor"/>
              </svg>
            </button>

            <button 
              className="toolbar-btn" 
              onClick={() => handleFormat('italic')}
              aria-label="Italic"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4h8M4 16h8M11 4l-4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <button 
              className="toolbar-btn" 
              onClick={() => handleFormat('underline')}
              aria-label="Underline"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3v7a5 5 0 0010 0V3M4 18h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <button 
              className="toolbar-btn" 
              onClick={() => handleFormat('uppercase')}
              aria-label="Uppercase"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="2" y="15" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="currentColor">AA</text>
              </svg>
            </button>
          </div>

          <div className="category-section">
            <label htmlFor="category-input" className="category-label">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zM11 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM11 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" fill="currentColor"/>
              </svg>
              Category
            </label>
            <input
              id="category-input"
              type="text"
              className="category-input"
              placeholder="Add category..."
              value={category}
              onChange={handleCategoryChange}
            />
          </div>
        </div>

        <input
          type="text"
          className="editor-title"
          placeholder="Untitled Note"
          value={title}
          onChange={handleTitleChange}
        />

        <div
          ref={bodyRef}
          className="editor-body"
          contentEditable
          onInput={handleBodyInput}
          suppressContentEditableWarning
        />
      </div>
    </div>
  );
}

export default EditorPage;
