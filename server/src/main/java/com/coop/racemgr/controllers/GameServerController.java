package com.coop.racemgr.controllers;

import com.coop.racemgr.gameserver.GameServerProxy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class GameServerController {
    private GameServerProxy gameServerProxy = new GameServerProxy();

    @GetMapping("/api/v1/gameserver/weather")
    public ResponseEntity<Object> weather() {
        try {
            List weather = this.gameServerProxy.getWeather();
            return ResponseHandler.generateResponse("List of weather options", HttpStatus.OK, weather);
        }  catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @GetMapping("/api/v1/gameserver/tracks")
    public ResponseEntity<Object> tracks() {
        try {
            List tracks = this.gameServerProxy.getTracks();
            return ResponseHandler.generateResponse("List of track options", HttpStatus.OK, tracks);
        }  catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @GetMapping("/api/v1/gameserver/liveries")
    public ResponseEntity<Object> liveries() {
        try {
            List liveries = this.gameServerProxy.getLiveries();
            return ResponseHandler.generateResponse("List of livery options", HttpStatus.OK, liveries);
        }  catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @GetMapping("/api/v1/gameserver/vehicles")
    public ResponseEntity<Object> vehicles() {
        try {
            List vehicles = this.gameServerProxy.getVehicles();
            return ResponseHandler.generateResponse("List of vehicle options", HttpStatus.OK, vehicles);
        }  catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @GetMapping("/api/v1/gameserver/vehicle_classes")
    public ResponseEntity<Object> vehicleClasses() {
        try {
            List vehicleClasses = this.gameServerProxy.getVehicleClasses();
            return ResponseHandler.generateResponse("List of vehicle class options", HttpStatus.OK, vehicleClasses);
        }  catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }
}