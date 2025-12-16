import { useState } from 'react'
import { X, Book, User, Calendar, Layers } from 'lucide-react'
import axios from 'axios'

export default function AddBookModal({ onClose, onSuccess }) {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [isbn, setIsbn] = useState('')
    const [publishedDate, setPublishedDate] = useState('')
    const [totalCopies, setTotalCopies] = useState(1)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Initial available copies = total copies
            await axios.post('/api/books', {
                title,
                author,
                isbn,
                publishedDate,
                totalCopies: parseInt(totalCopies),
                availableCopies: parseInt(totalCopies)
            })
            onSuccess()
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add book")
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
            <div className="card" style={{ width: '100%', maxWidth: '450px', animation: 'fadeIn 0.2s', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Book color="var(--accent)" size={24} />
                        Add New Book
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
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', paddingLeft: '2.5rem' }} required placeholder="e.g. The Great Gatsby" />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Author</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input type="text" value={author} onChange={e => setAuthor(e.target.value)} style={{ width: '100%', paddingLeft: '2.5rem' }} required placeholder="e.g. F. Scott Fitzgerald" />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>ISBN</label>
                            <input type="text" value={isbn} onChange={e => setIsbn(e.target.value)} required placeholder="ISBN-13" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Published Date</label>
                            <div style={{ position: 'relative' }}>
                                <Calendar size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input type="text" value={publishedDate} onChange={e => setPublishedDate(e.target.value)} style={{ width: '100%', paddingLeft: '2.25rem' }} placeholder="YYYY-MM-DD" />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Quantity (Total Copies)</label>
                        <div style={{ position: 'relative' }}>
                            <Layers size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input type="number" min="1" value={totalCopies} onChange={e => setTotalCopies(e.target.value)} style={{ width: '100%', paddingLeft: '2.5rem' }} required />
                        </div>
                    </div>

                    {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" className="btn" style={{ flex: 1 }} disabled={loading}>{loading ? 'Adding...' : 'Add Book'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
