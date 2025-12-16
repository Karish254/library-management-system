import { useState } from 'react'
import { X, Book, User, Hash } from 'lucide-react'
import axios from 'axios'

export default function EditBookModal({ book, onClose, onSuccess }) {
    const [title, setTitle] = useState(book.title)
    const [author, setAuthor] = useState(book.author)
    const [isbn, setIsbn] = useState(book.isbn)
    const [publishedDate, setPublishedDate] = useState(book.publishedDate || '')
    const [totalCopies, setTotalCopies] = useState(book.totalCopies || 1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Logic: update total copies. Available copies should update relative to difference?
            // Simple logic: update total. available = total - (total_old - available_old).
            // OR simpler: Backend handles it? Backend just saves what we send.
            // If we change total from 5 to 6, available should go +1?
            // To be safe, let's keep availableCopies logic simple or let backend ignore it if we don't send it?
            // But we need to send the whole object generally.
            // Let's assume we just update totalCopies, and let backend or calculate availableCopies here.
            // Actively borrowed = book.totalCopies - book.availableCopies.
            const currentlyBorrowed = book.totalCopies - book.availableCopies;
            const newTotal = parseInt(totalCopies);
            const newAvailable = newTotal - currentlyBorrowed;

            if (newAvailable < 0) {
                setError("Cannot reduce total copies below currently borrowed amount")
                setLoading(false)
                return
            }

            await axios.put(`/api/books/${book.id}`, {
                id: book.id,
                title,
                author,
                isbn,
                publishedDate,
                totalCopies: newTotal,
                availableCopies: newAvailable
            })
            onSuccess()
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update book")
        } finally {
            setLoading(false)
        }
    }

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
                        <Book color="var(--accent)" size={24} />
                        Edit Book
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', color: 'var(--text-secondary)' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Title</label>
                        <div style={{ position: 'relative' }}>
                            <Book size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', paddingLeft: '2.5rem' }} required />
                        </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Author</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input type="text" value={author} onChange={e => setAuthor(e.target.value)} style={{ width: '100%', paddingLeft: '2.5rem' }} required />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>ISBN</label>
                            <input type="text" value={isbn} onChange={e => setIsbn(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Published</label>
                            <input type="text" value={publishedDate} onChange={e => setPublishedDate(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} placeholder="YYYY-MM-DD" />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Total Copies</label>
                        <input type="number" min="1" value={totalCopies} onChange={e => setTotalCopies(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} required />
                    </div>

                    {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" className="btn" style={{ flex: 1 }} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
