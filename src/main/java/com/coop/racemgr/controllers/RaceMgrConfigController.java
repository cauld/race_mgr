package com.coop.racemgr.controllers;

import com.coop.racemgr.RacemgrApplication;
import com.coop.racemgr.controllers.ResponseHandler;
import com.coop.racemgr.model.RaceMgrConfig;
import com.coop.racemgr.repositories.RaceMgrConfigRepository;
import lombok.Data;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RaceMgrConfigController {
    @Autowired
    private RaceMgrConfigRepository raceMgrConfigRepository;

    private static final Logger logger = LogManager.getLogger(RacemgrApplication.class);

    @Data
    public static class RaceMgrConfigRequest {
        String activeRaceSessionId = null;
        String activeRaceRotationId = null;
        Long updated;
    }

    /** ADMIN ENDPOINTS **/

    @PutMapping("/api/v1/admin/config")
    public ResponseEntity<Object> updateRaceMgrConfigDetails(@RequestBody RaceMgrConfigRequest request) {
        var rmc = raceMgrConfigRepository.findItemById("1");
        if (rmc == null) {
            rmc = new RaceMgrConfig(request.activeRaceSessionId, request.activeRaceRotationId);
        }  else {
            rmc.setActiveRaceSessionId(request.activeRaceSessionId);
            rmc.setActiveRaceRotationId(request.activeRaceRotationId);
            rmc.setUpdated(System.currentTimeMillis());
        }

        try {
            raceMgrConfigRepository.save(rmc);
            return ResponseHandler.generateResponse("Successfully set race mgr config!", HttpStatus.OK, null);
        } catch (Exception e) {
            logger.error(e);
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    /** PUBLIC ENDPOINTS **/

    @GetMapping("/api/v1/config")
    public ResponseEntity<Object> raceMgrConfigDetails() {
        var rmc = raceMgrConfigRepository.findItemById("1");
        if (rmc == null) {
            return ResponseHandler.generateResponse("Race Mgr config not set, added a default!", HttpStatus.NOT_FOUND, null);
        }  else {
            return ResponseHandler.generateResponse("Race Mgr config details", HttpStatus.OK, rmc);
        }
    }
}