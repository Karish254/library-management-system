import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'

function App() {
    const [currentPage, setCurrentPage] = useState('dashboard')

    return (
        <div className="app">
            <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <main className="container">
                {currentPage === 'dashboard' && <Dashboard />}
                {currentPage === 'members' && <Members />}
            </main>
        </div>
    )
}

export default App
