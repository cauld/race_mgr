package com.coop.racemgr.jobs;

import com.coop.racemgr.model.Race;
import com.coop.racemgr.repositories.RaceRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.FileUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;

public class RaceEventProcessor {
    RaceRepository raceRepository;

    public RaceEventProcessor(RaceRepository raceRepository) {
        this.raceRepository = raceRepository;
    }

    //@TODO: replace with GameServerProxy getStats
    private JSONObject getStats() throws IOException, ParseException {
        String gameServerStatsFilePath = "C:\\Users\\admin\\Downloads\\sms_stats_data040122.json";
        File file = new File(gameServerStatsFilePath);
        String dataString = FileUtils.readFileToString(file, "UTF-8");
        // The file is JSON-ish, but has comments that need removed before parsing
        var jsonStart = dataString.indexOf("{");
        var jsonEnd = dataString.lastIndexOf("}");
        var jsonString = dataString.substring(jsonStart, jsonEnd + 1);
        JSONParser parser = new JSONParser();
        JSONObject jsonObject = (JSONObject) parser.parse(jsonString);
        JSONObject stats = (JSONObject) jsonObject.get("stats");
        return stats;
    }

    public void processRaces() throws IOException, ParseException {
        JSONObject stats = getStats();
        JSONArray history = (JSONArray) stats.get("history");

        Iterator<JSONObject> iterator = history.iterator();
        while (iterator.hasNext()) {
            var raceData = iterator.next();
            ObjectMapper objectMapper = new ObjectMapper();
            Race race = objectMapper.readValue(raceData.toString(), Race.class);
            this.raceRepository.save(race);
        }
    }
}