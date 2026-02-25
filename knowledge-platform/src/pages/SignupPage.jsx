import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './AuthPages.css'

export default function SignupPage() {
    const { signup } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const validate = () => {
        const errs = {}
        if (!form.username.trim()) errs.username = 'Username is required'
        else if (form.username.length < 3) errs.username = 'Username must be at least 3 characters'
        else if (form.username.length > 50) errs.username = 'Username too long (max 50)'

        if (!form.email) errs.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address'

        if (!form.password) errs.password = 'Password is required'
        else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'

        if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'

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
            await signup(form.username, form.email, form.password)
            toast.success(`Account created! Welcome to KnowledgeHub 🎉`)
            navigate('/')
        } catch (err) {
            const msg = err.response?.data?.message || 'Signup failed. Please try again.'
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const getPasswordStrength = (pass) => {
        if (!pass) return null
        if (pass.length < 6) return { label: 'Too short', color: '#ef4444', width: 25 }
        if (pass.length < 8) return { label: 'Weak', color: '#f59e0b', width: 45 }
        if (pass.length < 12 || !/\d/.test(pass)) return { label: 'Fair', color: '#06b6d4', width: 65 }
        return { label: 'Strong', color: '#10b981', width: 100 }
    }

    const strength = getPasswordStrength(form.password)

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
                    <h1 className="auth-title">Create account</h1>
                    <p className="auth-subtitle">Join the knowledge sharing community</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    {/* Username */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="signup-username">Username</label>
                        <input
                            id="signup-username"
                            type="text"
                            className={`form-input ${errors.username ? 'error' : ''}`}
                            placeholder="your_username"
                            value={form.username}
                            onChange={e => handleChange('username', e.target.value)}
                            autoComplete="username"
                            autoFocus
                        />
                        {errors.username && <span className="form-error">{errors.username}</span>}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="signup-email">Email address</label>
                        <input
                            id="signup-email"
                            type="email"
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={e => handleChange('email', e.target.value)}
                            autoComplete="email"
                        />
                        {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="signup-password">Password</label>
                        <div className="input-with-toggle">
                            <input
                                id="signup-password"
                                type={showPassword ? 'text' : 'password'}
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                placeholder="Min. 6 characters"
                                value={form.password}
                                onChange={e => handleChange('password', e.target.value)}
                                autoComplete="new-password"
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
                        {/* Password strength bar */}
                        {strength && (
                            <div className="password-strength">
                                <div className="strength-bar">
                                    <div
                                        className="strength-fill"
                                        style={{ width: `${strength.width}%`, background: strength.color }}
                                    />
                                </div>
                                <span className="strength-label" style={{ color: strength.color }}>
                                    {strength.label}
                                </span>
                            </div>
                        )}
                        {errors.password && <span className="form-error">{errors.password}</span>}
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="signup-confirm-password">Confirm Password</label>
                        <input
                            id="signup-confirm-password"
                            type={showPassword ? 'text' : 'password'}
                            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                            placeholder="Repeat your password"
                            value={form.confirmPassword}
                            onChange={e => handleChange('confirmPassword', e.target.value)}
                            autoComplete="new-password"
                        />
                        {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg auth-submit-btn"
                        disabled={loading}
                        id="signup-submit-btn"
                    >
                        {loading ? <><span className="spinner" /> Creating account...</> : 'Create Account →'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{' '}
                    <Link to="/login" id="go-to-login">Sign in</Link>
                </p>

                <div className="demo-hint">
                    <p>🔒 Your data is secured with BCrypt & JWT</p>
                </div>
            </div>
        </main>
    )
}
