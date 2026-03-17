package com.foodbridge.repository;

import com.foodbridge.model.Claim;
import com.foodbridge.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByReceiver(User receiver);

    Optional<Claim> findByListingId(Long listingId);

    long countByReceiverAndNoShowTrue(User receiver);
}
