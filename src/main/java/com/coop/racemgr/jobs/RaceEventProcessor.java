package com.coop.racemgr.jobs;

import com.coop.racemgr.RacemgrApplication;
import com.coop.racemgr.gameserver.GameServerProxy;
import com.coop.racemgr.model.Race;
import com.coop.racemgr.repositories.RaceMgrConfigRepository;
import com.coop.racemgr.repositories.RaceRepository;
import com.coop.racemgr.utils.RacemgrUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.util.Iterator;

public class RaceEventProcessor {
    private RaceRepository raceRepository;
    private RaceMgrConfigRepository raceMgrConfigRepository;
    private GameServerProxy gameServerProxy;

    private static final Logger logger = LogManager.getLogger(RacemgrApplication.class);

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

            // As long as we have history, process it
            try {
                JSONArray raceHistory = (JSONArray) stats.get("history");

                Iterator<JSONObject> iterator = raceHistory.iterator();
                while (iterator.hasNext()) {
                    var raceData = iterator.next();
                    ObjectMapper objectMapper = new ObjectMapper();
                    Race race = objectMapper.readValue(raceData.toString(), Race.class);
                    race.setRaceId();
                    race.setRaceSessionId(currentRmc.getActiveRaceSessionId());
                    race.setRaceRotationId(currentRmc.getActiveRaceRotationId());

                    var r = raceRepository.findItemByRaceId(race.getRace_id());
                    if (r == null) {
                        raceRepository.save(race);
                    }
                }

                logger.info("Race event processing error: " + RacemgrUtils.getCurrentDateTime());
            } catch (Exception e) {
                // There is no history (race data) present on in the dedicated server
                logger.info("Race event processing, nothing to process yet: " + RacemgrUtils.getCurrentDateTime());
            }
        }
    }
}
