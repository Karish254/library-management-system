package codeaura.repository;

import codeaura.model.Borrowing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {

    // Finds all books currently held by a member (where returnDate is null)
    List<Borrowing> findByMemberMemberIdAndReturnDateIsNull(String memberId);

    // Finds the specific active loan for a book so it can be returned
    Optional<Borrowing> findByBookIsbnAndReturnDateIsNull(String isbn);

    Optional<Borrowing> findByMemberMemberIdAndBookIsbnAndReturnDateIsNull(String memberId, String isbn);
}