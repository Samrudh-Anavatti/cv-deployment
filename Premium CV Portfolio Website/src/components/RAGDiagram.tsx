import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, X, Database, Brain, Search, MessageSquare, Zap, FileText } from 'lucide-react';

export function RAGDiagram() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all"
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
                    <X className="w-6 h-6 text-slate-700" />
                  </button>

                  {/* Header */}
                  <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-purple-50">
                    <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">
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
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur-lg opacity-40" />
                          <div className="relative bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-lg">
                            <MessageSquare className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                            <p className="text-center">User Query</p>
                            <p className="text-xs text-slate-500 text-center mt-1">
                              "Tell me about experience"
                            </p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ y: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-0.5 h-12 bg-gradient-to-b from-cyan-500 to-purple-500 mt-4"
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
                          className="w-0.5 h-12 bg-gradient-to-b from-purple-500 to-cyan-500"
                        />
                      </div>

                      {/* Data Sources & Components */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Vector Database */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl blur-lg opacity-50" />
                          <div className="relative bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-lg">
                            <Database className="w-8 h-8 text-indigo-600 mb-3" />
                            <h4 className="mb-2 text-slate-900">Vector Database</h4>
                            <p className="text-sm text-slate-600 mb-3">
                              Stores embeddings of portfolio content, projects, and experience
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded">
                                Pinecone
                              </span>
                              <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded">
                                Weaviate
                              </span>
                              <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded">
                                ChromaDB
                              </span>
                            </div>
                          </div>
                        </motion.div>

                        {/* LLM Processing */}
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl blur-lg opacity-50" />
                          <div className="relative bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-lg">
                            <Zap className="w-8 h-8 text-orange-600 mb-3" />
                            <h4 className="mb-2 text-slate-900">LLM Engine</h4>
                            <p className="text-sm text-slate-600 mb-3">
                              Powers intelligent response generation with context awareness
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded">
                                GPT-4
                              </span>
                              <span className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded">
                                Claude
                              </span>
                              <span className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded">
                                Llama
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Response */}
                      <div className="flex justify-center mt-12">
                        <motion.div
                          animate={{ y: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-0.5 h-12 bg-gradient-to-b from-cyan-500 to-purple-500 mb-4"
                        />
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex justify-center"
                      >
                        <div className="relative max-w-2xl w-full">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur-lg opacity-40" />
                          <div className="relative bg-gradient-to-r from-cyan-50 to-purple-50 border-2 border-cyan-300 rounded-2xl p-6 shadow-lg">
                            <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-center">Contextual Response</p>
                            <p className="text-xs text-slate-600 text-center mt-2">
                              "I have over 8 years of experience in full-stack development, currently working as
                              a Senior Full Stack Developer at TechCorp Industries..."
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
