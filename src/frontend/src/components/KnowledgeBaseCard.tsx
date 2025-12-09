import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FileText, Database, MoreVertical, Edit, Trash2 } from "lucide-react";

interface KnowledgeBaseCardProps {
  title: string;
  description?: string;
  date: string;
  documentCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

export function KnowledgeBaseCard({
  title,
  description,
  date,
  documentCount,
  onEdit,
  onDelete,
  onClick
}: KnowledgeBaseCardProps) {
  return (
    <Card className="group relative overflow-hidden border-orange-950/10 dark:border-orange-200/10 bg-white dark:bg-gray-800 hover:border-orange-600/30 dark:hover:border-orange-400/30 transition-all duration-300 hover:shadow-md">
      <div className="p-6 flex flex-col h-full cursor-pointer" onClick={onClick}>
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-700/30 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50 transition-colors">
            <Database className="w-6 h-6 text-orange-700 dark:text-orange-400" />
          </div>

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

        <div className="flex-1 mb-6">
          <h3 className="text-orange-950 dark:text-orange-100 mb-2 line-clamp-2">{title}</h3>
          {description ? (
            <p className="text-sm text-orange-800/70 dark:text-orange-200/70 line-clamp-2">{description}</p>
          ) : (
            <p className="text-sm text-orange-800/40 dark:text-orange-300/40 italic">No description</p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-orange-800/60 dark:text-orange-300/60 pt-4 border-t border-orange-950/5 dark:border-orange-200/10">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>{documentCount} {documentCount === 1 ? 'doc' : 'docs'}</span>
          </div>
          <span className="text-xs">{date}</span>
        </div>
      </div>
    </Card>
  );
}
