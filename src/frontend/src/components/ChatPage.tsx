import { useState, useEffect, useRef } from "react";
import { Header } from "./Header";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { Button } from "./ui/button";
import { ChevronLeft, Plus, FileText, Trash2, Download, Pencil, Check, X } from "lucide-react";

interface Source {
  id: number;
  fileName: string;
  chunkIndex: number;
  textPreview: string;
  fullText: string;
  score: number;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: Source[];
  summaryType?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  timestamp: string;
}

interface EmbeddingStatus {
  isProcessing: boolean;
  fileName: string;
  message: string;
  progress?: string;
}

interface ChatPageProps {
  onBack: () => void;
  knowledgeBaseName: string;
  knowledgeBaseId: string;
}

export function ChatPage({ onBack, knowledgeBaseName, knowledgeBaseId }: ChatPageProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [embeddingStatus, setEmbeddingStatus] = useState<EmbeddingStatus>({
    isProcessing: false,
    fileName: '',
    message: ''
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(knowledgeBaseName);
  const [currentKbName, setCurrentKbName] = useState(knowledgeBaseName);

  // Azure Function URLs
  const AZURE_FUNCTIONS_URL = import.meta.env.REACT_APP_AZURE_FUNCTIONS_URL || 'http://localhost:7071';
  const AZURE_DOCPROC_URL = import.meta.env.REACT_APP_AZURE_DOCPROC_URL || 'http://localhost:7072';
  const AZURE_EMBEDDING_URL = import.meta.env.REACT_APP_AZURE_EMBEDDING_URL || 'http://localhost:7073';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (knowledgeBaseId) {
      fetchChatHistory();
      fetchDocuments();
    }
  }, [knowledgeBaseId]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`${AZURE_DOCPROC_URL}/api/chats?kb_id=${knowledgeBaseId}`);
      if (response.ok) {
        const chatData = await response.json();
        const convertedMessages = (chatData.messages || []).map((msg: any, index: number) => ({
          id: `msg-${index}-${Date.now()}`,
          sender: msg.role === 'user' ? 'user' : 'assistant',
          text: msg.content || msg.text || '',
          sources: msg.sources || undefined,
          summaryType: msg.summaryType || undefined,
        }));
        setMessages(convertedMessages);
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${AZURE_DOCPROC_URL}/api/documents?kb_id=${knowledgeBaseId}`);
      if (response.ok) {
        const data = await response.json();
        const convertedFiles: UploadedFile[] = data.map((doc: any) => ({
          id: doc.fileName,
          name: doc.fileName,
          size: `${(doc.sizeBytes / 1024).toFixed(2)} KB`,
          timestamp: new Date(doc.uploadedAt).toLocaleDateString('en-GB'),
        }));
        setUploadedFiles(convertedFiles);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  const saveChatHistory = async (messagesToSave: Message[]) => {
    try {
      const chatData = {
        id: `kb-${knowledgeBaseId}`,
        title: `${currentKbName} Chat`,
        knowledgeBaseId: knowledgeBaseId,
        knowledgeBaseName: currentKbName,
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        messages: messagesToSave.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
          timestamp: new Date().toISOString(),
          sources: msg.sources || undefined,
          summaryType: msg.summaryType || undefined
        }))
      };

      const response = await fetch(`${AZURE_DOCPROC_URL}/api/chats/kb-${knowledgeBaseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatData),
      });

      if (response.status === 404) {
        await fetch(`${AZURE_DOCPROC_URL}/api/chats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(chatData),
        });
      }
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: message.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Create abort controller with 10-minute timeout for large document summarization
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes

    try {
      const response = await fetch(`${AZURE_FUNCTIONS_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage.text,
          model: import.meta.env.REACT_APP_DEFAULT_MODEL || 'phi3:14b',
          enableRag: true,
          searchType: 'hybrid',
          knowledgeBaseId: knowledgeBaseId,
          chatId: `kb-${knowledgeBaseId}`
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // Clear timeout on successful response

      const data = await response.json();
      console.log('Response data:', data);
      console.log('Sources from backend:', data.sources);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.response || 'No response received',
        sources: data.sources || undefined,
        summaryType: data.summaryType || undefined,
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      await saveChatHistory(finalMessages);
    } catch (error) {
      clearTimeout(timeoutId); // Clear timeout on error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      await saveChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    const fileArray = Array.from(files);
    const totalFiles = fileArray.length;
    let successCount = 0;
    let failCount = 0;

    // Process files sequentially
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const fileNumber = i + 1;

      try {
        // Step 1: Show upload status
        setEmbeddingStatus({
          isProcessing: true,
          fileName: file.name,
          message: `Uploading document... (${fileNumber} of ${totalFiles})`,
          progress: 'Step 1 of 2'
        });

        const formData = new FormData();
        formData.append('file', file);

        // Upload document
        const uploadResponse = await fetch(`${AZURE_DOCPROC_URL}/api/documents/upload?kb_id=${knowledgeBaseId}`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          const fileName = uploadData.fileName;

          // Step 2: Show embedding status
          setEmbeddingStatus({
            isProcessing: true,
            fileName: fileName,
            message: `Embedding document... (${fileNumber} of ${totalFiles})`,
            progress: 'Step 2 of 2'
          });

          // Add to UI immediately
          const uploaded: UploadedFile = {
            id: fileName,
            name: fileName,
            size: `${(file.size / 1024).toFixed(2)} KB`,
            timestamp: new Date().toLocaleDateString('en-GB'),
          };
          setUploadedFiles((prev) => [...prev, uploaded]);

          // Generate embeddings
          const embedResponse = await fetch(`${AZURE_EMBEDDING_URL}/api/embed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: fileName, knowledgeBaseId: knowledgeBaseId }),
          });

          if (embedResponse.ok) {
            const embedData = await embedResponse.json();
            successCount++;

            // Show success for this file (brief)
            setEmbeddingStatus({
              isProcessing: false,
              fileName: fileName,
              message: `✅ ${fileName} completed (${embedData.embeddedChunks || embedData.chunks || 0} sections)`,
            });

            // Brief pause to show success before moving to next file
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            failCount++;
          }
        } else {
          failCount++;
        }
      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);
        failCount++;

        // Show error briefly
        setEmbeddingStatus({
          isProcessing: false,
          fileName: file.name,
          message: `❌ Failed: ${file.name}`,
        });

        // Brief pause before continuing
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    // Show final summary
    setEmbeddingStatus({
      isProcessing: false,
      fileName: '',
      message: `✅ Upload complete! ${successCount} succeeded${failCount > 0 ? `, ${failCount} failed` : ''}.`,
    });

    // Clear summary after 5 seconds
    setTimeout(() => {
      setEmbeddingStatus({
        isProcessing: false,
        fileName: '',
        message: ''
      });
    }, 5000);

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteDocument = async (fileId: string) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `⚠️ Delete "${fileId}"?\n\nThis will permanently remove the document and all its embeddings from the knowledge base.\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return; // User cancelled
    }

    try {
      const deleteResponse = await fetch(`${AZURE_DOCPROC_URL}/api/documents/${fileId}?kb_id=${knowledgeBaseId}`, {
        method: 'DELETE',
      });

      if (deleteResponse.ok) {
        setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));

        // Delete embeddings
        await fetch(`${AZURE_EMBEDDING_URL}/api/embed/${fileId}?kb_id=${knowledgeBaseId}`, {
          method: 'DELETE',
        });
      }
    } catch (error) {
      console.error('Deletion failed:', error);
    }
  };

  const handleDownloadDocument = async (fileId: string, fileName: string) => {
    try {
      const downloadResponse = await fetch(`${AZURE_DOCPROC_URL}/api/documents/${fileId}/download?kb_id=${knowledgeBaseId}`, {
        method: 'GET',
      });

      if (downloadResponse.ok) {
        // Get the blob from the response
        const blob = await downloadResponse.blob();

        // Create a download link and trigger it
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Download failed:', downloadResponse.statusText);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleSaveKbName = async () => {
    if (!editedName.trim() || editedName === currentKbName) {
      setIsEditingName(false);
      setEditedName(currentKbName);
      return;
    }

    try {
      const response = await fetch(`${AZURE_DOCPROC_URL}/api/knowledge-bases/${knowledgeBaseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedName.trim() }),
      });

      if (response.ok) {
        setCurrentKbName(editedName.trim());
        setIsEditingName(false);
      } else {
        console.error('Failed to update KB name');
        setEditedName(currentKbName);
        setIsEditingName(false);
      }
    } catch (error) {
      console.error('Error updating KB name:', error);
      setEditedName(currentKbName);
      setIsEditingName(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(currentKbName);
    setIsEditingName(false);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50/50 via-amber-50/30 to-yellow-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col">
      <Header onLogoClick={onBack} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-900 border-r border-orange-950/10 dark:border-orange-200/10 flex flex-col shrink-0">
          {/* Knowledge Base Header */}
          <div className="p-4 border-b border-orange-950/10 dark:border-orange-200/10 shrink-0">
            <Button
              variant="ghost"
              onClick={onBack}
              className="w-full justify-start mb-3 text-orange-900 dark:text-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-950 dark:hover:text-orange-100"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Knowledge Bases
            </Button>

            <div className="px-3 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-950/10 dark:border-orange-200/10 rounded-lg">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveKbName();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    className="flex-1 text-sm bg-white dark:bg-gray-800 text-orange-950 dark:text-orange-100 border border-orange-950/20 dark:border-orange-200/20 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveKbName}
                    className="h-7 w-7 p-0 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="h-7 w-7 p-0 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-orange-950 dark:text-orange-100 truncate flex-1">{currentKbName}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingName(true)}
                    className="h-7 w-7 p-0 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-950/30 shrink-0"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Documents Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 flex items-center justify-between border-b border-orange-950/10 dark:border-orange-200/10 shrink-0">
              <span className="text-sm text-orange-900 dark:text-orange-200">{uploadedFiles.length} document{uploadedFiles.length !== 1 ? 's' : ''}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="h-8 w-8 text-orange-700 dark:text-orange-300 hover:text-orange-950 dark:hover:text-orange-100 hover:bg-orange-50 dark:hover:bg-orange-950/20"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.txt,.doc,.docx,.xlsx,.xls"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-3 space-y-2">
                {uploadedFiles.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 border border-orange-950/5 dark:border-orange-200/5 bg-white dark:bg-gray-800 transition-colors group"
                  >
                    <FileText className="w-4 h-4 text-orange-700 dark:text-orange-300 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-orange-950 dark:text-orange-100 truncate">{doc.name}</p>
                      <p className="text-xs text-orange-700/60 dark:text-orange-300/60 mt-1">
                        {doc.timestamp} • {doc.size}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 text-orange-700 dark:text-orange-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-opacity shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadDocument(doc.id, doc.name);
                      }}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 text-orange-700 dark:text-orange-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-opacity shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(doc.id);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isBot={message.sender === 'assistant'}
                  sources={message.sources}
                  summaryType={message.summaryType}
                />
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-700 dark:bg-orange-400 rounded-full animate-pulse" />
                  </div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">Thinking...</div>
                </div>
              )}

              {/* Embedding Status Display */}
              {embeddingStatus.message && (
                <div className={`bg-white dark:bg-gray-800 backdrop-blur-sm border border-l-4 border-orange-950/10 dark:border-orange-200/10 ${
                  embeddingStatus.isProcessing
                    ? 'border-l-orange-600 dark:border-l-orange-500'
                    : embeddingStatus.message.includes('✅') || embeddingStatus.message.includes('Document embedded successfully')
                    ? 'border-l-emerald-600 dark:border-l-emerald-500'
                    : 'border-l-red-600 dark:border-l-red-500'
                } rounded-lg p-4 flex items-start gap-3 shadow-sm`}>
                  <div className="shrink-0 mt-0.5">
                    {embeddingStatus.isProcessing ? (
                      <div className="w-5 h-5 border-2 border-orange-700 dark:border-orange-400 border-t-transparent rounded-full animate-spin" />
                    ) : embeddingStatus.message.includes('✅') || embeddingStatus.message.includes('Document embedded successfully') ? (
                      <svg className="w-5 h-5 text-emerald-700 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-700 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm text-orange-950 dark:text-orange-100">{embeddingStatus.message}</p>
                    </div>
                    {embeddingStatus.progress && (
                      <p className="text-xs text-orange-700/60 dark:text-orange-300/60 mb-1">{embeddingStatus.progress}</p>
                    )}
                    <p className="text-xs text-orange-700/60 dark:text-orange-300/60 truncate">{embeddingStatus.fileName}</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-orange-950/10 dark:border-orange-200/10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 shrink-0">
            <div className="max-w-4xl mx-auto">
              <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
