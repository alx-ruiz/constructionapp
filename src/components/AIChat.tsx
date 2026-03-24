import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, AlertTriangle } from 'lucide-react';
import './AIChat.css';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your BuildCommand AI Assistant. Ask me anything about your construction projects, schedule, or budget." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-ai-chat', handleToggle);
    return () => window.removeEventListener('toggle-ai-chat', handleToggle);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    
    // Check VITE_OPENAI_API_KEY environment variable
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    if (!apiKey) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'system', 
          content: 'API Key not found. Please add VITE_OPENAI_API_KEY to your environment variables (e.g. in Vercel or locally in .env) to enable the AI model.' 
        }]);
      }, 500);
      return;
    }

    setIsLoading(true);
    try {
      // Create chat history for the API, filtering out internal system error messages
      const apiMessages = newMessages.filter(m => m.role !== 'system').map(m => ({
        role: m.role,
        content: m.content
      }));

      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${apiKey}` 
        },
        body: JSON.stringify({ 
          model: 'gpt-4o', 
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant built into BuildCommand, a construction management app for small residential builders.' },
            ...apiMessages
          ]
        })
      });
      
      const data = await resp.json();
      if (data.choices && data.choices[0]) {
        setMessages(prev => [...prev, data.choices[0].message]);
      } else {
        setMessages(prev => [...prev, { role: 'system', content: 'Connection error or invalid API key.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'system', content: 'Network error. Failed to connect to AI provider.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chat-window animate-fade-in shadow-2xl">
      <div className="chat-header">
        <div className="flex items-center gap-2 font-bold text-white">
          <Bot size={20} className="text-brand-primary" /> 
          BuildCommand AI
        </div>
        <button className="btn-icon bg-transparent border-none text-white hover:bg-white/10" onClick={() => setIsOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <div className="chat-messages p-4 bg-bg-primary">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble-wrapper ${m.role}`}>
            {m.role === 'system' && <AlertTriangle size={14} className="text-danger shrink-0 mt-1" />}
            <div className={`chat-bubble ${m.role}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-bubble-wrapper assistant">
            <div className="chat-bubble assistant typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area border-t border-color p-3 flex gap-2 bg-bg-secondary" onSubmit={sendMessage}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..." 
          className="flex-1 bg-bg-tertiary border border-color rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary text-text-primary placeholder:text-text-secondary"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          className="btn-primary w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed border-none text-white" 
          style={{ background: 'var(--brand-primary)' }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
