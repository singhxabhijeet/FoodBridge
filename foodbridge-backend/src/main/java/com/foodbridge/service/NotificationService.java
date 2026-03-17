package com.foodbridge.service;

import com.foodbridge.model.Notification;
import com.foodbridge.model.User;
import com.foodbridge.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Create and save a notification for a user.
     */
    public Notification createNotification(User user, String message, String type) {
        Notification notification = new Notification(user, message, type);
        return notificationRepository.save(notification);
    }

    /**
     * Get all notifications for a user, ordered by most recent.
     */
    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    /**
     * Get unread notification count.
     */
    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndReadFalse(user);
    }

    /**
     * Mark a notification as read.
     */
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    /**
     * Send notification to all users with a specific role (used for quality checker
     * alerts).
     */
    public void notifyAllUsersWithRole(List<User> users, String message, String type) {
        for (User user : users) {
            createNotification(user, message, type);
        }
    }
}
