package com.coop.racemgr.controllers;

import com.coop.racemgr.RacemgrApplication;
import com.coop.racemgr.gameserver.GameServerProxy;
import com.coop.racemgr.model.RaceSession;
import com.coop.racemgr.repositories.RaceSessionRepository;
import lombok.Data;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class RaceSessionController {
    @Autowired
    private RaceSessionRepository raceSessionRepository;

    private GameServerProxy gameServerProxy = new GameServerProxy();

    private static final Logger logger = LogManager.getLogger(RacemgrApplication.class);

    @Data
    public static class RaceSessionRequest {
        private String name;
        private ArrayList<String> raceRotationIds = new ArrayList<String>();
        private Long updated;
        private Boolean active;
    }

    /** ADMIN ENDPOINTS **/

    @PostMapping("/api/v1/admin/race/session")
    public ResponseEntity<Object> raceSession(@RequestBody RaceSessionRequest request) {
        try {
            // If successfully written, save this config in the db history
            var raceSession = new RaceSession(request.name, request.raceRotationIds);
            raceSessionRepository.save(raceSession);
            return ResponseHandler.generateResponse("Successfully created race session!", HttpStatus.OK, raceSession);
        } catch (Exception e) {
            logger.error(e);
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @PutMapping("/api/v1/admin/race/session/{id}")
    public ResponseEntity<Object> updateRaceSession(@RequestBody RaceSessionRequest request, @PathVariable String id) {
        var rs = raceSessionRepository.findItemById(id);
        if (rs == null) {
            return ResponseHandler.generateResponse("Race session not found!", HttpStatus.NOT_FOUND, null);
        }

        try {
            rs.setName(request.name);
            rs.setRaceRotationIds(request.raceRotationIds);
            rs.setUpdated(System.currentTimeMillis());
            raceSessionRepository.save(rs);
            return ResponseHandler.generateResponse("Successfully updated race session!", HttpStatus.OK, null);
        } catch (Exception e) {
            logger.error(e);
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @DeleteMapping("/api/v1/admin/race/session/{id}")
    public ResponseEntity<Object> deleteRaceSession(@PathVariable String id) {
        var rs = raceSessionRepository.findItemById(id);
        if (rs == null) {
            return ResponseHandler.generateResponse("Race session not found!", HttpStatus.NOT_FOUND, null);
        }

        try {
            rs.setActive(false);
            rs.setUpdated(System.currentTimeMillis());
            raceSessionRepository.save(rs);
            return ResponseHandler.generateResponse("Successfully deleted race session!", HttpStatus.OK, null);
        } catch (Exception e) {
            logger.error(e);
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    /** PUBLIC ENDPOINTS **/

    @GetMapping("/api/v1/race/session/{id}")
    public ResponseEntity<Object> raceSessionDetails(@PathVariable String id) {
        var rs = raceSessionRepository.findItemById(id);
        if (rs == null) {
            return ResponseHandler.generateResponse("Race session not found!", HttpStatus.NOT_FOUND, null);
        } else {
            return ResponseHandler.generateResponse("Race session details", HttpStatus.OK, rs);
        }
    }

    @GetMapping("/api/v1/race/session")
    public ResponseEntity<Object> raceSessionList(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer limit) {
        Pageable paging = PageRequest.of(page, limit);
        try {
            var raceSessions = raceSessionRepository.findAll(paging);
            return ResponseHandler.generateResponse("Race session list", HttpStatus.OK, raceSessions);
        } catch (Exception e) {
            logger.error(e);
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
}
