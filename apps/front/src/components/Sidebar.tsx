import React from 'react';

interface SidebarProps {
  onNewChat: () => void;
  conversations?: string[]; // placeholder list
}

const Sidebar: React.FC<SidebarProps> = ({ onNewChat, conversations = [] }) => {
  return (
    <aside
      style={{
        width: 280,
        backgroundColor: '#1e1e1e',
        padding: '1rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <button
        onClick={onNewChat}
        style={{
          backgroundColor: '#005fff',
          border: 'none',
          color: '#fff',
          borderRadius: 6,
          padding: '0.75rem 1rem',
          cursor: 'pointer',
        }}
      >
        + New Chat
      </button>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {conversations.length === 0 ? (
          <p style={{ color: '#999' }}>No conversations</p>
        ) : (
          conversations.map((c, idx) => (
            <button
              key={idx}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#f8f8f2',
                textAlign: 'left',
                padding: '0.5rem 0.75rem',
                cursor: 'pointer',
                borderRadius: 4,
              }}
            >
              {c}
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 