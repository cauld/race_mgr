package com.coop.racemgr;

import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

// @TODO: Support no karts and or karts only on kart tracks
public class RacemgrRotationGenerator {
    GameServer gameServer;
    public RacemgrRotationGenerator(GameServer gameServer) {
        this.gameServer = gameServer;
    }

    public List<RacemgrRotationEntry> generateRaceRotation(int raceCount) throws ParseException {
        // We like each event/round of racing to use the same vehicle class
        var vehiclesClasses = gameServer.getVehicleClasses(1, true);
        // Each entry gets a new track
        var tracks = this.gameServer.getTracks(raceCount, true);

        List<RacemgrRotationEntry> rotatationEntries = new ArrayList<>();
        for (int i=0; i<raceCount - 1; i++) {
            var trackObj = tracks.remove(0);
            var trackName = RacemgrUtils.getValueFromObj("name", trackObj);
            var weatherObjs = gameServer.getWeather(2, true, true);
            var weatherName1 = RacemgrUtils.getValueFromObj("name", weatherObjs.get(0));
            var weatherName2 = RacemgrUtils.getValueFromObj("name", weatherObjs.get(1));
            var rotationEntry = new RacemgrRotationEntry(trackName, weatherName1, weatherName2, weatherName1, weatherName2);
            rotatationEntries.add(rotationEntry);
        }

        return rotatationEntries;
    }
}