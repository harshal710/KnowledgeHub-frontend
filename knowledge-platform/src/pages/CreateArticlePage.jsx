import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { articleApi } from '../api/articleApi'
import { aiApi } from '../api/aiApi'
import { useAuth } from '../context/AuthContext'
import RichTextEditor from '../components/RichTextEditor'
import AiAssistPanel from '../components/AiAssistPanel'
import toast from 'react-hot-toast'
import './ArticleFormPage.css'

const CATEGORIES = ['TECH', 'AI', 'BACKEND', 'FRONTEND', 'DEVOPS', 'DATABASE', 'SECURITY', 'MOBILE', 'CLOUD', 'OTHER']

export default function CreateArticlePage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [submitting, setSubmitting] = useState(false)

    const [form, setForm] = useState({
        title: '',
        content: '',
        summary: '',
        category: 'TECH',
        tags: '',
        status: 'PUBLISHED',
    })

    const [errors, setErrors] = useState({})

    const validate = () => {
        const errs = {}
        if (!form.title.trim()) errs.title = 'Title is required'
        if (!form.content || form.content.replace(/<[^>]*>/g, '').trim().length < 10)
            errs.content = 'Content must be at least 10 characters'
        return errs
    }

    const handleChange = (field, value) => {
        setForm(f => ({ ...f, [field]: value }))
        if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) {
            setErrors(errs)
            toast.error('Please fix the errors before submitting')
            return
        }

        setSubmitting(true)
        try {
            let finalForm = { ...form }

            // Auto-generate summary if empty
            if (!finalForm.summary.trim()) {
                const toastId = toast.loading('Generating AI summary...')
                try {
                    const aiData = await aiApi.generateSummary(form.content, form.title)
                    finalForm.summary = aiData.summary
                    toast.success('AI summary generated!', { id: toastId })
                } catch (err) {
                    toast.error('AI summary failed, but continuing...', { id: toastId })
                }
            }

            const article = await articleApi.create(finalForm)
            toast.success('🎉 Article published successfully!')
            navigate(`/articles/${article.id}`)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create article')
        } finally {
            setSubmitting(false)
        }
    }

    // AI handlers
    const handleAiContent = (improved) => handleChange('content', improved)
    const handleAiTitle = (title) => handleChange('title', title)
    const handleAiSummary = (summary) => handleChange('summary', summary)
    const handleAiTag = (tag) => {
        const current = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
        if (!current.includes(tag)) {
            handleChange('tags', [...current, tag].join(', '))
        }
    }

    return (
        <main className="page-wrapper">
            <div className="container">
                <div className="form-page-header">
                    <div>
                        <h1 className="form-page-title">Create New Article</h1>
                        <p className="form-page-subtitle">Share your knowledge with the community</p>
                    </div>
                    <Link to="/" className="btn btn-ghost btn-sm">Cancel</Link>
                </div>

                <div className="article-form-layout">
                    {/* Main Form */}
                    <form onSubmit={handleSubmit} className="article-form" noValidate>
                        {/* Title */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="article-title">
                                Title <span className="required">*</span>
                            </label>
                            <input
                                id="article-title"
                                type="text"
                                className={`form-input ${errors.title ? 'error' : ''}`}
                                placeholder="Give your article a compelling title..."
                                value={form.title}
                                onChange={e => handleChange('title', e.target.value)}
                                maxLength={200}
                            />
                            {errors.title && <span className="form-error">{errors.title}</span>}
                        </div>

                        {/* Category & Status */}
                        <div className="form-row-2">
                            <div className="form-group">
                                <label className="form-label" htmlFor="article-category">Category</label>
                                <select
                                    id="article-category"
                                    className="form-select"
                                    value={form.category}
                                    onChange={e => handleChange('category', e.target.value)}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="article-status">Status</label>
                                <select
                                    id="article-status"
                                    className="form-select"
                                    value={form.status}
                                    onChange={e => handleChange('status', e.target.value)}
                                >
                                    <option value="PUBLISHED">Published</option>
                                    <option value="DRAFT">Draft</option>
                                </select>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="article-tags">
                                Tags <span className="optional">(comma-separated)</span>
                            </label>
                            <input
                                id="article-tags"
                                type="text"
                                className="form-input"
                                placeholder="e.g. react, javascript, tutorial"
                                value={form.tags}
                                onChange={e => handleChange('tags', e.target.value)}
                            />
                        </div>

                        {/* Summary */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="article-summary">
                                Summary <span className="optional">(auto-generated by AI if left blank)</span>
                            </label>
                            <textarea
                                id="article-summary"
                                className="form-input"
                                rows={3}
                                placeholder="Brief summary shown on article cards..."
                                value={form.summary}
                                onChange={e => handleChange('summary', e.target.value)}
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        {/* Content Editor */}
                        <div className="form-group">
                            <label className="form-label">
                                Content <span className="required">*</span>
                            </label>
                            <RichTextEditor
                                value={form.content}
                                onChange={val => handleChange('content', val)}
                                placeholder="Start writing your article... Use the AI assistant to help improve your writing!"
                            />
                            {errors.content && <span className="form-error">{errors.content}</span>}
                        </div>

                        {/* Submit */}
                        <div className="form-actions">
                            <Link to="/" className="btn btn-secondary">Cancel</Link>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={submitting}
                                id="submit-article-btn"
                            >
                                {submitting
                                    ? <><span className="spinner" /> Publishing...</>
                                    : form.status === 'DRAFT' ? '💾 Save Draft' : '🚀 Publish Article'
                                }
                            </button>
                        </div>
                    </form>

                    {/* AI Sidebar */}
                    <aside className="ai-sidebar">
                        <div className="ai-sidebar-sticky">
                            <AiAssistPanel
                                content={form.content}
                                title={form.title}
                                category={form.category}
                                onApplyContent={handleAiContent}
                                onApplyTitle={handleAiTitle}
                                onApplySummary={handleAiSummary}
                                onApplyTags={handleAiTag}
                            />

                            <div className="tips-card card-glass">
                                <h4 className="tips-title">✍️ Writing Tips</h4>
                                <ul className="tips-list">
                                    <li>Use AI to improve clarity and grammar</li>
                                    <li>Add a summary for better discoverability</li>
                                    <li>Use descriptive tags to reach more readers</li>
                                    <li>Structure with headings for readability</li>
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}
