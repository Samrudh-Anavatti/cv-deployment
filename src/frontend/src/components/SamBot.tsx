import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    citations?: string[];
}

export function SamBot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "👋 Hi! I'm SamBot, Samrudh's AI assistant. Ask me anything about his experience, skills, or projects!"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [enableRag, setEnableRag] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7071';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${backendUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: input,
                    enableRag: enableRag
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response,
                citations: data.citations || []
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again later.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <section className="sambot-section">
            <div className="sambot-header">
                <h2 className="section-title">
                    <Bot size={32} className="bot-icon" />
                    Chat with SamBot
                </h2>
                <p className="sambot-subtitle">
                    Ask me anything about Samrudh's experience, skills, or projects!
                </p>
                <div className="rag-toggle">
                    <label>
                        <input
                            type="checkbox"
                            checked={enableRag}
                            onChange={(e) => setEnableRag(e.target.checked)}
                        />
                        <span>Enable RAG (Retrieval-Augmented Generation)</span>
                    </label>
                </div>
            </div>

            <div className="chat-container">
                <div className="messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message message-${message.role}`}>
                            <div className="message-icon">
                                {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                            </div>
                            <div className="message-content">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.content}
                                </ReactMarkdown>
                                {message.citations && message.citations.length > 0 && (
                                    <div className="citations">
                                        <strong>Sources:</strong> {message.citations.join(', ')}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message message-assistant">
                            <div className="message-icon">
                                <Bot size={20} />
                            </div>
                            <div className="message-content">
                                <Loader2 className="spinner" size={20} />
                                <span>Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-container">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about Samrudh's experience with AWS, RAG systems, or anything else..."
                        className="chat-input"
                        rows={2}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        className="send-button"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
