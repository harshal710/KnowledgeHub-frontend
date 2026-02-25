import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
    const { user, logout } = useAuth()
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [location])

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <Link to="/" className="nav-brand">
                    <span className="brand-icon">⚡</span>
                    <span>KnowledgeHub</span>
                </Link>

                {/* Desktop Links */}
                <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                        Explore
                    </Link>
                    <Link to="/new-article" className={`nav-link ${location.pathname === '/new-article' ? 'active' : ''}`}>
                        Write
                    </Link>
                    {user && (
                        <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                            Dashboard
                        </Link>
                    )}
                </div>

                <div className="nav-actions">
                    {user ? (
                        <div className="user-profile">
                            <div className="user-avatar">{user.username?.charAt(0).toUpperCase()}</div>
                            <span className="username">{user.username}</span>
                            <button onClick={logout} className="btn btn-ghost btn-sm">Logout</button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                            <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
                        </>
                    )}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>
        </nav>
    )
}