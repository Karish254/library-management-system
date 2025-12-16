package codeaura.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.util.List;

@Data
@Entity
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String memberId;
    private String name;
    private String email;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    @ToString.Exclude
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Borrowing> borrowings;

}