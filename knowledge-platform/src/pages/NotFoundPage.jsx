import { Link } from 'react-router-dom'
import './NotFoundPage.css'

export default function NotFoundPage() {
    return (
        <main className="not-found-page page-wrapper">
            <div className="nf-orb nf-orb-1" />
            <div className="nf-orb nf-orb-2" />

            <div className="not-found-content animate-fade-in">
                <div className="nf-code">404</div>
                <h1 className="nf-title">Page Not Found</h1>
                <p className="nf-desc">
                    The page you're looking for has wandered off into cyberspace.
                    Let's get you back on track.
                </p>
                <div className="nf-actions">
                    <Link to="/" className="btn btn-primary btn-lg" id="go-home-btn">
                        🏠 Go Home
                    </Link>
                    <Link to="/new-article" className="btn btn-secondary btn-lg">
                        ✍️ Write an Article
                    </Link>
                </div>
            </div>
        </main>
    )
}
