import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { articleApi } from '../api/articleApi'
import ArticleCard from '../components/ArticleCard'
import './HomePage.css'

const CATEGORIES = ['ALL', 'TECH', 'AI', 'BACKEND', 'FRONTEND', 'DEVOPS', 'DATABASE', 'SECURITY', 'MOBILE', 'CLOUD', 'OTHER']

export default function HomePage() {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [category, setCategory] = useState('ALL')
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)

    const fetchArticles = useCallback(async () => {
        setLoading(true)
        try {
            const data = await articleApi.getAll({ page, size: 9, category, search })
            setArticles(data.articles || [])
            setTotalPages(data.totalPages || 0)
            setTotalElements(data.totalElements || 0)
        } catch (err) {
            console.error('Failed to fetch articles', err)
            setArticles([])
        } finally {
            setLoading(false)
        }
    }, [page, category, search])

    useEffect(() => { fetchArticles() }, [fetchArticles])

    const handleSearch = (e) => {
        e.preventDefault()
        setSearch(searchInput)
        setPage(0)
    }

    const handleCategoryChange = (cat) => {
        setCategory(cat)
        setPage(0)
    }

    const clearFilters = () => {
        setSearch('')
        setSearchInput('')
        setCategory('ALL')
        setPage(0)
    }

    return (
        <main className="page-wrapper">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span className="ai-badge">✨ AI-Powered Platform</span>
                        </div>
                        <h1 className="hero-title">
                            Welcome to,<br />
                            <span className="gradient-text">Hub of Articles</span>
                        </h1>
                        <p className="hero-desc">
                            Discover technical articles on AI, Backend, Frontend, DevOps and more.
                            Write better with our built-in AI writing assistant.
                        </p>
                        <div className="hero-actions">
                            <Link to="/new-article" className="btn btn-primary btn-lg" id="hero-write-btn">
                                ✍️ Start Writing
                            </Link>
                            <a href="#articles" className="btn btn-secondary btn-lg">
                                Explore Articles
                            </a>
                        </div>
                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-num">{totalElements}</span>
                                <span className="stat-label">Articles</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat">
                                <span className="stat-num">AI</span>
                                <span className="stat-label">Assisted</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat">
                                <span className="stat-num">10+</span>
                                <span className="stat-label">Categories</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative orbs */}
                <div className="hero-orb hero-orb-1" />
                <div className="hero-orb hero-orb-2" />
            </section>

            {/* Articles Section */}
            <section className="articles-section" id="articles">
                <div className="container">
                    {/* Search & Filter */}
                    <div className="search-filter-bar">
                        <form className="search-form" onSubmit={handleSearch} role="search">
                            <div className="search-input-wrap">
                                <span className="search-icon">🔍</span>
                                <input
                                    type="search"
                                    id="search-input"
                                    className="form-input search-input"
                                    placeholder="Search by title, content, or tags..."
                                    value={searchInput}
                                    onChange={e => setSearchInput(e.target.value)}
                                    aria-label="Search articles"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" id="search-btn">Search</button>
                        </form>

                        {(search || category !== 'ALL') && (
                            <button className="btn btn-ghost btn-sm" onClick={clearFilters} id="clear-filters-btn">
                                Clear Filters ✕
                            </button>
                        )}
                    </div>

                    {/* Category Pills */}
                    <div className="category-pills" role="group" aria-label="Filter by category">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                className={`cat-pill ${category === cat ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat)}
                                id={`cat-${cat.toLowerCase()}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Results Header */}
                    <div className="results-header">
                        <h2 className="results-title">
                            {search ? `Results for "${search}"` : category !== 'ALL' ? `${category} Articles` : 'Latest Articles'}
                        </h2>
                        {!loading && (
                            <span className="results-count">{totalElements} article{totalElements !== 1 ? 's' : ''}</span>
                        )}
                    </div>

                    {/* Articles Grid */}
                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner spinner-lg" />
                            <p>Loading articles...</p>
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <h3>No articles found</h3>
                            <p>{search || category !== 'ALL' ? 'Try adjusting your search or filter' : 'Be the first to share knowledge!'}</p>
                            {(search || category !== 'ALL') && (
                                <button className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>
                            )}
                            <Link to="/new-article" className="btn btn-primary">Write First Article</Link>
                        </div>
                    ) : (
                        <div className="articles-grid">
                            {articles.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="page-btn"
                                onClick={() => setPage(p => p - 1)}
                                disabled={page === 0}
                                aria-label="Previous page"
                            >
                                ← Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={`page-btn ${i === page ? 'active' : ''}`}
                                    onClick={() => setPage(i)}
                                    aria-label={`Page ${i + 1}`}
                                    aria-current={i === page ? 'page' : undefined}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className="page-btn"
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= totalPages - 1}
                                aria-label="Next page"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}
