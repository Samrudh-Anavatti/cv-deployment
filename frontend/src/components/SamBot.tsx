import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { Send, Bot, User, Upload, X } from 'lucide-react';
import { RAGDiagram } from './RAGDiagram';

// Simple markdown renderer for bot messages
function renderMarkdown(text: string) {
  // Split by numbered lists first
  const parts = text.split(/(\d+\.\s+\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    // Handle numbered list items with bold
    if (/^\d+\.\s+\*\*/.test(part)) {
      const match = part.match(/^(\d+)\.\s+\*\*([^*]+)\*\*/);
      if (match) {
        const [, number, boldText] = match;
        return (
          <div key={index} className="mb-3">
            <span className="font-semibold text-slate-900">
              {number}. {boldText}
            </span>
          </div>
        );
      }
    }

    // Handle inline bold text
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={index}>
        {boldParts.map((segment, i) => {
          if (segment.startsWith('**') && segment.endsWith('**')) {
            return (
              <strong key={i} className="font-semibold text-slate-900">
                {segment.slice(2, -2)}
              </strong>
            );
          }
          // Preserve line breaks
          return segment.split('\n').map((line, j) => (
            <span key={`${i}-${j}`}>
              {line}
              {j < segment.split('\n').length - 1 && <br />}
            </span>
          ));
        })}
      </span>
    );
  });
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  citations?: string[];
}

interface SamBotProps {
  sessionId: string;
  backendUrl: string;
}

export function SamBot({ sessionId, backendUrl }: SamBotProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm SamBot, your AI assistant. I can answer questions about Samrudh's background, or you can upload your own documents to test my RAG capabilities!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    // Scroll only within the chat container, not the entire page
    if (chatContainerRef.current && messagesEndRef.current) {
      const container = chatContainerRef.current;
      const target = messagesEndRef.current;
      container.scrollTop = target.offsetTop;
    }
  };

  useEffect(() => {
    // Only auto-scroll if there are messages (prevents initial scroll on page load)
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Upload to backend
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch(`${backendUrl}/api/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadResult = await uploadResponse.json();
      const filename = uploadResult.filename;

      // Embed the document with temporary status
      const embedResponse = await fetch(`${backendUrl}/api/embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: filename,
          sessionId: sessionId,
          documentType: 'temporary',
        }),
      });

      if (!embedResponse.ok) {
        throw new Error('Embedding failed');
      }

      const embedResult = await embedResponse.json();
      setUploadedFiles((prev) => [...prev, filename]);

      // Add success message
      const botMessage: Message = {
        id: Date.now().toString(),
        text: `Successfully uploaded and indexed "${filename}"! Created ${embedResult.chunks} chunks. You can now ask me questions about this document.`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: `Failed to upload document: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(`${backendUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputValue,
          enableRag: true,
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: result.response,
        sender: 'bot',
        timestamp: new Date(),
        citations: result.citations,
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section id="sambot" className="py-32 px-6 bg-gradient-to-b from-white via-slate-50 to-white" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sage-500 to-skyblue-600">
            Chat with SamBot
          </h2>
          <div className="w-20 h-1 mx-auto bg-gradient-to-r from-sage-500 to-skyblue-600 rounded-full mb-4" />
          <p className="text-slate-600 mb-6">
            I'm trained to answer questions about Samrudh's experience, skills, or projects, but you can ask anything! Try uploading your own documents as well.
          </p>
          <RAGDiagram />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sage-300 to-navy-300 rounded-3xl blur-xl opacity-50" />
          <div className="relative backdrop-blur-sm bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-sage-300/30 to-navy-300/30 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-sage-500 to-skyblue-600 rounded-full blur-md animate-pulse" />
                    <div className="relative p-2 bg-gradient-to-r from-sage-500 to-skyblue-600 rounded-full">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-slate-900">SamBot</h3>
                    <p className="text-xs text-slate-600">AI Assistant • Online</p>
                  </div>
                </div>

                {/* Upload Button */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <motion.button
                    onClick={() => fileInputRef.current?.click()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isUploading}
                    className="px-4 py-2 bg-gradient-to-r from-sage-500 to-skyblue-600 text-white rounded-lg text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    {isUploading ? 'Uploading...' : 'Upload Doc'}
                  </motion.button>
                </div>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-white rounded-full text-xs text-sage-500 border border-sage-500 flex items-center gap-2"
                    >
                      <span>{file}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Messages */}
            <div ref={chatContainerRef} className="h-[400px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-slate-50/30">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'bot'
                      ? 'bg-gradient-to-r from-sage-500 to-skyblue-600'
                      : 'bg-slate-300'
                      }`}
                  >
                    {message.sender === 'bot' ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-navy-700" />
                    )}
                  </div>
                  <div
                    className={`flex-1 max-w-[80%] px-4 py-3 rounded-2xl ${message.sender === 'bot'
                      ? 'bg-slate-100 text-slate-800'
                      : 'bg-gradient-to-r from-sage-300/30 to-navy-300/30 text-slate-900 border border-sage-500/30'
                      }`}
                  >
                    <div className="text-sm leading-relaxed">{renderMarkdown(message.text)}</div>
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <p className="text-xs text-slate-600 mb-1">Sources:</p>
                        <div className="flex flex-wrap gap-1">
                          {message.citations.map((citation, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-sage-300/40 text-sage-500 rounded text-xs"
                            >
                              {citation}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-sage-500 to-skyblue-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-slate-100">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-sage-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-sage-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-[var(--color-sage-light)]/200 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-slate-200 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sage-500 transition-colors"
                />
                <motion.button
                  onClick={handleSendMessage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!inputValue.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-sage-500 to-skyblue-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg shadow-sage-500/20"
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
