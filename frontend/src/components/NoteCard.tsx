import React from 'react';
import type { NoteCardProps } from '../types';

const NoteCard: React.FC<NoteCardProps> = ({
  id,
  title,
  preview,
  timestamp,
  category,
  onClick,
  onDelete,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when deleting
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div className="note-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="note-card-header">
        <h3 className="note-card-title">{title}</h3>
        <div className="note-card-header-actions">
          <span className="note-card-category">{category}</span>
          {onDelete && (
            <button 
              className="note-card-delete-btn" 
              onClick={handleDelete}
              aria-label="Delete note"
              title="Delete note"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" fill="currentColor"/>
              </svg>
            </button>
          )}
        </div>
      </div>
      <p className="note-card-preview">{preview}</p>
      <div className="note-card-footer">
        <span className="note-card-timestamp">{timestamp}</span>
      </div>
    </div>
  );
};

export default NoteCard;
