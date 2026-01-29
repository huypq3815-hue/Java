package com.capstone.planbookai.repository;

import com.capstone.planbookai.entity.Question;
import com.capstone.planbookai.entity.QuestionLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    @Query(value = "SELECT * FROM questions q WHERE q.topic_id = :topicId AND q.level = :level ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<Question> findRandom(@Param("topicId") Long topicId, @Param("level") String level, @Param("limit") int limit);
    
    List<Question> findByTopicIdAndLevel(Long topicId, QuestionLevel level);
}