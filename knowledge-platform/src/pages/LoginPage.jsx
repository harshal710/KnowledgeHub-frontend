import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './AuthPages.css'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const validate = () => {
        const errs = {}
        if (!form.email) errs.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address'
        if (!form.password) errs.password = 'Password is required'
        return errs
    }

    const handleChange = (field, value) => {
        setForm(f => ({ ...f, [field]: value }))
        if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }

        setLoading(true)
        try {
            await login(form.email, form.password)
            toast.success(`Welcome back! 👋`)
            navigate('/')
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid email or password'
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-orb auth-orb-1" />
            <div className="auth-orb auth-orb-2" />

            <div className="auth-card animate-fade-in">
                {/* Logo */}
                <div className="auth-logo">
                    <span>⚡</span>
                    <span>KnowledgeHub</span>
                </div>

                <div className="auth-header">
                    <h1 className="auth-title">Welcome back</h1>
                    <p className="auth-subtitle">Sign in to continue sharing knowledge</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    {/* Email */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="login-email">Email address</label>
                        <input
                            id="login-email"
                            type="email"
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={e => handleChange('email', e.target.value)}
                            autoComplete="email"
                            autoFocus
                        />
                        {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="login-password">Password</label>
                        <div className="input-with-toggle">
                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={e => handleChange('password', e.target.value)}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? '🙈' : '👁'}
                            </button>
                        </div>
                        {errors.password && <span className="form-error">{errors.password}</span>}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg auth-submit-btn"
                        disabled={loading}
                        id="login-submit-btn"
                    >
                        {loading ? <><span className="spinner" /> Signing in...</> : 'Sign In →'}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{' '}
                    <Link to="/signup" id="go-to-signup">Create one free</Link>
                </p>

                {/* Demo hint */}
                <div className="demo-hint">
                    <p>🔒 JWT authentication · Secure & stateless</p>
                </div>
            </div>
        </main>
    )
}
