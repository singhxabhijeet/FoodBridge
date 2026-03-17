package com.foodbridge.repository;

import com.foodbridge.model.QualityCheck;
import com.foodbridge.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QualityCheckRepository extends JpaRepository<QualityCheck, Long> {
    List<QualityCheck> findByChecker(User checker);

    List<QualityCheck> findByListingId(Long listingId);
}
