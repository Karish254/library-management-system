import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Search, Book, Edit2, Trash2, Calendar, Layers } from 'lucide-react'
import BorrowBookModal from '../components/BorrowBookModal'
import EditBookModal from '../components/EditBookModal'
import AddBookModal from '../components/AddBookModal'

export default function Dashboard() {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedBook, setSelectedBook] = useState(null)
    const [editingBook, setEditingBook] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)

    useEffect(() => {
        fetchBooks()
    }, [])

    const fetchBooks = async () => {
        try {
            const res = await axios.get('/api/books')
            setBooks(res.data)
        } catch (error) {
            console.error("Failed to fetch books", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleBorrowClick = (book) => {
        setSelectedBook(book)
    }

    const handleBorrowSuccess = () => {
        alert("Book borrowed successfully!")
        fetchBooks()
    }

    const handleReturn = async (book) => {
        if (!confirm(`Return "${book.title}"?`)) return

        try {
            await axios.post('/api/books/return', { isbn: book.isbn })
            alert("Book returned successfully!")
            fetchBooks()
        } catch (error) {
            alert("Error returning book: " + (error.response?.data?.message || error.message))
        }
    }

    const handleDeleteBook = async (book) => {
        if (!confirm(`Are you sure you want to delete "${book.title}"?`)) return
        try {
            await axios.delete(`/api/books/${book.id}`)
            fetchBooks()
        } catch (error) {
            alert("Failed to delete book")
        }
    }

    const handleEditSuccess = () => {
        fetchBooks()
        setEditingBook(null)
    }

    const handleAddSuccess = () => {
        fetchBooks()
        setShowAddModal(false)
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Library Books</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your library collection</p>
                </div>
                <button className="btn" onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    Add Book
                </button>
            </div>

            <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
                <input
                    type="text"
                    placeholder="Search books by title or author..."
                    style={{ width: '100%', paddingLeft: '3rem' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
            ) : (
                <div className="grid">
                    {filteredBooks.map(book => (
                        <div key={book.id} className="card">
                            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                                    <Book color="var(--accent)" size={24} />
                                </div>
                                <span style={{
                                    background: book.available ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: book.available ? 'var(--success)' : 'var(--error)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '1rem',
                                    fontSize: '0.875rem',
                                    fontWeight: 500
                                }}>
                                    {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                                </span>
                                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => setEditingBook(book)} className="btn btn-secondary" style={{ padding: '0.4rem' }}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteBook(book)} className="btn btn-danger" style={{ padding: '0.4rem' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{book.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>by {book.author}</p>

                            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Layers size={16} />
                                    <span>{book.availableCopies} / {book.totalCopies} Copies</span>
                                </div>
                                {book.publishedDate && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Calendar size={16} />
                                        <span>Published: {book.publishedDate}</span>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                {book.availableCopies > 0 ? (
                                    <button onClick={() => handleBorrowClick(book)} className="btn" style={{ width: '100%', background: 'var(--accent)' }}>Borrow</button>
                                ) : (
                                    <button disabled className="btn btn-secondary" style={{ width: '100%', opacity: 0.7 }}>Out of Stock</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selectedBook && (
                <BorrowBookModal
                    book={selectedBook}
                    onClose={() => setSelectedBook(null)}
                    onSuccess={handleBorrowSuccess}
                />
            )}
            {showAddModal && (
                <AddBookModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleAddSuccess}
                />
            )}
            {editingBook && (
                <EditBookModal
                    book={editingBook}
                    onClose={() => setEditingBook(null)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    )
}
