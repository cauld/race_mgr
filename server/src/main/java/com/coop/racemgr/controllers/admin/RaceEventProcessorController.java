package com.coop.racemgr.controllers.admin;

import com.coop.racemgr.controllers.ResponseHandler;
import com.coop.racemgr.jobs.RaceEventProcessor;
import com.coop.racemgr.repositories.RaceMgrConfigRepository;
import com.coop.racemgr.repositories.RaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RaceEventProcessorController {
    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RaceMgrConfigRepository raceMgrConfigRepository;

    @PostMapping("/api/v1/admin/race/events")
    public ResponseEntity<Object> processEvents() {
        var raceEventProcessor = new RaceEventProcessor(this.raceRepository, this.raceMgrConfigRepository);
        try {
            raceEventProcessor.processRaces();
            return ResponseHandler.generateResponse("Events processed", HttpStatus.OK, null);
        }  catch (Exception e) {
            System.out.println("Error: " + e);
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
}
