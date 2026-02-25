import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { articleApi } from '../api/articleApi'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow, format } from 'date-fns'
import toast from 'react-hot-toast'
import './ArticleDetailPage.css'

const CATEGORY_CSS = {
    TECH: 'tech', AI: 'ai', BACKEND: 'backend', FRONTEND: 'frontend',
    DEVOPS: 'devops', DATABASE: 'database', SECURITY: 'security',
    MOBILE: 'mobile', CLOUD: 'cloud', OTHER: 'other'
}

export default function ArticleDetailPage() {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [article, setArticle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await articleApi.getById(id)
                setArticle(data)
            } catch {
                toast.error('Article not found')
                navigate('/')
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [id, navigate])

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await articleApi.delete(id)
            toast.success('Article deleted successfully')
            navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete article')
        } finally {
            setDeleting(false)
            setShowDeleteModal(false)
        }
    }

    if (loading) {
        return (
            <div className="page-wrapper">
                <div className="loading-container">
                    <div className="spinner spinner-lg" />
                    <p>Loading article...</p>
                </div>
            </div>
        )
    }

    if (!article) return null

    const isAuthor = user && user.id === article.author?.id
    const catClass = CATEGORY_CSS[article.category] || 'other'
    const tagList = article.tags ? article.tags.split(',').map(t => t.trim()).filter(Boolean) : []

    return (
        <main className="page-wrapper animate-fade">
            <div className="container">
                <div className="article-container">
                    {/* Back */}
                    <div className="back-nav">
                        <Link to="/" className="back-link">
                            <span>←</span> Back to feed
                        </Link>
                    </div>

                    <article className="article-main">
                        {/* Header */}
                        <header className="article-header">
                            <span className="article-category">{article.category}</span>
                            <h1 className="article-title">{article.title}</h1>

                            <div className="article-meta">
                                <div className="meta-left">
                                    <div className="author-large-avatar">
                                        {article.author?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="author-info">
                                        <h4>{article.author?.username}</h4>
                                        <span>{article.createdAt ? format(new Date(article.createdAt), 'MMMM d, yyyy') : '—'}</span>
                                    </div>
                                </div>
                                {isAuthor && (
                                    <div className="author-actions">
                                        <Link to={`/articles/${article.id}/edit`} className="btn btn-primary">Edit</Link>
                                        <button className="btn btn-secondary" onClick={() => setShowDeleteModal(true)}>Delete</button>
                                    </div>
                                )}
                            </div>

                            {article.summary && (
                                <div className="summary-box">
                                    <p className="summary-label">AI Summary</p>
                                    <p className="summary-text">{article.summary}</p>
                                </div>
                            )}
                        </header>

                        {/* Content */}
                        <div
                            className="article-content"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Tags */}
                        {tagList.length > 0 && (
                            <div className="tag-list">
                                {tagList.map(tag => (
                                    <span key={tag} className="tag-pill">#{tag}</span>
                                ))}
                            </div>
                        )}
                    </article>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)} role="dialog" aria-modal="true">
                    <div className="modal-box animate-slide-down" onClick={e => e.stopPropagation()}>
                        <div className="modal-icon">🗑️</div>
                        <h3 className="modal-title">Delete Article?</h3>
                        <p className="modal-desc">
                            This action cannot be undone. The article <strong>"{article.title}"</strong> will be permanently deleted.
                        </p>
                        <div className="modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowDeleteModal(false)}
                                id="cancel-delete-btn"
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDelete}
                                disabled={deleting}
                                id="confirm-delete-btn"
                            >
                                {deleting ? <><span className="spinner" /> Deleting...</> : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
