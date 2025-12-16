📚 Library Management System - Backend
This is the backend of the Library Management System built using Spring Boot 3.4.x. It manages books, members, and the logic for borrowing/returning items.

🛠 Tech Stack
Framework: Spring Boot (Java 17)
Database: H2 (In-memory for development)
ORM: Spring Data JPA / Hibernate
Tooling: Lombok, Maven
📂 Project Structure
codeaura.model: JPA Entities (Book, Member, Borrowing)
codeaura.repository: Data Access Layer
codeaura.service: Business Logic for transactions
codeaura.controller: REST API Endpoints
🚀 Getting Started
Open the project in IntelliJ IDEA.
Ensure Annotation Processing is enabled in Settings (for Lombok).
Run LibraryManagementSystemApplication.java.
The server will start at http://localhost:8080.
📡 API Endpoints
Method	Endpoint	Description
POST	/api/books/borrow	Checkout a book using ISBN and Member ID
POST	/api/books/return	Check-in a book using ISBN
GET	/api/books/member/{id}	View all active loans for a specific member
🗄 Database Console
Access the H2 Console to see your tables:

URL: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:testdb
User: sa | Password: (blank)
🖥️ Library Management System - Frontend
A React-based dashboard for librarians to scan books and manage library members.

🛠 Tech Stack
Library: React.js
Styling: CSS3 / Tailwind (optional)
API Client: Axios / Fetch API
Icons: Lucide-React or FontAwesome
📂 Key Components
BorrowForm: Input fields for Librarian to enter ISBN and Member ID.
ReturnForm: Logic to handle book check-ins.
MemberDashboard: View showing borrowed books and their due dates.
ApiService: Centralized logic for calling the Spring Boot backend.
🚀 Getting Started
Ensure you have Node.js installed.
Open the frontend folder in your terminal.
Install dependencies:
npm install
