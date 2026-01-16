
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { sickleCareAI } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your ZSI Assistant. How can I help you today with information about Sickle Cell care?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      let fullResponse = '';
      const stream = sickleCareAI.chat(history, userMessage);
      
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullResponse;
          return newMessages;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] bg-cream rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-burntOrange/20 animate-in zoom-in-95 duration-200">
          <div className="bg-burntOrange p-4 flex justify-between items-center text-cream">
            <div className="flex items-center space-x-2">
              <Bot size={24} />
              <span className="font-bold">ZSI Health Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50 backdrop-blur-sm">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-[85%]`}>
                  {m.role === 'model' && <div className="mt-1 bg-burntOrange/10 p-1 rounded-full"><Bot size={16} className="text-burntOrange" /></div>}
                  <div className={`p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-burntOrange text-cream rounded-tr-none' : 'bg-white border border-burntOrange/10 text-darkText rounded-tl-none shadow-sm'}`}>
                    {m.text || <Loader2 className="animate-spin" size={16} />}
                  </div>
                  {m.role === 'user' && <div className="mt-1 bg-darkText/5 p-1 rounded-full"><User size={16} /></div>}
                </div>
              </div>
            ))}
            {isTyping && messages[messages.length-1].text === '' && (
               <div className="flex justify-start">
                  <div className="bg-white border border-burntOrange/10 p-3 rounded-2xl rounded-tl-none shadow-sm">
                    <Loader2 className="animate-spin text-burntOrange" size={16} />
                  </div>
               </div>
            )}
          </div>

          <div className="p-4 border-t border-burntOrange/10 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about sickle cell..."
                className="flex-1 text-sm bg-cream border border-burntOrange/20 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-burntOrange/50"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping}
                className="bg-burntOrange text-cream p-2 rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-burntOrange text-cream p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all animate-bounce-slow flex items-center space-x-2 group"
        >
          <MessageCircle size={28} />
          <span className="hidden md:inline font-bold pr-2">Ask ZSI AI</span>
        </button>
      )}
    </div>
  );
};

export default AIChatBubble;
