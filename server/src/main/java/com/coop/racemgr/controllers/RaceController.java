package com.coop.racemgr.controllers;

import com.coop.racemgr.jobs.RaceEventProcessor;
import com.coop.racemgr.repositories.RaceMgrConfigRepository;
import com.coop.racemgr.repositories.RaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RaceController {
    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RaceMgrConfigRepository raceMgrConfigRepository;

    @GetMapping("/api/v1/race/events")
    public ResponseEntity<Object> events() {
        var raceEventProcessor = new RaceEventProcessor(this.raceRepository, this.raceMgrConfigRepository);
        try {
            raceEventProcessor.processRaces();
            return ResponseHandler.generateResponse("Events processed", HttpStatus.OK, null);
        }  catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
}
