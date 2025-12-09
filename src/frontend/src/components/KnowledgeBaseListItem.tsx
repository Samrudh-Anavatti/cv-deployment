import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FileText, Database, MoreVertical, Edit, Trash2 } from "lucide-react";

interface KnowledgeBaseListItemProps {
  title: string;
  description?: string;
  date: string;
  documentCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

export function KnowledgeBaseListItem({
  title,
  description,
  date,
  documentCount,
  onEdit,
  onDelete,
  onClick,
}: KnowledgeBaseListItemProps) {
  return (
    <div className="group bg-white dark:bg-gray-800 border border-orange-950/10 dark:border-orange-200/10 rounded-lg p-4 hover:border-orange-600/30 dark:hover:border-orange-400/30 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          onClick={onClick}
          className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-700/30 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50 transition-colors shrink-0 cursor-pointer"
        >
          <Database className="w-5 h-5 text-orange-700 dark:text-orange-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
          <h3 className="text-orange-950 dark:text-orange-100 mb-1 truncate">
            {title}
          </h3>
          {description ? (
            <p className="text-sm text-orange-800/70 dark:text-orange-200/70 line-clamp-1">
              {description}
            </p>
          ) : (
            <p className="text-sm text-orange-800/40 dark:text-orange-300/40 italic">
              No description
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-6 shrink-0 text-sm text-orange-800/60 dark:text-orange-300/60">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>{documentCount} {documentCount === 1 ? "doc" : "docs"}</span>
          </div>
          <span className="text-xs min-w-[80px] text-right">{date}</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-orange-700 dark:text-orange-300 hover:text-orange-950 dark:hover:text-orange-100 hover:bg-orange-50 dark:hover:bg-orange-950/20"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 dark:bg-gray-800 dark:border-orange-200/10">
              <DropdownMenuItem
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="text-orange-950 dark:text-orange-100 focus:bg-orange-50 dark:focus:bg-orange-950/20 cursor-pointer"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20 focus:text-red-700 dark:focus:text-red-300 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
