package com.coop.racemgr.rotation;

import com.coop.racemgr.utils.RacemgrUtils;
import com.coop.racemgr.gameserver.GameServerProxy;
import org.json.simple.parser.ParseException;

import java.util.ArrayList;
import java.util.List;

// @TODO: Support no karts and or karts only on kart tracks
public class RacemgrRotationGenerator {
    GameServerProxy gameServerProxy;
    public RacemgrRotationGenerator(GameServerProxy gameServerProxy) {
        this.gameServerProxy = gameServerProxy;
    }

    public List<RacemgrRotationEntry> generateRaceRotation(int raceCount, boolean allowKarts) throws ParseException {
        // We like each event/round of racing to use the same vehicle class
        var vehiclesClasses = gameServerProxy.getVehicleClasses(1, true, allowKarts);
        // Each entry gets a new track
        var tracks = this.gameServerProxy.getTracks(raceCount, true, allowKarts);

        List<RacemgrRotationEntry> rotatationEntries = new ArrayList<>();
        for (int i=0; i<raceCount - 1; i++) {
            var trackObj = tracks.remove(0);
            var trackName = RacemgrUtils.getValueFromObj("name", trackObj);
            var weatherObjs = gameServerProxy.getWeather(2, true, true);
            var weatherName1 = RacemgrUtils.getValueFromObj("name", weatherObjs.get(0));
            var weatherName2 = RacemgrUtils.getValueFromObj("name", weatherObjs.get(1));
            var rotationEntry = new RacemgrRotationEntry(trackName, weatherName1, weatherName2, weatherName1, weatherName2);
            rotatationEntries.add(rotationEntry);
        }

        return rotatationEntries;
    }
}