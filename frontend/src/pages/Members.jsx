import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, User, Mail, BookOpen, Edit2, Trash2 } from 'lucide-react'
import EditMemberModal from '../components/EditMemberModal'

export default function Members() {
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingMember, setEditingMember] = useState(null)

    useEffect(() => {
        fetchMembers()
    }, [])

    const fetchMembers = async () => {
        try {
            const res = await axios.get('/api/members')
            const membersData = res.data

            // Fetch borrowings for each member
            const membersWithBooks = await Promise.all(membersData.map(async (member) => {
                try {
                    const booksRes = await axios.get(`/api/books/member/${member.memberId}`)
                    return { ...member, borrowings: booksRes.data || [] }
                } catch (err) {
                    return { ...member, borrowings: [] }
                }
            }))

            setMembers(membersWithBooks)
        } catch (error) {
            console.error("Failed to fetch members", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddMember = async () => {
        const name = prompt("Member Name:")
        if (!name) return
        const memberId = prompt("Library Card ID:")
        const email = prompt("Email:")

        try {
            await axios.post('/api/members', { name, memberId, email })
            alert("Member registered!")
            fetchMembers()
        } catch (error) {
            alert("Failed to register member")
        }
    }

    const handleDelete = async (member) => {
        if (!confirm(`Are you sure you want to remove ${member.name}?`)) return
        try {
            await axios.delete(`/api/members/${member.id}`)
            fetchMembers()
        } catch (error) {
            alert("Failed to delete member")
        }
    }

    const handleReturnBook = async (memberId, isbn) => {
        if (!confirm("Return this book?")) return
        try {
            await axios.post('/api/books/return', { isbn, memberId })
            fetchMembers()
        } catch (error) {
            alert("Failed to return book")
        }
    }

    const handleEditSuccess = () => {
        fetchMembers()
        setEditingMember(null)
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Members</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage library members</p>
                </div>
                <button className="btn" onClick={handleAddMember} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    Add Member
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
            ) : (
                <div className="grid">
                    {members.map(member => (
                        <div key={member.id} className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '48px', height: '48px',
                                    borderRadius: '50%',
                                    background: 'var(--accent)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontWeight: 'bold', fontSize: '1.25rem'
                                }}>
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.125rem' }}>{member.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>ID: {member.memberId}</p>
                                </div>
                                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => setEditingMember(member)} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(member)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '1rem' }}>
                                <Mail size={16} />
                                {member.email}
                            </div>

                            {member.borrowings && member.borrowings.length > 0 && (
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                    <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <BookOpen size={14} />
                                        Borrowed Books
                                    </h4>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {member.borrowings.map(b => (
                                            <li key={b.id} style={{ fontSize: '0.875rem', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
                                                <span>{b.book.title}</span>
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                                    {b.borrowDate} → {b.dueDate}
                                                </span>
                                                <button
                                                    onClick={() => handleReturnBook(member.memberId, b.book.isbn)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', height: 'auto', marginLeft: '0.5rem' }}
                                                >
                                                    Return
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {editingMember && (
                <EditMemberModal
                    member={editingMember}
                    onClose={() => setEditingMember(null)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    )
}
