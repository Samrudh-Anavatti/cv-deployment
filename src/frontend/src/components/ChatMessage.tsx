import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Bot, User, Copy, Check } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useState } from 'react';

interface Source {
  id: number;
  fileName: string;
  chunkIndex: number;
  textPreview: string;
  fullText: string;
  score: number;
}

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  sources?: Source[];
  summaryType?: string;
}

export function ChatMessage({ message, isBot, sources, summaryType }: ChatMessageProps) {
  const [hoveredSource, setHoveredSource] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Group sources by document for full summaries
  const groupedSources = summaryType === 'full_summary' && sources
    ? sources.reduce((acc, source) => {
        if (!acc[source.fileName]) {
          acc[source.fileName] = [];
        }
        acc[source.fileName].push(source);
        return acc;
      }, {} as Record<string, Source[]>)
    : null;

  return (
    <div className={`flex gap-3 ${isBot ? "" : "flex-row-reverse"}`}>
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className={isBot ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" : "bg-orange-950 dark:bg-orange-700 text-white"}>
          {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={`flex flex-col gap-1 max-w-[70%] ${isBot ? "items-start" : "items-end"}`}>
        <div
          className={`relative px-4 py-3 rounded-2xl ${
            isBot
              ? "bg-white dark:bg-gray-800 border border-orange-950/10 dark:border-orange-200/10 text-orange-950 dark:text-orange-100 rounded-tl-sm"
              : "bg-orange-700 dark:bg-orange-600 text-white rounded-tr-sm"
          }`}
        >
          {isBot ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-orange-100 dark:bg-orange-900/30 px-1 py-0.5 rounded text-sm">{children}</code>
                    ) : (
                      <code className="block bg-orange-50 dark:bg-orange-950/30 p-2 rounded text-sm overflow-x-auto">{children}</code>
                    );
                  },
                }}
              >
                {message}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words">{message}</p>
          )}

          {/* Sources inside the bubble */}
          {sources && sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-orange-950/10 dark:border-orange-200/10">
              <div className="mb-1.5">
                <span className="text-xs font-semibold text-orange-950 dark:text-orange-100">Sources:</span>
              </div>
              <div className="space-y-1 pb-7">
                {summaryType === 'full_summary' && groupedSources ? (
                  // Full summary: Show only document names
                  Object.keys(groupedSources).map((fileName, idx) => (
                    <div
                      key={idx}
                      className="relative text-xs font-medium text-orange-700 dark:text-orange-300 px-2 py-1.5 rounded bg-orange-50/50 dark:bg-orange-900/10"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">[{idx + 1}]</span>
                        <span className="font-medium">{fileName}</span>
                        <span className="text-orange-600 dark:text-orange-400">(Full Document)</span>
                      </div>
                    </div>
                  ))
                ) : (
                  // Regular QA or partial summary: Show individual sections
                  sources.map((source) => (
                    <div
                      key={source.id}
                      className="relative text-xs font-medium text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 px-2 py-1.5 rounded cursor-pointer transition-colors bg-orange-50/50 dark:bg-orange-900/10"
                      onMouseEnter={() => setHoveredSource(source.id)}
                      onMouseLeave={() => setHoveredSource(null)}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">[{source.id}]</span>
                        <span className="font-medium">{source.fileName}</span>
                        <span className="text-orange-600 dark:text-orange-400">(section {source.chunkIndex + 1})</span>
                      </div>

                      {/* Hover tooltip with preview */}
                      {hoveredSource === source.id && (
                        <div className="absolute left-0 top-full mt-1 w-80 z-50 bg-white dark:bg-gray-800 border border-orange-950/20 dark:border-orange-200/20 rounded-lg shadow-lg p-3">
                          <div className="text-xs font-semibold text-orange-950 dark:text-orange-100 mb-2">
                            {source.fileName} - Section {source.chunkIndex + 1}
                          </div>
                          <div className="text-xs text-orange-900 dark:text-orange-200 mb-2 max-h-32 overflow-y-auto">
                            {source.textPreview}
                          </div>
                          <div className="text-xs text-orange-700 dark:text-orange-300">
                            Relevance: {(source.score * 100).toFixed(1)}%
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Copy button at bottom right */}
          {isBot && (
            <Button
              variant="ghost"
              size="sm"
              className={`absolute bottom-2 right-2 h-6 px-2 transition-colors ${
                isCopied
                  ? 'text-emerald-700 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                  : 'text-orange-700 dark:text-orange-300 hover:text-orange-950 dark:hover:text-orange-100 hover:bg-orange-50 dark:hover:bg-orange-950/20'
              }`}
              onClick={() => {
                navigator.clipboard.writeText(message);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              }}
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
