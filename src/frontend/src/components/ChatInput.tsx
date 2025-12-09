import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="min-h-[52px] max-h-[120px] resize-none bg-white dark:bg-gray-800 border-orange-950/10 dark:border-orange-200/10 text-orange-950 dark:text-orange-100 placeholder:text-orange-700/40 dark:placeholder:text-orange-300/40 focus-visible:ring-orange-700/20 dark:focus-visible:ring-orange-300/20 focus-visible:border-orange-700/30 dark:focus-visible:border-orange-300/30"
        disabled={disabled}
      />
      <Button
        type="submit"
        size="icon"
        className="shrink-0 h-[52px] w-[52px] bg-orange-700 hover:bg-orange-800 dark:bg-orange-600 dark:hover:bg-orange-700 text-white"
        disabled={!input.trim() || disabled}
      >
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
}
