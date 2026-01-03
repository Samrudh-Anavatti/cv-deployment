import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, X, MessageSquare, Search, Database, Brain, FileText } from 'lucide-react';

export function RAGDiagram() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sage-500 to-skyblue-600 rounded-xl shadow-lg shadow-sage-500/30 hover:shadow-xl hover:shadow-sage-500/40 transition-all"
      >
        <Network className="w-5 h-5 text-white" />
        <span className="text-white">View RAG Architecture</span>
        <motion.div
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white"
        >
          →
        </motion.div>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50"
            />

            {/* Diagram Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-4 md:inset-10 z-50 overflow-auto"
            >
              <div className="min-h-full flex items-center justify-center p-4">
                <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl">
                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
                  >
                    <X className="w-5 h-5 text-sage-500" />
                  </button>

                  {/* Header */}
                  <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-sage-300/30 to-navy-300/30">
                    <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-sage-500 to-skyblue-600">
                      RAG (Retrieval-Augmented Generation) Architecture
                    </h3>
                    <p className="text-sm text-slate-600 mt-2">
                      How SamBot retrieves and generates intelligent responses
                    </p>
                  </div>

                  {/* Diagram Content */}
                  <div className="p-8">
                    <div className="relative">
                      {/* User Query */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center mb-12"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-sage-500 to-skyblue-600 rounded-2xl blur-lg opacity-40" />
                          <div className="relative bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-lg">
                            <MessageSquare className="w-6 h-6 text-sage-500 mx-auto mb-2" />
                            <p className="text-center">User Query</p>
                            <p className="text-xs text-slate-500 text-center mt-1">
                              "Tell me about experience"
                            </p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ y: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-0.5 h-12 bg-gradient-to-b from-sage-500 to-skyblue-600 mt-4"
                        />
                      </motion.div>

                      {/* Processing Flow */}
                      <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {/* Step 1: Query Processing */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl blur-lg opacity-50" />
                          <div className="relative bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-lg h-full">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Search className="w-6 h-6 text-blue-600" />
                              </div>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Step 1
                              </span>
                            </div>
                            <h4 className="mb-2 text-slate-900">Query Processing</h4>
                            <p className="text-sm text-slate-600">
                              User input is analyzed and converted into vector embeddings for semantic search
                            </p>
                          </div>
                        </motion.div>

                        {/* Step 2: Retrieval */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl blur-lg opacity-50" />
                          <div className="relative bg-white border-2 border-purple-200 rounded-2xl p-6 shadow-lg h-full">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Database className="w-6 h-6 text-purple-600" />
                              </div>
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                Step 2
                              </span>
                            </div>
                            <h4 className="mb-2 text-slate-900">Retrieval</h4>
                            <p className="text-sm text-slate-600">
                              Most relevant context is retrieved from vector database using similarity search
                            </p>
                          </div>
                        </motion.div>

                        {/* Step 3: Generation */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl blur-lg opacity-50" />
                          <div className="relative bg-white border-2 border-green-200 rounded-2xl p-6 shadow-lg h-full">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <Brain className="w-6 h-6 text-green-600" />
                              </div>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Step 3
                              </span>
                            </div>
                            <h4 className="mb-2 text-slate-900">Generation</h4>
                            <p className="text-sm text-slate-600">
                              LLM generates response using retrieved context and query understanding
                            </p>
                          </div>
                        </motion.div>
                      </div>

                      {/* Arrow Down */}
                      <div className="flex justify-center mb-12">
                        <motion.div
                          animate={{ y: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-0.5 h-12 bg-gradient-to-b from-sage-500 to-skyblue-600"
                        />
                      </div>

                      {/* Data Sources & Components */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Azure AI Search */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl blur-lg opacity-50" />
                          <div className="relative bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-lg">
                            {/* Azure AI Search Icon */}
                            <div className="w-16 h-16 flex items-center justify-center mb-3 mx-auto">
                              <img src="/images/azure/03321-icon-service-Serverless-Search.svg" alt="Azure AI Search" className="w-full h-full object-contain" />
                            </div>
                            <h4 className="mb-2 text-slate-900 text-center">Azure AI Search</h4>
                            <p className="text-sm text-slate-600 mb-3">
                              Vector database storing embeddings of CV content, projects, and uploaded documents with hybrid search capabilities
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded">
                                Vector Search
                              </span>
                              <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded">
                                Semantic Ranking
                              </span>
                            </div>
                          </div>
                        </motion.div>

                        {/* Azure AI Foundry */}
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl blur-lg opacity-50" />
                          <div className="relative bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-lg">
                            {/* Azure AI Foundry Icon */}
                            <div className="w-16 h-16 flex items-center justify-center mb-3 mx-auto">
                              <img src="/images/azure/03513-icon-service-AI-Studio.svg" alt="Azure AI Foundry" className="w-full h-full object-contain" />
                            </div>
                            <h4 className="mb-2 text-slate-900 text-center">Azure AI Foundry</h4>
                            <p className="text-sm text-slate-600 mb-3">
                              GPT-4o model for intelligent response generation with context-aware reasoning
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded">
                                GPT-4o
                              </span>
                              <span className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded">
                                Embeddings
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Infrastructure Layer */}
                      <div className="mt-8 pt-8 border-t border-slate-200">
                        <h4 className="text-center text-sage-500 mb-6">Infrastructure & Services</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          {/* Azure Functions */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0 }}
                            className="bg-white border-2 border-blue-200 rounded-xl p-4"
                          >
                            <div className="w-8 h-8 flex items-center justify-center mb-3 mx-auto">
                              <img src="/images/azure/functions.png" alt="Azure Functions" className="w-full h-full object-contain" />
                            </div>
                            <h5 className="text-sm font-semibold text-slate-900 mb-1 text-center">Azure Functions</h5>
                            <p className="text-xs text-slate-600 text-center">Serverless API endpoints for chat, upload, and search</p>
                          </motion.div>

                          {/* Blob Storage */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 }}
                            className="bg-white border-2 border-purple-200 rounded-xl p-4"
                          >
                            <div className="w-8 h-8 flex items-center justify-center mb-3 mx-auto">
                              <img src="/images/azure/blob-storage.png" alt="Blob Storage" className="w-full h-full object-contain" />
                            </div>
                            <h5 className="text-sm font-semibold text-slate-900 mb-1 text-center">Blob Storage</h5>
                            <p className="text-xs text-slate-600 text-center">Document storage for uploaded PDFs and CV files</p>
                          </motion.div>

                          {/* Static Web Apps */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="bg-white border-2 border-green-200 rounded-xl p-4"
                          >
                            <div className="w-8 h-8 flex items-center justify-center mb-3 mx-auto">
                              <img src="/images/azure/azure-static-web-apps.svg" alt="Static Web Apps" className="w-full h-full object-contain" />
                            </div>
                            <h5 className="text-sm font-semibold text-slate-900 mb-1 text-center">Static Web Apps</h5>
                            <p className="text-xs text-slate-600 text-center">React frontend hosting with global CDN</p>
                          </motion.div>
                        </div>
                      </div>

                      {/* Response */}
                      <div className="flex justify-center mt-12">
                        <motion.div
                          animate={{ y: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-0.5 h-12 bg-gradient-to-b from-sage-500 to-skyblue-600 mb-4"
                        />
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex justify-center"
                      >
                        <div className="relative max-w-2xl w-full">
                          <div className="absolute inset-0 bg-gradient-to-r from-sage-500 to-skyblue-600 rounded-2xl blur-lg opacity-30" />
                          <div className="relative bg-white border-2 border-sage-500 rounded-2xl p-6 shadow-lg">
                            <FileText className="w-6 h-6 text-sage-500 mx-auto mb-2" />
                            <p className="text-center">Contextual Response</p>
                            <p className="text-xs text-slate-600 text-center mt-2">
                              "I'm currently working as a Senior AI Developer at Phoenix Solutions..."
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
