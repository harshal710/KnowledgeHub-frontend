import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem('kp_user')
        const token = localStorage.getItem('kp_token')
        if (stored && token) {
            try {
                setUser(JSON.parse(stored))
            } catch {
                localStorage.removeItem('kp_user')
                localStorage.removeItem('kp_token')
            }
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const data = await authApi.login({ email, password })
        localStorage.setItem('kp_token', data.token)
        localStorage.setItem('kp_user', JSON.stringify({
            id: data.id,
            username: data.username,
            email: data.email,
            role: data.role,
        }))
        setUser({ id: data.id, username: data.username, email: data.email, role: data.role })
        return data
    }

    const signup = async (username, email, password) => {
        const data = await authApi.signup({ username, email, password })
        localStorage.setItem('kp_token', data.token)
        localStorage.setItem('kp_user', JSON.stringify({
            id: data.id,
            username: data.username,
            email: data.email,
            role: data.role,
        }))
        setUser({ id: data.id, username: data.username, email: data.email, role: data.role })
        return data
    }

    const logout = async () => {
        try { await authApi.logout() } catch { }
        localStorage.removeItem('kp_token')
        localStorage.removeItem('kp_user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
