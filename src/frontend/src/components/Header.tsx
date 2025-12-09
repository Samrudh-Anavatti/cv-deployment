import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "./DarkModeContext";

interface HeaderProps {
  onLogoClick?: () => void;
}

export function Header({ onLogoClick }: HeaderProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-orange-950/10 dark:border-orange-200/10 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          className={`flex items-center ${onLogoClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
          onClick={onLogoClick}
        >
          <img src="/phoenix-logo.png" alt="ZaraLM Logo" className="w-16 h-16 object-contain -mr-5" />
          <span className="text-xl text-orange-950 dark:text-orange-100">ZaraLM</span>
        </div>

        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="text-orange-700 dark:text-orange-300 hover:text-orange-950 dark:hover:text-orange-100 hover:bg-orange-50 dark:hover:bg-orange-950/20"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
}
