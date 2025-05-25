import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Add the user message first
    setMessages((prev: Message[]) => [...prev, { role: 'user', content: text }]);

    // Placeholder assistant message that streams in
    const assistantMessage: Message = { role: 'assistant', content: '' };
    setMessages((prev: Message[]) => [...prev, assistantMessage]);

    const responseText =
      'This is an example of a streaming response coming from the server. It is delivered chunk by chunk to the UI.';

    for (let i = 0; i < responseText.length; i++) {
      // Simulate network streaming
      await new Promise((res) => setTimeout(res, 20));
      const chunk = responseText[i];
      setMessages((prev: Message[]) => {
        const updated = [...prev];
        const lastIdx = updated.findIndex((m: Message) => m === assistantMessage);
        if (lastIdx !== -1) {
          updated[lastIdx] = {
            ...assistantMessage,
            content: assistantMessage.content + chunk,
          };
        }
        assistantMessage.content += chunk;
        return updated;
      });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Sidebar onNewChat={handleNewChat} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatWindow messages={messages} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default App; 