package com.foodbridge.service;

import com.foodbridge.model.Rating;
import com.foodbridge.model.User;
import com.foodbridge.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    public Rating submitRating(Rating rating) {
        return ratingRepository.save(rating);
    }

    public List<Rating> getRatingsForUser(User user) {
        return ratingRepository.findByRated(user);
    }

    public Double getAverageRating(User user) {
        Double avg = ratingRepository.getAverageRatingForUser(user);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }
}
