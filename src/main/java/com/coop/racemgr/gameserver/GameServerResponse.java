package com.coop.racemgr.gameserver;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GameServerResponse {
    public Object response;
}