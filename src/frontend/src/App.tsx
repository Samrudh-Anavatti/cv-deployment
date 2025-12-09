import { useState, useEffect } from "react";
import { DarkModeProvider } from "./components/DarkModeContext";
import { Header } from "./components/Header";
import { KnowledgeBaseCard } from "./components/KnowledgeBaseCard";
import { KnowledgeBaseListItem } from "./components/KnowledgeBaseListItem";
import { ChatPage } from "./components/ChatPage";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Plus, Search, Grid, List, SortAsc } from "lucide-react";

interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  documents: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "chat">("home");
  const [selectedKB, setSelectedKB] = useState<{ id: string; name: string } | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedKBForEdit, setSelectedKBForEdit] = useState<string | null>(null);
  const [newKBName, setNewKBName] = useState("");
  const [newKBDescription, setNewKBDescription] = useState("");
  const [editKBName, setEditKBName] = useState("");
  const [editKBDescription, setEditKBDescription] = useState("");

  // Azure Function URLs
  const AZURE_DOCPROC_URL = import.meta.env.REACT_APP_AZURE_DOCPROC_URL || 'http://localhost:7072';

  // Helper function to parse DD/MM/YYYY date format
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    fetchKnowledgeBases();
  }, []);

  const fetchKnowledgeBases = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${AZURE_DOCPROC_URL}/api/knowledge-bases`);
      if (response.ok) {
        const kbData = await response.json();
        const transformedKBs: KnowledgeBase[] = kbData.map((kb: any) => ({
          id: kb.id,
          name: kb.name,
          description: kb.description || '',
          createdAt: new Date(kb.createdAt).toLocaleDateString('en-GB'),
          documents: kb.documents || 0,
        }));
        setKnowledgeBases(transformedKBs);
      } else {
        setKnowledgeBases([]);
      }
    } catch (error) {
      console.error('Failed to fetch knowledge bases:', error);
      setKnowledgeBases([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKB = async () => {
    try {
      const response = await fetch(`${AZURE_DOCPROC_URL}/api/knowledge-bases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKBName, description: newKBDescription })
      });

      if (response.ok) {
        const newKB = await response.json();
        const transformedKB: KnowledgeBase = {
          id: newKB.id,
          name: newKB.name,
          description: newKB.description || '',
          createdAt: new Date(newKB.createdAt).toLocaleDateString('en-GB'),
          documents: newKB.documents || 0,
        };
        setKnowledgeBases(prev => [transformedKB, ...prev]);
        setIsCreateDialogOpen(false);
        setNewKBName("");
        setNewKBDescription("");
      } else {
        const errorData = await response.json();
        alert(`Failed to create knowledge base: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Failed to create knowledge base:', error);
      alert('Failed to create knowledge base. Please try again.');
    }
  };

  const handleEditKB = (kbId: string) => {
    const kb = knowledgeBases.find(k => k.id === kbId);
    if (kb) {
      setSelectedKBForEdit(kbId);
      setEditKBName(kb.name);
      setEditKBDescription(kb.description || "");
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedKBForEdit) return;

    try {
      const response = await fetch(`${AZURE_DOCPROC_URL}/api/knowledge-bases/${selectedKBForEdit}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editKBName, description: editKBDescription })
      });

      if (response.ok) {
        const updatedKB = await response.json();
        setKnowledgeBases(prev =>
          prev.map(kb => kb.id === selectedKBForEdit ? {
            ...kb,
            name: updatedKB.name,
            description: updatedKB.description || '',
          } : kb)
        );
        setIsEditDialogOpen(false);
        setSelectedKBForEdit(null);
        setEditKBName("");
        setEditKBDescription("");
      } else {
        const errorData = await response.json();
        alert(`Failed to update knowledge base: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Failed to update knowledge base:', error);
      alert('Failed to update knowledge base. Please try again.');
    }
  };

  const handleDeleteKB = (kbId: string) => {
    setSelectedKBForEdit(kbId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedKBForEdit) return;

    try {
      const response = await fetch(`${AZURE_DOCPROC_URL}/api/knowledge-bases/${selectedKBForEdit}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setKnowledgeBases(prev => prev.filter(kb => kb.id !== selectedKBForEdit));
        setIsDeleteDialogOpen(false);
        setSelectedKBForEdit(null);
      } else {
        const errorData = await response.json();
        alert(`Failed to delete knowledge base: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Failed to delete knowledge base:', error);
      alert('Failed to delete knowledge base. Please try again.');
    }
  };

  const handleOpenChat = (kbId: string, kbName: string) => {
    setSelectedKB({ id: kbId, name: kbName });
    setCurrentPage("chat");
  };

  // Filter and sort knowledge bases
  const filteredAndSortedKBs = knowledgeBases
    .filter((kb) =>
      kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kb.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return parseDate(a.createdAt).getTime() - parseDate(b.createdAt).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        case "documents":
          return b.documents - a.documents;
        case "recent":
        default:
          return parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime();
      }
    });

  if (currentPage === "chat" && selectedKB) {
    return (
      <DarkModeProvider>
        <ChatPage
          onBack={() => setCurrentPage("home")}
          knowledgeBaseName={selectedKB.name}
          knowledgeBaseId={selectedKB.id}
        />
      </DarkModeProvider>
    );
  }

  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-amber-50/30 to-yellow-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Header />

        <main className="container mx-auto px-6 py-12">
          {/* Welcome Section */}
          <div className="mb-12 max-w-4xl">
            <h1 className="text-4xl text-orange-950 dark:text-orange-100 mb-3">
              Your knowledge bases
            </h1>
            <p className="text-lg text-orange-900/70 dark:text-orange-200/70">
              ZaraLM transforms your documents into a smart knowledge base — ask questions and get accurate, sourced answers powered by Zara AI
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 flex gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-700/50 dark:text-orange-300/50" />
                <Input
                  placeholder="Search knowledge bases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800 border-orange-950/10 dark:border-orange-200/10 text-orange-950 dark:text-orange-100 placeholder:text-orange-700/40 dark:placeholder:text-orange-300/40 focus-visible:ring-orange-700/20 dark:focus-visible:ring-orange-300/20 focus-visible:border-orange-700/30 dark:focus-visible:border-orange-300/30"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-orange-950/10 dark:border-orange-200/10 text-orange-950 dark:text-orange-100">
                  <SortAsc className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-orange-200/10">
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="documents">Most Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <div className="flex bg-white dark:bg-gray-800 border border-orange-950/10 dark:border-orange-200/10 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${viewMode === "grid" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-950 dark:text-orange-100" : "text-orange-700 dark:text-orange-300 hover:text-orange-950 dark:hover:text-orange-100 hover:bg-orange-50 dark:hover:bg-orange-950/20"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${viewMode === "list" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-950 dark:text-orange-100" : "text-orange-700 dark:text-orange-300 hover:text-orange-950 dark:hover:text-orange-100 hover:bg-orange-50 dark:hover:bg-orange-950/20"}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button
                className="bg-orange-700 hover:bg-orange-800 dark:bg-orange-600 dark:hover:bg-orange-700 text-white shadow-sm"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </div>
          </div>

          {/* Knowledge Bases Grid/List */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-white dark:bg-gray-800 border border-orange-950/10 dark:border-orange-200/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-orange-700 dark:border-orange-300 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-orange-900 dark:text-orange-200">Loading knowledge bases...</p>
            </div>
          ) : filteredAndSortedKBs.length > 0 ? (
            <div className={viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              : "flex flex-col gap-2 max-w-5xl"
            }>
              {filteredAndSortedKBs.map((kb) => (
                <div key={kb.id}>
                  {viewMode === "grid" ? (
                    <KnowledgeBaseCard
                      title={kb.name}
                      description={kb.description}
                      date={kb.createdAt}
                      documentCount={kb.documents}
                      onClick={() => handleOpenChat(kb.id, kb.name)}
                      onEdit={() => handleEditKB(kb.id)}
                      onDelete={() => handleDeleteKB(kb.id)}
                    />
                  ) : (
                    <KnowledgeBaseListItem
                      title={kb.name}
                      description={kb.description}
                      date={kb.createdAt}
                      documentCount={kb.documents}
                      onClick={() => handleOpenChat(kb.id, kb.name)}
                      onEdit={() => handleEditKB(kb.id)}
                      onDelete={() => handleDeleteKB(kb.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-white dark:bg-gray-800 border border-orange-950/10 dark:border-orange-200/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-orange-700/30 dark:text-orange-300/30" />
              </div>
              <h3 className="text-orange-900 dark:text-orange-200 mb-2">No knowledge bases found</h3>
              <p className="text-sm text-orange-800/60 dark:text-orange-300/60">
                {searchQuery ? "Try adjusting your search query" : "Create your first knowledge base to get started"}
              </p>
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-16 pt-8 border-t border-orange-950/10 dark:border-orange-200/10">
            <p className="text-sm text-orange-800/60 dark:text-orange-300/60 text-center">
              Showing {filteredAndSortedKBs.length} of {knowledgeBases.length} knowledge bases
            </p>
          </div>
        </main>

        {/* Create Knowledge Base Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border-orange-950/10 dark:border-orange-200/10">
            <DialogHeader>
              <DialogTitle className="text-orange-950 dark:text-orange-100">New Knowledge Base</DialogTitle>
              <DialogDescription className="sr-only">
                Create a new knowledge base by entering a name and description
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="kb-name" className="text-orange-950 dark:text-orange-100">Name</Label>
                <Input
                  id="kb-name"
                  placeholder="Please enter name"
                  value={newKBName}
                  onChange={(e) => setNewKBName(e.target.value)}
                  className="bg-white dark:bg-gray-900 border-orange-950/10 dark:border-orange-200/10 text-orange-950 dark:text-orange-100 placeholder:text-orange-700/40 dark:placeholder:text-orange-300/40 focus-visible:ring-orange-700/20 dark:focus-visible:ring-orange-300/20 focus-visible:border-orange-700/30 dark:focus-visible:border-orange-300/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kb-description" className="text-orange-950 dark:text-orange-100">Description</Label>
                <Textarea
                  id="kb-description"
                  placeholder="Please enter remark/description"
                  value={newKBDescription}
                  onChange={(e) => setNewKBDescription(e.target.value)}
                  className="bg-white dark:bg-gray-900 border-orange-950/10 dark:border-orange-200/10 text-orange-950 dark:text-orange-100 placeholder:text-orange-700/40 dark:placeholder:text-orange-300/40 focus-visible:ring-orange-700/20 dark:focus-visible:ring-orange-300/20 focus-visible:border-orange-700/30 dark:focus-visible:border-orange-300/30 min-h-[100px] resize-none"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="border-orange-950/10 dark:border-orange-200/10 text-orange-900 dark:text-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-950 dark:hover:text-orange-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateKB}
                disabled={!newKBName.trim()}
                className="bg-orange-700 hover:bg-orange-800 dark:bg-orange-600 dark:hover:bg-orange-700 text-white"
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Knowledge Base Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border-orange-950/10 dark:border-orange-200/10">
            <DialogHeader>
              <DialogTitle className="text-orange-950 dark:text-orange-100">Edit Knowledge Base</DialogTitle>
              <DialogDescription className="sr-only">
                Edit the knowledge base name and description
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-kb-name" className="text-orange-950 dark:text-orange-100">Name</Label>
                <Input
                  id="edit-kb-name"
                  placeholder="Please enter name"
                  value={editKBName}
                  onChange={(e) => setEditKBName(e.target.value)}
                  className="bg-white dark:bg-gray-900 border-orange-950/10 dark:border-orange-200/10 text-orange-950 dark:text-orange-100 placeholder:text-orange-700/40 dark:placeholder:text-orange-300/40 focus-visible:ring-orange-700/20 dark:focus-visible:ring-orange-300/20 focus-visible:border-orange-700/30 dark:focus-visible:border-orange-300/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-kb-description" className="text-orange-950 dark:text-orange-100">Description</Label>
                <Textarea
                  id="edit-kb-description"
                  placeholder="Please enter remark/description"
                  value={editKBDescription}
                  onChange={(e) => setEditKBDescription(e.target.value)}
                  className="bg-white dark:bg-gray-900 border-orange-950/10 dark:border-orange-200/10 text-orange-950 dark:text-orange-100 placeholder:text-orange-700/40 dark:placeholder:text-orange-300/40 focus-visible:ring-orange-700/20 dark:focus-visible:ring-orange-300/20 focus-visible:border-orange-700/30 dark:focus-visible:border-orange-300/30 min-h-[100px] resize-none"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-orange-950/10 dark:border-orange-200/10 text-orange-900 dark:text-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-950 dark:hover:text-orange-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={!editKBName.trim()}
                className="bg-orange-700 hover:bg-orange-800 dark:bg-orange-600 dark:hover:bg-orange-700 text-white"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px] bg-white dark:bg-gray-800 border-orange-950/10 dark:border-orange-200/10">
            <DialogHeader>
              <DialogTitle className="text-orange-950 dark:text-orange-100">Delete Knowledge Base</DialogTitle>
              <DialogDescription className="text-orange-800/70 dark:text-orange-200/70">
                Are you sure you want to delete this knowledge base? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="border-orange-950/10 dark:border-orange-200/10 text-orange-900 dark:text-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-950 dark:hover:text-orange-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DarkModeProvider>
  );
}
