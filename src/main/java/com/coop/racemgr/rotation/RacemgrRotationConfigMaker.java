package com.coop.racemgr.rotation;

import com.coop.racemgr.gameserver.GameServerProxy;
import com.coop.racemgr.utils.RacemgrUtils;
import org.json.simple.parser.ParseException;

import java.util.ArrayList;
import java.util.List;

// NOTE: Jackson will only work/serialize fields that are either public
// or have a public getter methods
public class RacemgrRotationConfigMaker {
    public boolean persist_index;
    public RacemgrRotationDefaultConfig defaultConfig;
    public List<RacemgrRotationEntry> rotation = new ArrayList<>();

    public RacemgrRotationConfigMaker(GameServerProxy gameServerProxy, int raceCount, boolean allowKarts, boolean persist) throws ParseException {
        this.persist_index = persist;

        List raceVehicleClasses = gameServerProxy.getVehicleClassesFiltered(1, true, allowKarts);
        String raceVehicleClassId = RacemgrUtils.getValueFromObj("name", raceVehicleClasses.get(0));

        // Technically this needs to be called "default", but that's a reserved word. We rename later.
        // We like to force 1 vehicle class per race night/event. This could also be randomized later though.
        this.defaultConfig = new RacemgrRotationDefaultConfig(raceVehicleClassId);

        RacemgrRotationGenerator generator = new RacemgrRotationGenerator(gameServerProxy);
        var raceRotation = generator.generateRaceRotation(raceCount, allowKarts);
        raceRotation.forEach(rotationEntry -> {
            this.addRotationEntry(rotationEntry);
        });
    }

    private void addRotationEntry(RacemgrRotationEntry rotationEntry) {
        rotation.add(rotationEntry);
    }
}