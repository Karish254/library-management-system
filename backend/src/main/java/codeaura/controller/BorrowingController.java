package codeaura.controller;

import codeaura.model.Borrowing;
import codeaura.service.BorrowingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
public class BorrowingController {
    private final BorrowingService service;

    public BorrowingController(BorrowingService service) {
        this.service = service;
    }

    @PostMapping("/borrow")
    public ResponseEntity<Borrowing> borrow(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(service.borrowBook(req.get("isbn"), req.get("memberId")));
    }

    @PostMapping("/return")
    public ResponseEntity<Borrowing> returnBook(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(service.returnBook(req.get("isbn"), req.get("memberId")));
    }

    @GetMapping("/member/{memberId}")
    public List<Borrowing> getMemberBooks(@PathVariable String memberId) {
        return service.getActiveBorrowings(memberId);
    }
}