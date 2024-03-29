package com.coop.racemgr.controllers;

import com.coop.racemgr.RacemgrApplication;
import com.coop.racemgr.gameserver.GameServerMgr;
import com.coop.racemgr.gameserver.GameServerProxy;
import com.coop.racemgr.model.RaceRotation;
import com.coop.racemgr.repositories.RaceRotationRepository;
import com.coop.racemgr.rotation.RacemgrRotationConfigMaker;
import com.coop.racemgr.rotation.RacemgrRotationFileMaker;

import lombok.Data;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.io.File;

// @TODO:
//  1) Support expanded custom rotations and not just semi-random

@RestController
public class RaceRotationController {
    @Autowired
    private RaceRotationRepository raceRotationRepository;

    @Data
    public static class RaceRotationCustomRequest {
        private String name;
        private Object config;
        private Long updated;
        private Boolean active = true;
    }

    @Data
    public static class RaceRotationGenerationRequest {
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

    private static final Logger logger = LogManager.getLogger(RacemgrApplication.class);

    /** ADMIN ENDPOINTS **/

    // @FIXME: This is a quick way to add support for custom rotations. For now there is no additional validation of given rotation.
    // It assumes the same limited file format as what is created by the generator. Examples included in the Postman collection...
    @PostMapping("/api/v1/admin/race/rotation")
    public ResponseEntity<Object> rotation(@RequestBody RaceRotationCustomRequest request) throws org.json.simple.parser.ParseException {
        String gameServerFsPath = System.getenv("RM_PATH_TO_DEDICATED_SERVER");

        RaceRotation raceRotation;
        try {
            raceRotation = new RaceRotation(request.name, request.config);
            var rotationFileMaker = new RacemgrRotationFileMaker(raceRotation);
            rotationFileMaker.writeGeneratedRotationFile();

            // Once a new file has been written we must remove the active/cached one and reboot
            // the game server for this to take effect.
            String gameServerCachedRotationFilePath = gameServerFsPath + "\\lua_config\\sms_rotate_config.json";
            File file = new File(gameServerCachedRotationFilePath);
            if (file.delete()) {
                System.out.println("Game Server cached rotation deleted successfully");
            } else {
                System.out.println("Game Server cached rotation");
            }

            raceRotationRepository.save(raceRotation);
            return ResponseHandler.generateResponse("Successfully saved custom rotation", HttpStatus.OK, raceRotation);
        } catch (Exception e) {
            logger.error(e);
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @PostMapping("/api/v1/admin/race/rotation/generate")
    public ResponseEntity<Object> rotationGeneration(@RequestBody RaceRotationGenerationRequest request) throws org.json.simple.parser.ParseException {
        // Generate rotation config
        RacemgrRotationConfigMaker rotationConfig = new RacemgrRotationConfigMaker(new GameServerProxy(), request.raceCount, request.allowKarts, request.persist);

        try {
            var raceRotation = new RaceRotation(request.name, rotationConfig);
            raceRotationRepository.save(raceRotation);
            return ResponseHandler.generateResponse("Successfully generated new rotation", HttpStatus.OK, raceRotation);
        } catch (Exception e) {
            logger.error(e);
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
            logger.error(e);
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @PostMapping("/api/v1/admin/race/rotation/{id}/activate")
    public ResponseEntity<Object> activateRaceRotation(@PathVariable String id) {
        RaceRotation rr = raceRotationRepository.findItemById(id);
        if (rr == null) {
            return ResponseHandler.generateResponse("Race rotation not found!", HttpStatus.NOT_FOUND, null);
        }

        try {
            var rotationFileMaker = new RacemgrRotationFileMaker(rr);
            rotationFileMaker.writeGeneratedRotationFile();
            GameServerMgr.restart();
            return ResponseHandler.generateResponse("Successfully activated race rotation, restarting server now to apply!", HttpStatus.OK, null);
        } catch (Exception e) {
            logger.error(e);
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
            logger.error(e);
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
}