package codeaura.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.util.List;

@Data
@Entity
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String isbn;
    private String title;
    private String author;
    private String publishedDate;

    @Column(columnDefinition = "integer default 1")
    private int totalCopies = 1;

    @Column(columnDefinition = "integer default 1")
    private int availableCopies = 1;

    public boolean isAvailable() {
        return availableCopies > 0;
    }

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    @ToString.Exclude
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Borrowing> borrowings;
}