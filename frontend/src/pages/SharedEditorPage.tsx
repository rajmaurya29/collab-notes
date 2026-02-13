import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import type { RootState } from '../types';
import ThemeToggle from '../components/ThemeToggle';
import Loader from '../components/Loader';
import axios from 'axios';

function SharedEditorPage() {
  const WS_BASE_URL = import.meta.env.VITE_WS_URL;
  const API_URL = import.meta.env.VITE_API_URL;

  const { token } = useParams<{ token: string }>();
  const timer = useRef<number | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const username = useSelector((state: RootState) => state.auth.user?.name);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [fetchedNote, setFetchedNote] = useState<any>(null);
  const [isLoadingNote, setIsLoadingNote] = useState(true);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<Record<number, string>>({});
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUsersDropdown(false);
      }
    };

    if (showUsersDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUsersDropdown]);

  // Load shared note data
  useEffect(() => {
    if (token) {
      setIsLoadingNote(true);
      axios
        .get(`${API_URL}/notes/share/${token}/`, { withCredentials: true })
        .then((response) => {
          setFetchedNote(response.data);
          setTitle(response.data.title);
          setCategory(response.data.category || '');
          setIsLoadingNote(false);
        })
        .catch((error) => {
          console.error('Failed to fetch shared note:', error);
          toast.error('Failed to load shared note. It may not exist or sharing is disabled.', {
            autoClose: 3000,
          });
          setIsLoadingNote(false);
          navigate('/dashboard');
        });
    }
  }, [token, navigate, API_URL]);

  // WebSocket connection using the note ID from fetched note
  useEffect(() => {
    if (!fetchedNote?.id) return;

    const socket = new WebSocket(`${WS_BASE_URL}/ws/notes/${fetchedNote.id}/`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected for shared note:', fetchedNote.id);
      setIsWsConnected(true);
      socket.send(
        JSON.stringify({
          type: 'join',
          username: username,
          senderId: userId,
        })
      );
    };

    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data);

      if (data.type === 'join') {
        setConnectedUsers(data.current_user);
        if (data.senderId === userId) {
          return;
        }
        toast.success(`${data.username} joined`, {
          autoClose: 3000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
        });
        return;
      }

      if (data.type === 'left') {
        setConnectedUsers(data.current_user);
        if (data.senderId === userId) {
          return;
        }
        toast.error(`${data.username} left`, {
          autoClose: 3000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
        });
        return;
      }

      if (data.senderId === userId) {
        return;
      }

      if (bodyRef.current) {
        bodyRef.current.innerHTML = data.content;
      }
    };

    socket.onerror = (error: Event) => {
      console.log('WebSocket error:', error);
      setIsWsConnected(false);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected for shared note:', fetchedNote.id);
      setIsWsConnected(false);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: 'left',
            username: username,
            senderId: userId,
          })
        );
      }
      socket.close();
    };
  }, [fetchedNote?.id, WS_BASE_URL, userId, username]);

  // Set body content after component renders
  useEffect(() => {
    if (fetchedNote && bodyRef.current && !isLoadingNote) {
      bodyRef.current.innerHTML = fetchedNote.content;
    }
  }, [fetchedNote, isLoadingNote]);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (timer.current) {
      clearTimeout(timer.current);
    }
    if (token && bodyRef.current) {
      timer.current = window.setTimeout(() => {
        const currentContent = bodyRef.current?.innerHTML || '';
        axios.put(
          `${API_URL}/notes/share/${token}/`,
          { title: newTitle, content: currentContent, category },
          { withCredentials: true }
        );
      }, 800);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);

    if (timer.current) {
      clearTimeout(timer.current);
    }
    if (token && bodyRef.current) {
      timer.current = window.setTimeout(() => {
        const currentContent = bodyRef.current?.innerHTML || '';
        axios.put(
          `${API_URL}/notes/share/${token}/`,
          { title, content: currentContent, category: newCategory },
          { withCredentials: true }
        );
      }, 800);
    }
  };

  const handleBodyInput = () => {
    if (!userId || !bodyRef.current) return;
    const newBody = bodyRef.current.innerHTML;

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          content: newBody,
          senderId: userId,
        })
      );
    }

    if (timer.current) {
      clearTimeout(timer.current);
    }
    if (token) {
      timer.current = window.setTimeout(() => {
        axios.put(
          `${API_URL}/notes/share/${token}/`,
          { title, content: newBody, category },
          { withCredentials: true }
        );
      }, 800);
    }
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

  if (isLoadingNote || !fetchedNote) {
    return <Loader fullScreen message="Loading shared note..." />;
  }

  return (
    <div className="editor-container">
      <nav className="editor-nav">
        <button className="back-btn" onClick={handleBack} aria-label="Back to dashboard">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              fill="currentColor"
            />
          </svg>
          <span>Back</span>
        </button>

        <div className="save-status">
          {isWsConnected ? (
            <>
              <svg
                className="connection-dot connected"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8" r="4" fill="currentColor" />
              </svg>
              <span>Connected</span>
            </>
          ) : (
            <>
              <svg
                className="connection-dot disconnected"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8" r="4" fill="currentColor" />
              </svg>
              <span>Disconnected</span>
            </>
          )}
        </div>

        <div className="editor-nav-right">
          <div className="editor-users-dropdown" ref={dropdownRef}>
            <button
              className="users-dropdown-trigger"
              onClick={() => setShowUsersDropdown(!showUsersDropdown)}
              aria-label="Show connected users"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  fill="currentColor"
                />
              </svg>
              <span>{Object.keys(connectedUsers).length}</span>
              <svg
                className="dropdown-arrow"
                width="12"
                height="12"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 7.5l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {showUsersDropdown && (
              <div className="users-dropdown-menu">
                <div className="users-dropdown-header">Connected Users</div>
                {Object.entries(connectedUsers).map(([userIdStr, userName]) => {
                  const userIdNum = Number(userIdStr);
                  const isOwner = fetchedNote && userIdNum === fetchedNote.owner;
                  return (
                    <div key={userIdStr} className="user-dropdown-item">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>{userName}</span>
                      {isOwner && (
                        <svg
                          className="owner-badge"
                          width="14"
                          height="14"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Owner</title>
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <div className="editor-content">
        <div className="editor-controls">
          <div className="editor-toolbar">
            <button className="toolbar-btn" onClick={() => handleFormat('bold')} aria-label="Bold" type="button">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 4h6a4 4 0 014 4 4 4 0 01-4 4H5V4z" fill="currentColor" />
                <path d="M5 12h7a4 4 0 014 4 4 4 0 01-4 4H5v-8z" fill="currentColor" />
              </svg>
            </button>

            <button className="toolbar-btn" onClick={() => handleFormat('italic')} aria-label="Italic" type="button">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4h8M4 16h8M11 4l-4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <button
              className="toolbar-btn"
              onClick={() => handleFormat('underline')}
              aria-label="Underline"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3v7a5 5 0 0010 0V3M4 18h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <button
              className="toolbar-btn"
              onClick={() => handleFormat('uppercase')}
              aria-label="Uppercase"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="2" y="15" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="currentColor">
                  AA
                </text>
              </svg>
            </button>
          </div>

          <div className="category-section">
            <label htmlFor="category-input" className="category-label">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zM11 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM11 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                  fill="currentColor"
                />
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

export default SharedEditorPage;
