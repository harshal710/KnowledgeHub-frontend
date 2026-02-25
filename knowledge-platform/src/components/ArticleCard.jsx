import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import './ArticleCard.css'

const CATEGORY_CSS = {
    TECH: 'tech', AI: 'ai', BACKEND: 'backend', FRONTEND: 'frontend',
    DEVOPS: 'devops', DATABASE: 'database', SECURITY: 'security',
    MOBILE: 'mobile', CLOUD: 'cloud', OTHER: 'other'
}

export default function ArticleCard({ article }) {
    const catClass = CATEGORY_CSS[article.category] || 'other'

    // Format tags
    const tagList = article.tags
        ? article.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 3)
        : []

    return (
        <div className="article-card card-glass animate-slide-up">
            <div className="card-meta">
                <span className={`badge badge-${catClass}`}>{article.category}</span>
                {article.summary && (
                    <span className="ai-badge">✨ AI Summary</span>
                )}
            </div>

            <Link to={`/articles/${article.id}`}>
                <h3 className="card-title">{article.title}</h3>
            </Link>

            {tagList.length > 0 && (
                <div className="tag-list">
                    {tagList.map(tag => (
                        <span key={tag} className="tag-pill">#{tag}</span>
                    ))}
                </div>
            )}

            <p className="card-summary">
                {article.summary || "No summary provided for this article..."}
            </p>

            <div className="card-footer">
                <div className="author-info">
                    <div className="author-avatar-sm">
                        {article.author?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="author-name-sm">{article.author?.username}</span>
                </div>
                <span className="card-date">
                    {article.createdAt
                        ? formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })
                        : 'Recently'}
                </span>
            </div>
        </div>
    )
}