package codeaura.service;

import codeaura.model.*;
import codeaura.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowingService {
    private final BookRepository bookRepo;
    private final MemberRepository memberRepo;
    private final BorrowingRepository borrowingRepo;

    public BorrowingService(BookRepository b, MemberRepository m, BorrowingRepository br) {
        this.bookRepo = b;
        this.memberRepo = m;
        this.borrowingRepo = br;
    }

    @Transactional
    public Borrowing borrowBook(String isbn, String memberId) {
        Book book = bookRepo.findByIsbn(isbn)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        Member member = memberRepo.findByMemberId(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (book.getAvailableCopies() <= 0)
            throw new RuntimeException("No copies available");

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        Borrowing borrowing = new Borrowing();
        borrowing.setBook(book);
        borrowing.setMember(member);
        borrowing.setBorrowDate(LocalDate.now());
        borrowing.setDueDate(LocalDate.now().plusDays(14));

        return borrowingRepo.save(borrowing);
    }

    @Transactional
    public Borrowing returnBook(String isbn, String memberId) {
        Borrowing borrowing = borrowingRepo.findByMemberMemberIdAndBookIsbnAndReturnDateIsNull(memberId, isbn)
                .orElseThrow(() -> new RuntimeException("Active loan not found for this member and book"));

        borrowing.setReturnDate(LocalDate.now());
        Book book = borrowing.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        return borrowingRepo.save(borrowing);
    }

    public List<Borrowing> getActiveBorrowings(String memberId) {
        return borrowingRepo.findByMemberMemberIdAndReturnDateIsNull(memberId);
    }
}