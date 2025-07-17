package com.project.back_end.mvc;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.view.RedirectView;

import com.project.back_end.services.TokenService;

public class DashboardController {

// 1. Set Up the MVC Controller Class:
//    - Annotate the class with `@Controller` to indicate that it serves as an MVC controller returning view names (not JSON).
//    - This class handles routing to admin and doctor dashboard pages based on token validation.


// 2. Autowire the Shared Service:
//    - Inject the common `Service` class, which provides the token validation logic used to authorize access to dashboards.


// 3. Define the `adminDashboard` Method:
//    - Handles HTTP GET requests to `/adminDashboard/{token}`.
//    - Accepts an admin's token as a path variable.
//    - Validates the token using the shared service for the `"admin"` role.
//    - If the token is valid (i.e., no errors returned), forwards the user to the `"admin/adminDashboard"` view.
//    - If invalid, redirects to the root URL, likely the login or home page.


// 4. Define the `doctorDashboard` Method:
//    - Handles HTTP GET requests to `/doctorDashboard/{token}`.
//    - Accepts a doctor's token as a path variable.
//    - Validates the token using the shared service for the `"doctor"` role.
//    - If the token is valid, forwards the user to the `"doctor/doctorDashboard"` view.
//    - If the token is invalid, redirects to the root URL.


    @Autowired
    private TokenService tokenValidationService;

    @GetMapping("/adminDashboard/{token}")
    public Object adminDashboard(@PathVariable String token) {
        Map<String, Object> result = tokenValidationService.validateToken(token, "admin");

        if (result.isEmpty()) {
            // Token is valid for admin
            return "admin/adminDashboard";
        } else {
            // Invalid or unauthorized token
            return new RedirectView("http://localhost:8080");
        }
    }

    @GetMapping("/doctorDashboard/{token}")
    public Object doctorDashboard(@PathVariable String token) {
        Map<String, Object> result = tokenValidationService.validateToken(token, "doctor");

        if (result.isEmpty()) {
            // Token is valid for doctor
            return "doctor/doctorDashboard";
        } else {
            return new RedirectView("http://localhost:8080");
        }
    }



}
