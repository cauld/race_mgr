package com.coop.racemgr.controller;

import java.io.IOException;

import com.coop.racemgr.GameServerMgr;
import com.coop.racemgr.RacemgrRotationFileMaker;
import org.json.simple.parser.ParseException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RotationController {
    @GetMapping("/rotation")
    public ResponseEntity<Object> rotation(@RequestParam(value = "raceCount", defaultValue = "10") int raceCount,
                                           @RequestParam(value = "persist", defaultValue = "true") boolean persist) throws ParseException, IOException {
        try {
            var rotationFileMaker = new RacemgrRotationFileMaker(raceCount, persist);
            rotationFileMaker.writeGeneratedRotationFile(); // Game Server gets restarted here
            return ResponseHandler.generateResponse("Successfully generated new rotation!", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
}