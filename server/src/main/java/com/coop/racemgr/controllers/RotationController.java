package com.coop.racemgr.controllers;

import com.coop.racemgr.gameserver.GameServerMgr;
import com.coop.racemgr.gameserver.GameServerProxy;
import com.coop.racemgr.rotation.RacemgrRotationFileMaker;
import com.coop.racemgr.utils.RacemgrUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    /*
    @RequestParam(value = "raceCount", defaultValue = "10") int raceCount,
    @RequestParam(value = "allowKarts", defaultValue = "false") boolean allowKarts,
    @RequestParam(value = "persist", defaultValue = "true") boolean persist,
    @RequestParam(value = "restart", defaultValue = "true" boolean restart
    */



    @PostMapping("/api/v1/rotation")
    public ResponseEntity<Object> rotation(@RequestBody final String request) {
        Object requestBodyObj = RacemgrUtils.jsonStrToObj(request);
        var raceCount = Integer.parseInt(RacemgrUtils.getValueFromObj("raceCount", requestBodyObj));
        var allowKarts = Boolean.valueOf(RacemgrUtils.getValueFromObj("allowKarts", requestBodyObj));
        var persist = Boolean.valueOf(RacemgrUtils.getValueFromObj("persist", requestBodyObj));
        var restart = Boolean.valueOf(RacemgrUtils.getValueFromObj("restart", requestBodyObj));
        try {
            var rotationFileMaker = new RacemgrRotationFileMaker(raceCount, allowKarts, persist);
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