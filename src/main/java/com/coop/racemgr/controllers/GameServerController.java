package com.coop.racemgr.controllers;

import com.coop.racemgr.RacemgrApplication;
import com.coop.racemgr.gameserver.GameServerMgr;
import com.coop.racemgr.gameserver.GameServerProxy;
import com.coop.racemgr.utils.RacemgrUtils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
public class GameServerController {
    public enum ServerStatuses {
        start, restart, stop;
    }

    private static final Logger logger = LogManager.getLogger(RacemgrApplication.class);

    private GameServerProxy gameServerProxy = new GameServerProxy();

    /** ADMIN ENDPOINTS **/

    @PostMapping("/api/v1/admin/gameserver")
    public ResponseEntity<Object> gameserver(@RequestBody final String request) throws InterruptedException, IOException {
        Object requestBodyObj = RacemgrUtils.jsonStrToObj(request);
        var status = RacemgrUtils.getValueFromObj("status", requestBodyObj);
        var gameServerMgr = new GameServerMgr();

        if (status.equals(ServerStatuses.start.toString())) {
            gameServerMgr.start();
        } else if (status.equals(ServerStatuses.restart.toString())) {
            gameServerMgr.restart();
        } else if (status.equals(ServerStatuses.stop.toString())) {
            gameServerMgr.stop();
        } else {
            String msg = "Unknown status parameter!";
            logger.warn(msg);
            return ResponseHandler.generateResponse(msg, HttpStatus.BAD_REQUEST, null);
        }

        return ResponseHandler.generateResponse("Server status changed!", HttpStatus.OK, null);
    }

    /** PUBLIC ENDPOINTS **/

    @GetMapping("/api/v1/gameserver")
    public ResponseEntity<Object> gameserver() throws InterruptedException, IOException {
        JSONObject response = new JSONObject();
        response.put("isRunning", GameServerMgr.isRunning());
        return ResponseHandler.generateResponse("Current external game server status", HttpStatus.OK, response);
    }

    @GetMapping("/api/v1/gameserver/weather")
    public ResponseEntity<Object> weather() {
        try {
            List weather = this.gameServerProxy.getWeather();
            return ResponseHandler.generateResponse("List of weather options", HttpStatus.OK, weather);
        }  catch (Exception e) {
            logger.error(e);
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @GetMapping("/api/v1/gameserver/tracks")
    public ResponseEntity<Object> tracks() {
        try {
            List tracks = this.gameServerProxy.getTracks();
            return ResponseHandler.generateResponse("List of track options", HttpStatus.OK, tracks);
        }  catch (Exception e) {
            logger.error(e);
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @GetMapping("/api/v1/gameserver/liveries")
    public ResponseEntity<Object> liveries() {
        try {
            List liveries = this.gameServerProxy.getLiveries();
            return ResponseHandler.generateResponse("List of livery options", HttpStatus.OK, liveries);
        }  catch (Exception e) {
            logger.error(e);
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @GetMapping("/api/v1/gameserver/vehicles")
    public ResponseEntity<Object> vehicles() {
        try {
            List vehicles = this.gameServerProxy.getVehicles();
            return ResponseHandler.generateResponse("List of vehicle options", HttpStatus.OK, vehicles);
        }  catch (Exception e) {
            logger.error(e);
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @GetMapping("/api/v1/gameserver/vehicle_classes")
    public ResponseEntity<Object> vehicleClasses() {
        try {
            List vehicleClasses = this.gameServerProxy.getVehicleClasses();
            return ResponseHandler.generateResponse("List of vehicle class options", HttpStatus.OK, vehicleClasses);
        }  catch (Exception e) {
            logger.error(e);
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
}
