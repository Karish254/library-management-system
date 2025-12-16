import { Library, Users, BookOpen } from 'lucide-react'

export default function Navbar({ currentPage, setCurrentPage }) {
    return (
        <nav style={{
            borderBottom: '1px solid var(--border)',
            padding: '1rem 2rem',
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    <Library color="var(--accent)" size={28} />
                    <span>CodeAura Library</span>
                </div>

                <div style={{ display: 'flex', gap: '2rem' }}>
                    <button
                        onClick={() => setCurrentPage('dashboard')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: currentPage === 'dashboard' ? 'var(--accent)' : 'var(--text-secondary)',
                            background: 'none',
                            fontSize: '1rem',
                            fontWeight: 500
                        }}
                    >
                        <BookOpen size={20} />
                        Books
                    </button>

                    <button
                        onClick={() => setCurrentPage('members')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: currentPage === 'members' ? 'var(--accent)' : 'var(--text-secondary)',
                            background: 'none',
                            fontSize: '1rem',
                            fontWeight: 500
                        }}
                    >
                        <Users size={20} />
                        Members
                    </button>
                </div>
            </div>
        </nav>
    )
}
