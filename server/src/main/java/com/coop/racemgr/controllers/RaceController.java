package com.coop.racemgr.controllers;

import com.coop.racemgr.jobs.RaceEventProcessor;
import com.coop.racemgr.model.Race;
import com.coop.racemgr.repositories.RaceMgrConfigRepository;
import com.coop.racemgr.repositories.RaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RaceController {
    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RaceMgrConfigRepository raceMgrConfigRepository;

    @GetMapping("/api/v1/race/events")
    public ResponseEntity<Object> raceEventList(
            @RequestParam(required = false, defaultValue = "") String raceSessionId,
            @RequestParam(required = false, defaultValue = "") String raceRotationId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer limit
    ) {
        Pageable paging = PageRequest.of(page, limit);
        Page<Race> raceSessions;

        try {
            if (!raceSessionId.equals("") && !raceRotationId.equals("")) {
                // Filter by session and rotation
                System.out.println("Filter by session and rotation: " + raceSessionId);
                raceSessions = raceRepository.findAllBySessionIdAndRotationId(raceSessionId, raceRotationId, paging);
            } else if (!raceSessionId.equals("") && raceRotationId.equals("")) {
                System.out.println("Filter by session");
                // Filter by session
                raceSessions = raceRepository.findAllBySessionId(raceSessionId, paging);
                // Filter by rotation
            } else if (raceSessionId.equals("") && !raceRotationId.equals("")) {
                System.out.println("Filter by rotation");
                raceSessions = raceRepository.findAllByRotationId(raceRotationId, paging);
            } else {
                // No filter
                System.out.println("Filter none");
                raceSessions = raceRepository.findAll(paging);
            }

            return ResponseHandler.generateResponse("Race event list", HttpStatus.OK, raceSessions);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @PostMapping("/api/v1/race/events")
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
