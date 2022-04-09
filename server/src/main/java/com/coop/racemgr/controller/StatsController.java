package com.coop.racemgr.controller;

import com.coop.racemgr.gameserver.GameServerProxy;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatsController {
    @GetMapping("/api/v1/stats")
    public ResponseEntity<Object> stats() {
        var gameServerProxy = new GameServerProxy();
        try {
            Object currentStats = gameServerProxy.getStats();
            return ResponseHandler.generateResponse("Current stats", HttpStatus.OK, currentStats);
        }  catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
}