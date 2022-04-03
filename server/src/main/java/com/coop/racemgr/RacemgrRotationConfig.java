package com.coop.racemgr;

import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

// NOTE: Jackson will only work/serialize fields that are either public
// or have a public getter methods
public class RacemgrRotationConfig {
    public boolean persist_index;
    public RacemgrRotationDefaultConfig defaultConfig;
    public List<RacemgrRotationEntry> rotation = new ArrayList<>();

    public RacemgrRotationConfig(GameServerProxy gameServerProxy, int raceCount, boolean persist) throws ParseException, IOException {
        this.persist_index = persist;

        List raceVehicleClasses = gameServerProxy.getVehicleClasses(1, true);
        String raceVehicleClassId = RacemgrUtils.getValueFromObj("name", raceVehicleClasses.get(0));

        // Technically this needs to be called "default", but that's a reserved word. We rename later.
        // We like to force 1 vehicle class per race night/event. This could also be randomized later though.
        this.defaultConfig = new RacemgrRotationDefaultConfig(raceVehicleClassId);

        RacemgrRotationGenerator generator = new RacemgrRotationGenerator(gameServerProxy);
        var raceRotation = generator.generateRaceRotation(raceCount);
        raceRotation.forEach(rotationEntry -> {
            this.addRotationEntry(rotationEntry);
        });
    }

    private void addRotationEntry(RacemgrRotationEntry rotationEntry) {
        rotation.add(rotationEntry);
    }
}