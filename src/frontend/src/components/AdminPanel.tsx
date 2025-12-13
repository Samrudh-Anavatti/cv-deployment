import { useState, useEffect } from 'react';
import { Upload, Trash2, Zap, Loader2, Lock } from 'lucide-react';

interface Document {
    name: string;
    size: number;
}

export function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [embeddingDoc, setEmbeddingDoc] = useState<string | null>(null);

    const backendUrl = 'https://zaralmpersonal-func-dev.azurewebsites.net';
    const adminPassword = 'admin123';

    useEffect(() => {
        if (isAuthenticated) {
            fetchDocuments();
        }
    }, [isAuthenticated]);

    const handleLogin = () => {
        if (password === adminPassword) {
            setIsAuthenticated(true);
            setPassword('');
        } else {
            alert('Incorrect password');
        }
    };

    const fetchDocuments = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/documents`);
            if (response.ok) {
                const docs = await response.json();
                setDocuments(docs);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${backendUrl}/api/documents/upload`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                await fetchDocuments();
                alert('Document uploaded successfully!');
            } else {
                alert('Failed to upload document');
            }
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Error uploading document');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const handleEmbed = async (fileName: string) => {
        setEmbeddingDoc(fileName);
        try {
            const response = await fetch(`${backendUrl}/api/embed`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName })
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Embedded successfully! Created ${data.chunks} chunks.`);
            } else {
                alert('Failed to embed document');
            }
        } catch (error) {
            console.error('Error embedding:', error);
            alert('Error embedding document');
        } finally {
            setEmbeddingDoc(null);
        }
    };

    const handleDelete = async (fileName: string) => {
        if (!confirm(`Delete ${fileName}?`)) return;

        try {
            const response = await fetch(`${backendUrl}/api/documents/${fileName}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchDocuments();
                alert('Document deleted successfully!');
            } else {
                alert('Failed to delete document');
            }
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Error deleting document');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login">
                <div className="login-box">
                    <Lock size={48} />
                    <h2>Admin Panel</h2>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        placeholder="Enter password"
                        className="password-input"
                    />
                    <button onClick={handleLogin} className="login-button">
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <h2>Document Management</h2>
            <p className="admin-subtitle">Upload documents to enhance SamBot's knowledge base</p>

            <div className="upload-section">
                <label className="upload-button">
                    <Upload size={20} />
                    <span>{isUploading ? 'Uploading...' : 'Upload Document'}</span>
                    <input
                        type="file"
                        onChange={handleUpload}
                        accept=".pdf,.txt,.doc,.docx"
                        disabled={isUploading}
                        style={{ display: 'none' }}
                    />
                </label>
            </div>

            <div className="documents-list">
                <h3>Documents ({documents.length})</h3>
                {documents.length === 0 ? (
                    <p className="no-documents">No documents uploaded yet</p>
                ) : (
                    <div className="document-items">
                        {documents.map((doc) => (
                            <div key={doc.name} className="document-item">
                                <div className="document-info">
                                    <span className="document-name">{doc.name}</span>
                                    <span className="document-size">
                                        {(doc.size / 1024).toFixed(2)} KB
                                    </span>
                                </div>
                                <div className="document-actions">
                                    <button
                                        onClick={() => handleEmbed(doc.name)}
                                        disabled={embeddingDoc === doc.name}
                                        className="embed-button"
                                    >
                                        {embeddingDoc === doc.name ? (
                                            <>
                                                <Loader2 className="spinner" size={16} />
                                                <span>Embedding...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Zap size={16} />
                                                <span>Embed</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doc.name)}
                                        className="delete-button"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
