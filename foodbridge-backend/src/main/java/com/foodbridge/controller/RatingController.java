package com.foodbridge.controller;

import com.foodbridge.dto.ApiResponse;
import com.foodbridge.model.FoodListing;
import com.foodbridge.model.Rating;
import com.foodbridge.model.User;
import com.foodbridge.service.FoodListingService;
import com.foodbridge.service.RatingService;
import com.foodbridge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @Autowired
    private UserService userService;

    @Autowired
    private FoodListingService listingService;

    /**
     * Submit a rating.
     */
    @PostMapping
    public ResponseEntity<?> submitRating(@RequestBody Map<String, Object> body, Authentication authentication) {
        try {
            User rater = userService.getUserByEmail(authentication.getName());
            User rated = userService.getUserById(Long.parseLong(body.get("ratedUserId").toString()));
            FoodListing listing = listingService.getListingById(Long.parseLong(body.get("listingId").toString()));

            Rating rating = new Rating();
            rating.setRater(rater);
            rating.setRated(rated);
            rating.setListing(listing);
            rating.setScore(Integer.parseInt(body.get("score").toString()));
            rating.setComment((String) body.getOrDefault("comment", ""));

            Rating saved = ratingService.submitRating(rating);
            return ResponseEntity.ok(new ApiResponse(true, "Rating submitted", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Get ratings for a user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserRatings(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        List<Rating> ratings = ratingService.getRatingsForUser(user);
        Double avg = ratingService.getAverageRating(user);

        Map<String, Object> result = Map.of(
                "ratings", ratings,
                "averageScore", avg);
        return ResponseEntity.ok(result);
    }
}
