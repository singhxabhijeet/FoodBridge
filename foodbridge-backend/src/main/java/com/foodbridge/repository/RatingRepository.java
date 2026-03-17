package com.foodbridge.repository;

import com.foodbridge.model.Rating;
import com.foodbridge.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByRated(User rated);

    List<Rating> findByRater(User rater);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.rated = :user")
    Double getAverageRatingForUser(@Param("user") User user);
}
