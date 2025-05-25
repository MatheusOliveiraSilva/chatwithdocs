import React, { useState } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || isSending) return;
    setIsSending(true);
    await onSend(text);
    setText('');
    setIsSending(false);
  };

  return (
    <div style={{ borderTop: '1px solid #2b2b2b', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          width: '100%',
          maxWidth: 800,
          display: 'flex',
          gap: '0.75rem',
        }}
      >
        <input
          type="text"
          placeholder="Ask anything"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          style={{
            flex: 1,
            background: '#1e1e1e',
            border: '1px solid #3a3a3a',
            borderRadius: 6,
            padding: '0.75rem 1rem',
            color: '#fff',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={isSending || !text.trim()}
          style={{
            backgroundColor: '#005fff',
            border: 'none',
            color: '#fff',
            padding: '0 1.25rem',
            borderRadius: 6,
            cursor: isSending || !text.trim() ? 'not-allowed' : 'pointer',
            opacity: isSending || !text.trim() ? 0.6 : 1,
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatInput; 