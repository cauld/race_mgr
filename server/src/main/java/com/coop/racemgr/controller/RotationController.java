package com.coop.racemgr.controller;

import com.coop.racemgr.GameServerMgr;
import com.coop.racemgr.GameServerProxy;
import com.coop.racemgr.RacemgrRotationFileMaker;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RotationController {
    @GetMapping("/api/v1/rotation")
    public ResponseEntity<Object> rotation() {
        var gameServerProxy = new GameServerProxy();
        try {
            Object currentRotation = gameServerProxy.getRotation();
            return ResponseHandler.generateResponse("The current rotation", HttpStatus.OK, currentRotation);
        }  catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @PostMapping("/api/v1/rotation")
    public ResponseEntity<Object> rotation(@RequestParam(value = "raceCount", defaultValue = "10") int raceCount,
                                           @RequestParam(value = "persist", defaultValue = "true") boolean persist,
                                           @RequestParam(value = "restart", defaultValue = "true") boolean restart) {
        try {
            var rotationFileMaker = new RacemgrRotationFileMaker(raceCount, persist);
            rotationFileMaker.writeGeneratedRotationFile(); // Game Server gets restarted here
            if (restart) {
                GameServerMgr.restart();
                return ResponseHandler.generateResponse("Successfully generated new rotation, restarting server now to apply!", HttpStatus.OK, null);
            } else {
                return ResponseHandler.generateResponse("Successfully generated new rotation, manually restart server to apply!", HttpStatus.OK, null);
            }
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
}