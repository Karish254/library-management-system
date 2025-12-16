import { useState } from 'react'
import { X, BookOpen, User } from 'lucide-react'
import axios from 'axios'

export default function BorrowBookModal({ book, onClose, onSuccess }) {
    const [memberId, setMemberId] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await axios.post('/api/books/borrow', { isbn: book.isbn, memberId })
            onSuccess()
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to borrow book")
        } finally {
            setLoading(false)
        }
    }

    if (!book) return null

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', animation: 'fadeIn 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BookOpen color="var(--accent)" size={24} />
                        Borrow Book
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', color: 'var(--text-secondary)' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{book.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>by {book.author}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            Member ID
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                value={memberId}
                                onChange={e => setMemberId(e.target.value)}
                                placeholder="Enter library card ID"
                                style={{ width: '100%', paddingLeft: '2.5rem' }}
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn" style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn" style={{ flex: 1 }} disabled={loading}>
                            {loading ? 'Borrowing...' : 'Confirm Borrow'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
