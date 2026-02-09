import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import type { RootState } from '../types';
import { useAppDispatch } from '../store/hooks';

// import { updateNote } from '../store/slices/notesSlice';
import ThemeToggle from '../components/ThemeToggle';
import Loader from '../components/Loader';
import { updateNote } from '../store/slices/notesSlice';
import {  fetchIndividualNote } from '../store/slices/individualNoteSlice';

function EditorPage() {
  const WS_BASE_URL = import.meta.env.VITE_WS_URL;

  console.log("this is editor page");
  const { id } = useParams<{ id: string }>();
  const timer=useRef<number|null>(null);
  const socketRef=useRef<WebSocket|null>(null);
  const userId=useSelector((state:RootState)=>state.auth.user?.id)
  const username=useSelector((state:RootState)=>state.auth.user?.name)
  useEffect(()=>{
    const socket= new WebSocket(`${WS_BASE_URL}/ws/notes/${id}/`);
    socketRef.current=socket;
    
    socket.onopen=()=>{
      console.log(" WebSocket connected for note:", id);
      setIsWsConnected(true);
      // Don't add current user here - wait for the join message from backend
      // This ensures all users are added through the same mechanism
      socket.send(
          JSON.stringify({
            type:"join",
            username:username,
            senderId:userId,
          })
        )
    }
      
    socket.onmessage=(event:MessageEvent)=>{
      const data=JSON.parse(event.data)
      console.log("WebSocket message received:", data);

      
      

      if(data.type==="join"){
        console.log("joined "+data.username+" "+data.senderId+" "+data.current_user);
        
        // Update the connected users list
        // Strategy: Keep track of users we know about (with IDs), and add the new user
        console.log(data.current_user);
        setConnectedUsers(data.current_user);
        
        // Don't show toast for your own join
        if(data.senderId===userId){
          return;
        }
        toast.success(`${data.username} joined`, {
          autoClose: 3000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
        });
        return;
      }
      if(data.type==="leaved"){
        console.log("leaved "+data.username+" "+data.senderId+" "+data.current_user);
        // Remove user from connected users list
        setConnectedUsers(data.current_user);
        if(data.senderId===userId){
        return;
      }
        toast.error(`${data.username} leaved`, {
          autoClose: 3000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
        });
        return;
      }
      if(data.senderId===userId){
        return;
      }
      if(bodyRef.current){
        bodyRef.current.innerHTML=data.content;
      }
      console.log("Message received:", data.content);

    }


    socket.onerror=(error:Event)=>{
      console.log("WebSocket error:", error);
      setIsWsConnected(false);
    }
    socket.onclose=()=>{
      console.log("WebSocket disconnected for note:", id);
      setIsWsConnected(false);
    }

    return ()=>{
       if (socket.readyState === WebSocket.OPEN){
        socket.send(
          JSON.stringify({
            type:"leaved",
            username:username,
            senderId:userId,
          })
        )
       }
      
      socket.close();
    }
  },[id])



  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Convert id to number for comparison
  const noteId = id ? Number(id) : null;
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [isShareCopied, setIsShareCopied] = useState(false);
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
  
  // Check if current user is the owner of the note
  const isOwner = currentUser && fetchedNote && currentUser.id === fetchedNote.owner;

  // Load note data when component mounts or note changes
  useEffect(() => {
    if (noteId) {
      setIsLoadingNote(true);
      // Always fetch individual note to get full content
      dispatch(fetchIndividualNote({ noteId }))
        .unwrap()
        .then((fetchedNote) => {
          setFetchedNote(fetchedNote);
          setTitle(fetchedNote.title);
          setCategory(fetchedNote.category || '');
          setIsLoadingNote(false);
        })
        .catch((error) => {
          console.error('Failed to fetch note:', error);
          setIsLoadingNote(false);
          navigate('/dashboard');
        });
    }
  }, [noteId, dispatch, navigate]);

  // Set body content after component renders and fetchedNote is available
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
    
    // Auto-save title
    if(timer.current){
      clearTimeout(timer.current)
    }
    if(id && bodyRef.current){
      timer.current=window.setTimeout(()=>{
        const currentContent = bodyRef.current?.innerHTML || '';
        dispatch(updateNote({id, title: newTitle, content: currentContent, category}))
      }, 800);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    
    // Auto-save category
    if(timer.current){
      clearTimeout(timer.current)
    }
    if(id && bodyRef.current){
      timer.current=window.setTimeout(()=>{
        const currentContent = bodyRef.current?.innerHTML || '';
        dispatch(updateNote({id, title, content: currentContent, category: newCategory}))
      }, 800);
    }
  };

  const handleBodyInput = () => {
    // console.log(userId)
    if(!userId || !bodyRef.current) return;
    const newBody = bodyRef.current.innerHTML;
    if (bodyRef.current) {
      
      
      if(socketRef.current?.readyState===WebSocket.OPEN){
        // console.log("send")
        // console.log("WS readyState:", socketRef.current?.readyState);

        socketRef.current.send(
          JSON.stringify({
            content:newBody,
            senderId:userId,
          })
        )
      }
    }
    if(timer.current){
      clearTimeout(timer.current)
    }
    if(id){
      // console.log("saving")
      timer.current=window.setTimeout(()=>{
        // console.log("saving")
      dispatch(updateNote({id,title,content:newBody,category}))
    },800);
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

  const handleShare = async () => {
    if (!id) return;
    
    const shareUrl = `${window.location.origin}/editor/${id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsShareCopied(true);
      setShowCopyNotification(true);
      setTimeout(() => {
        setIsShareCopied(false);
      }, 1000);
      setTimeout(() => setShowCopyNotification(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  if (isLoadingNote || !fetchedNote) {
    return <Loader fullScreen message="Loading note..." />;
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
          {isOwner ? (
            // Owner's note - show "All changes saved" or connection status
            isWsConnected ? (
              <>
                <svg className="connection-dot connected" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="4" fill="currentColor"/>
                </svg>
                <span>Connected</span>
              </>
            ) : (
              <>
                <svg className="save-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z" fill="currentColor"/>
                </svg>
                <span>All changes saved</span>
              </>
            )
          ) : (
            // Not owner - show connection status
            isWsConnected ? (
              <>
                <svg className="connection-dot connected" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="4" fill="currentColor"/>
                </svg>
                <span>Connected</span>
              </>
            ) : (
              <>
                <svg className="connection-dot disconnected" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="4" fill="currentColor"/>
                </svg>
                <span>Disconnected</span>
              </>
            )
          )}
        </div>

        <div className="editor-nav-right">
          <button 
            className="share-btn" 
            onClick={handleShare}
            aria-label="Share note"
            title="Copy share link"
          >
            {isShareCopied ? (
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 8a3 3 0 100-6 3 3 0 000 6zM15 18a3 3 0 100-6 3 3 0 000 6zM5 13a3 3 0 100-6 3 3 0 000 6z" fill="currentColor"/>
                <path d="M7.59 11.51l4.82 2.98M12.41 6.51l-4.82 2.98" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
            {showCopyNotification && <span className="copy-notification">Copied!</span>}
          </button>
          <div className="editor-users-dropdown" ref={dropdownRef}>
            <button 
              className="users-dropdown-trigger"
              onClick={() => setShowUsersDropdown(!showUsersDropdown)}
              aria-label="Show connected users"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" fill="currentColor"/>
              </svg>
              <span>{Object.keys(connectedUsers).length}</span>
              <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                        <path fillRule="evenodd" clipRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" fill="currentColor"/>
                      </svg>
                      <span>{userName}</span>
                      {isOwner && (
                        <svg className="owner-badge" width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <title>Owner</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill="currentColor"/>
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


