import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { articleApi } from '../api/articleApi'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import './DashboardPage.css'

const CATEGORY_CSS = {
    TECH: 'tech', AI: 'ai', BACKEND: 'backend', FRONTEND: 'frontend',
    DEVOPS: 'devops', DATABASE: 'database', SECURITY: 'security',
    MOBILE: 'mobile', CLOUD: 'cloud', OTHER: 'other'
}

export default function DashboardPage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)
    const [confirmId, setConfirmId] = useState(null)
    const [filter, setFilter] = useState('ALL')

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await articleApi.getMyArticles()
                setArticles(data)
            } catch {
                toast.error('Failed to load your articles')
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    const handleDelete = async (id) => {
        setDeletingId(id)
        try {
            await articleApi.delete(id)
            setArticles(prev => prev.filter(a => a.id !== id))
            toast.success('Article deleted')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete')
        } finally {
            setDeletingId(null)
            setConfirmId(null)
        }
    }

    const filtered = filter === 'ALL'
        ? articles
        : articles.filter(a => a.status === filter)

    const stats = {
        total: articles.length,
        published: articles.filter(a => a.status === 'PUBLISHED').length,
        drafts: articles.filter(a => a.status === 'DRAFT').length,
    }

    return (
        <main className="page-wrapper">
            <div className="container">
                {/* Dashboard Header */}
                <header className="dashboard-header">
                    <div className="dashboard-welcome">
                        <div className="welcome-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
                        <div>
                            <h1 className="dashboard-title">My Dashboard</h1>
                            <p className="dashboard-sub">Welcome back, <strong>{user?.username}</strong></p>
                        </div>
                    </div>
                    <Link to="/new-article" className="btn btn-primary" id="dashboard-new-btn">
                        ✍️ New Article
                    </Link>
                </header>

                {/* Stats Cards */}
                <div className="stats-row">
                    <div className="stat-card">
                        <span className="stat-card-num gradient-text">{stats.total}</span>
                        <span className="stat-card-label">Total Articles</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-card-num" style={{ color: 'var(--success)' }}>{stats.published}</span>
                        <span className="stat-card-label">Published</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-card-num" style={{ color: 'var(--warning)' }}>{stats.drafts}</span>
                        <span className="stat-card-label">Drafts</span>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="dashboard-tabs">
                    {['ALL', 'PUBLISHED', 'DRAFT'].map(tab => (
                        <button
                            key={tab}
                            className={`dash-tab ${filter === tab ? 'active' : ''}`}
                            onClick={() => setFilter(tab)}
                            id={`tab-${tab.toLowerCase()}`}
                        >
                            {tab === 'ALL' ? `All (${stats.total})` :
                                tab === 'PUBLISHED' ? `Published (${stats.published})` :
                                    `Drafts (${stats.drafts})`}
                        </button>
                    ))}
                </div>

                {/* Articles List */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner spinner-lg" />
                        <p>Loading your articles...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">✍️</div>
                        <h3>{filter === 'ALL' ? 'No articles yet' : `No ${filter.toLowerCase()} articles`}</h3>
                        <p>Share your knowledge with the community</p>
                        <Link to="/new-article" className="btn btn-primary">Write Your First Article</Link>
                    </div>
                ) : (
                    <div className="dashboard-articles">
                        {filtered.map(article => {
                            const catClass = CATEGORY_CSS[article.category] || 'other'
                            const tagList = article.tags ? article.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 3) : []
                            return (
                                <div key={article.id} className="dash-article-card animate-fade-in">
                                    <div className="dash-card-main">
                                        <div className="dash-card-meta">
                                            <span className={`badge badge-${catClass}`}>{article.category}</span>
                                            <span className={`status-pill ${article.status === 'PUBLISHED' ? 'published' : 'draft'}`}>
                                                {article.status === 'PUBLISHED' ? '✅ Published' : '📝 Draft'}
                                            </span>
                                            <span className="dash-date">
                                                {article.createdAt
                                                    ? formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })
                                                    : ''}
                                            </span>
                                        </div>

                                        <h3 className="dash-article-title">
                                            <Link to={`/articles/${article.id}`}>{article.title}</Link>
                                        </h3>

                                        {article.summary && (
                                            <p className="dash-article-summary">{article.summary}</p>
                                        )}

                                        {tagList.length > 0 && (
                                            <div className="dash-tags">
                                                {tagList.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="dash-card-actions">
                                        <Link
                                            to={`/articles/${article.id}`}
                                            className="btn btn-ghost btn-sm"
                                            id={`view-${article.id}`}
                                        >
                                            👁 View
                                        </Link>
                                        <Link
                                            to={`/articles/${article.id}/edit`}
                                            className="btn btn-secondary btn-sm"
                                            id={`edit-${article.id}`}
                                        >
                                            ✏️ Edit
                                        </Link>
                                        {confirmId === article.id ? (
                                            <div className="confirm-row">
                                                <span className="confirm-text">Sure?</span>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(article.id)}
                                                    disabled={deletingId === article.id}
                                                    id={`confirm-delete-${article.id}`}
                                                >
                                                    {deletingId === article.id ? <span className="spinner" /> : 'Yes'}
                                                </button>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => setConfirmId(null)}
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => setConfirmId(article.id)}
                                                id={`delete-${article.id}`}
                                            >
                                                🗑️ Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}
