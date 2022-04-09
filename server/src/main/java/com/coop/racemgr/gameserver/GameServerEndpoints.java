package com.coop.racemgr.gameserver;

public enum GameServerEndpoints
{
    TRACKS("tracks"),
    VEHICLES("vehicles"),
    LIVERIES("liveries"),
    VEHICLE_CLASSES("vehicle_classes"),
    WEATHER("enums/weather");

    private String endpoint;

    GameServerEndpoints(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getEndpoint() {
        return endpoint;
    }
}