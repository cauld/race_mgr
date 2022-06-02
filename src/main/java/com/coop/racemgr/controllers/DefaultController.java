package com.coop.racemgr.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DefaultController {
    @RequestMapping("/api")
    public String home() {
        return "Welcome to Race Server Manager!";
    }
}