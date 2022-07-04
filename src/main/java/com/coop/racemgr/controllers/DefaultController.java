package com.coop.racemgr.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class DefaultController {
    @RequestMapping("/api")
    public String home() {
        return "Welcome to Race Server Manager!";
    }
}