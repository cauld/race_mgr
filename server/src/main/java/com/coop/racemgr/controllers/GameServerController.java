package com.coop.racemgr.controllers;

import com.coop.racemgr.gameserver.GameServerMgr;
import com.coop.racemgr.utils.RacemgrUtils;

import org.json.simple.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class GameServerController {
    public enum ServerStatuses {
        start, restart, stop;
    }

    @GetMapping("/api/v1/gameserver")
    public ResponseEntity<Object> gameserver() throws InterruptedException, IOException {
        JSONObject response = new JSONObject();
        response.put("isRunning", GameServerMgr.isRunning());
        return ResponseHandler.generateResponse("Current external game server status", HttpStatus.OK, response);
    }

    @PostMapping("/api/v1/gameserver")
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
            System.out.println(msg);
            return ResponseHandler.generateResponse(msg, HttpStatus.BAD_REQUEST, null);
        }

        return ResponseHandler.generateResponse("Server status changed!", HttpStatus.OK, null);
    }
}