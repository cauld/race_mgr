package com.coop.racemgr.jobs;

import com.coop.racemgr.gameserver.GameServerProxy;
import com.coop.racemgr.model.Race;
import com.coop.racemgr.repositories.RaceMgrConfigRepository;
import com.coop.racemgr.repositories.RaceRepository;
import com.coop.racemgr.utils.RacemgrUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.util.Iterator;

public class RaceEventProcessor {
    private RaceRepository raceRepository;
    private RaceMgrConfigRepository raceMgrConfigRepository;
    private GameServerProxy gameServerProxy;

    // @FIXME: Figure out how to autowire these
    public RaceEventProcessor(RaceRepository raceRepository, RaceMgrConfigRepository raceMgrConfigRepository) {
        this.gameServerProxy = new GameServerProxy();
        this.raceRepository = raceRepository;
        this.raceMgrConfigRepository = raceMgrConfigRepository;
    }

    // NOTE: The game server decides when to prune event history. To avoid losing data
    // between crashes and restarts we reprocess/check all events per cycle. Only unseen
    // events are saved. For performance, it is good to set the game server
    public void processRaces() throws IOException, ParseException {
        var currentRmc = raceMgrConfigRepository.findItemById("1");
        if (currentRmc == null || currentRmc.getActiveRaceSessionId() == "" || currentRmc.getActiveRaceRotationId() == "") {
            System.out.println("WARNING: Event processing skipped! Need activeRaceSessionId & activeRaceRotationId set in server config!");
        }  else {
            JSONObject stats = this.gameServerProxy.getStats();
            JSONArray history = (JSONArray) stats.get("history");

            Iterator<JSONObject> iterator = history.iterator();
            while (iterator.hasNext()) {
                var raceData = iterator.next();
                ObjectMapper objectMapper = new ObjectMapper();

                // We have to help the parser out. It can't handle a JSONArray of JSONObjects
                // on it's own it seems when deserializing from the string. Fix manually
                // before the readValue below.
                var participants = raceData.get("participants");
                raceData.remove("participants");

                Race race = objectMapper.readValue(raceData.toString(), Race.class);
                race.setParticipants((JSONArray) participants);
                race.setRaceId();
                race.setRaceSessionId(currentRmc.getActiveRaceSessionId());
                race.setRaceRotationId(currentRmc.getActiveRaceRotationId());

                var r = raceRepository.findItemByRaceId(race.getRace_id());
                if (r == null) {
                    raceRepository.save(race);
                }
            }

            System.out.println("Race event processing cycle complete: " + RacemgrUtils.getCurrentDateTime());
        }
    }
}