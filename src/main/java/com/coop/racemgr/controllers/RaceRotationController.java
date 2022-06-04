package com.coop.racemgr.controllers;

import com.coop.racemgr.controllers.ResponseHandler;
import com.coop.racemgr.gameserver.GameServerMgr;
import com.coop.racemgr.gameserver.GameServerProxy;
import com.coop.racemgr.model.RaceRotation;
import com.coop.racemgr.repositories.RaceRotationRepository;
import com.coop.racemgr.rotation.RacemgrRotationConfig;
import com.coop.racemgr.rotation.RacemgrRotationFileMaker;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

// @TODO:
//  1) Support expanded custom rotations and not just semi-random
//  2) Support swapping a rotation
//  3) Delete a rotation
//  4) List rotations

@RestController
public class RaceRotationController {
    @Autowired
    private RaceRotationRepository raceRotationRepository;

    @Data
    public static class RaceRotationRequest {
        private String name = String.valueOf(UUID.randomUUID());
        private Integer raceCount = 5;
        private Boolean allowKarts = false;
        private Boolean persist = true;
        private Boolean restart = false;
        private Long updated;
        private Boolean active = true;

        // Required for requestbody serialization
        private GameServerProxy gameServerProxy;
    }

    /** ADMIN ENDPOINTS **/

    @PostMapping("/api/v1/admin/race/rotation")
    public ResponseEntity<Object> rotation(@RequestBody RaceRotationRequest request) throws org.json.simple.parser.ParseException {
        // Generate rotation config
        RacemgrRotationConfig rotationConfig = new RacemgrRotationConfig(new GameServerProxy(), request.raceCount, request.allowKarts, request.persist);

        try {
            var rotationFileMaker = new RacemgrRotationFileMaker(rotationConfig);
            rotationFileMaker.writeGeneratedRotationFile();

            // If successfully written, save this config in the db history
            var raceRotation = new RaceRotation(request.name, rotationConfig);
            raceRotationRepository.save(raceRotation);

            if (request.restart) {
                GameServerMgr.restart();
                return ResponseHandler.generateResponse("Successfully generated new rotation, restarting server now to apply!", HttpStatus.OK, raceRotation);
            } else {
                return ResponseHandler.generateResponse("Successfully generated new rotation, manually restart server to apply!", HttpStatus.OK, raceRotation);
            }
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @DeleteMapping("/api/v1/admin/race/rotation/{id}")
    public ResponseEntity<Object> deleteRaceRotation(@PathVariable String id) {
        var rr = raceRotationRepository.findItemById(id);
        if (rr == null) {
            return ResponseHandler.generateResponse("Race rotation not found!", HttpStatus.NOT_FOUND, null);
        }

        try {
            rr.setActive(false);
            rr.setUpdated(System.currentTimeMillis());
            raceRotationRepository.save(rr);
            return ResponseHandler.generateResponse("Successfully deleted race rotation!", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    /** PUBLIC ENDPOINTS **/

    @GetMapping("/api/v1/race/rotation/{id}")
    public ResponseEntity<Object> raceRotationDetails(@PathVariable String id) {
        var rr = raceRotationRepository.findItemById(id);
        if (rr == null) {
            return ResponseHandler.generateResponse("Race session not found!", HttpStatus.NOT_FOUND, null);
        }  else {
            return ResponseHandler.generateResponse("Race session details", HttpStatus.OK, rr);
        }
    }

    @GetMapping("/api/v1/race/rotation")
    public ResponseEntity<Object> raceRotationList(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer limit) {
        Pageable paging = PageRequest.of(page, limit);
        try {
            var raceRotations = raceRotationRepository.findAll(paging);
            return ResponseHandler.generateResponse("Race rotation list", HttpStatus.OK, raceRotations);
        }  catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
}