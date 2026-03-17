package com.foodbridge.controller;

import com.foodbridge.model.User;
import com.foodbridge.service.ReportService;
import com.foodbridge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private UserService userService;

    /**
     * Download monthly report as CSV (Provider only).
     */
    @GetMapping("/monthly")
    public ResponseEntity<byte[]> downloadMonthlyReport(
            @RequestParam int year,
            @RequestParam int month,
            Authentication authentication) {

        User provider = userService.getUserByEmail(authentication.getName());
        String csvContent = reportService.generateMonthlyReport(provider, year, month);

        String filename = "FoodBridge_Report_" + year + "_" + month + ".csv";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(csvContent.getBytes());
    }
}
