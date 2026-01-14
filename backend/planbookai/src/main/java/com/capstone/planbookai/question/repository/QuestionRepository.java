package com.capstone.planbookai.question.repository;

import com.capstone.planbookai.question.entity.Question;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query(
        value = """
            SELECT * FROM question
            WHERE topic_id = :topicId
              AND level = :level
            ORDER BY RAND()
            LIMIT :limit
        """,
        nativeQuery = true
    )
    List<Question> findRandom(
        @Param("topicId") Long topicId,
        @Param("level") String level,
        @Param("limit") int limit
    );
}
