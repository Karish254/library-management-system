package codeaura.repository;

import codeaura.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    // Custom query to find a member by their library card ID
    Optional<Member> findByMemberId(String memberId);
}