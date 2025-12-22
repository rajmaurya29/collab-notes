import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../types';
// import { updateNote } from '../store/slices/notesSlice';
import ThemeToggle from '../components/ThemeToggle';

function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const note = useSelector((state: RootState) => 
    state.notes.notes.find(n => n.id ===Number(id))
  );

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const bodyRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load note data when component mounts or note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setBody(note.content);
      if (bodyRef.current) {
        bodyRef.current.innerHTML = note.content;
      }
    } else if (id) {
      // Note not found, redirect to dashboard
      navigate('/dashboard');
    }
  }, [note, id, navigate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    handleSave(newTitle, body);
  };

  const handleBodyInput = () => {
    if (bodyRef.current) {
      const newBody = bodyRef.current.innerHTML;
      setBody(newBody);
      handleSave(title, newBody);
    }
  };

  const handleSave = (currentTitle: string, currentBody: string) => {
    // Show saving status
    setSaveStatus('saving');

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for debounced save
    // saveTimeoutRef.current = setTimeout(() => {
    //   if (id) {
    //     dispatch(updateNote({
    //       id,
    //       updates: {
    //         title: currentTitle,
    //         body: currentBody,
    //       },
    //     }));
    //   }
    //   setSaveStatus('saved');
    // }, 1000);
  };

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
    if (bodyRef.current) {
      bodyRef.current.focus();
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  if (!note) {
    return null;
  }

  return (
    <div className="editor-container">
      <nav className="editor-nav">
        <button className="back-btn" onClick={handleBack} aria-label="Back to dashboard">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" fill="currentColor"/>
          </svg>
          <span>Back</span>
        </button>

        <div className="save-status">
          {saveStatus === 'saving' ? (
            <>
              <svg className="save-icon saving" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <svg className="save-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z" fill="currentColor"/>
              </svg>
              <span>All changes saved</span>
            </>
          )}
        </div>

        <ThemeToggle />
      </nav>

      <div className="editor-content">
        <div className="editor-toolbar">
          <button 
            className="toolbar-btn" 
            onClick={() => handleFormat('bold')}
            aria-label="Bold"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 4h8M4 16h8M11 4l-4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <button 
            className="toolbar-btn" 
            onClick={() => handleFormat('underline')}
            aria-label="Underline"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 3v7a5 5 0 0010 0V3M4 18h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <button 
            className="toolbar-btn" 
            onClick={() => handleFormat('uppercase')}
            aria-label="Uppercase"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="2" y="15" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="currentColor">AA</text>
            </svg>
          </button>
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
