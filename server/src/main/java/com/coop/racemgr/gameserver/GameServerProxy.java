package com.coop.racemgr.gameserver;

import com.coop.racemgr.utils.RacemgrUtils;
import org.apache.commons.io.FileUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Component
public class GameServerProxy {
    final private String gameServerHost = System.getenv("RM_GAMESERVER_HOST"); // e.g. localhost
    final private String gameServerPort = System.getenv("RM_GAMESERVER_PORT");

    // e.g. http://localhost:9000/api
    final private String gameServerBaseUrl = "http://" + gameServerHost + ":" + gameServerPort + "/api";
    // All the interesting game data generally hangs off the /lists endpoint
    final private String gameServerListBaseUrl = gameServerBaseUrl + "/list";

    // @TODO: Support game server basic auth
    // @TODO: Add error handling
    private List getData(String url) {
        //https://stackoverflow.com/a/62863017
        WebClient webClient = WebClient.create();
        String response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return this.serverResponseToJson(String.valueOf(response));
    }

    private List serverResponseToJson(String jsonString) {
        Object obj = RacemgrUtils.jsonStrToObj(jsonString);
        JSONObject jo = (JSONObject) obj;
        JSONObject joResponse = (JSONObject) jo.get("response");
        JSONArray jsonArr = (JSONArray) joResponse.get("list");
        return RacemgrUtils.jsonArrToList(jsonArr);
    }

    public String getDataApiUrl(String endpoint) {
        return this.gameServerListBaseUrl + "/" + endpoint;
    }

    public List getTracks(int count, boolean random, boolean allowKarts) throws ParseException {
        String endpoint = GameServerEndpoints.TRACKS.getEndpoint();
        String apiUrl = this.getDataApiUrl(endpoint);
        List apiData = this.getData(apiUrl);
        if (allowKarts == false) {
            apiData = withoutKartTracks(apiData);
        }
        return RacemgrUtils.filterList(apiData, count, random);
    }

    private List withoutKartTracks(List tracks) {
        Predicate byTrack = trackElement -> {
            String track = RacemgrUtils.getValueFromObj("name", trackElement);
            return !track.toLowerCase().contains("kart") && !track.toLowerCase().contains("speedland");
        };
        var filteredTracks = tracks.stream().filter(byTrack)
                .collect(Collectors.toList());
        return (List) filteredTracks;
    }

    public List getVehicles(int count, boolean random) throws ParseException {
        String endpoint = GameServerEndpoints.VEHICLES.getEndpoint();
        String apiUrl = this.getDataApiUrl(endpoint);
        List apiData = this.getData(apiUrl);
        return RacemgrUtils.filterList(apiData, count, random);
    }

    public List getLiveries(int count, boolean random) {
        String endpoint = GameServerEndpoints.LIVERIES.getEndpoint();
        String apiUrl = this.getDataApiUrl(endpoint);
        List apiData = this.getData(apiUrl);
        return RacemgrUtils.filterList(apiData, count, random);
    }

    public List getVehicleClasses(int count, boolean random, boolean allowKarts) throws ParseException {
        String endpoint = GameServerEndpoints.VEHICLE_CLASSES.getEndpoint();
        String apiUrl = this.getDataApiUrl(endpoint);
        List apiData = this.getData(apiUrl);
        if (allowKarts == false) {
            apiData = vehicleClassesWithoutKarts(apiData);
        }
        return RacemgrUtils.filterList(apiData, count, random);
    }

    private List vehicleClassesWithoutKarts(List vehicleClasses) {
        Predicate byVehicleClass = vehicleClassElement -> {
            String vehicleClass = RacemgrUtils.getValueFromObj("name", vehicleClassElement);
            return !vehicleClass.toLowerCase().contains("kart");
        };
        var filteredVehicleClasses = vehicleClasses.stream().filter(byVehicleClass)
                .collect(Collectors.toList());
        return (List) filteredVehicleClasses;
    }

    public Object getRotation() throws IOException {
        String gameServerFsPath = System.getenv("RM_PATH_TO_DEDICATED_SERVER");
        String gameServerDefaultRotationFilePath = gameServerFsPath + "\\lua\\sms_rotate\\sms_rotate_default_config.json";
        File file = new File(gameServerDefaultRotationFilePath);
        String jsonString = FileUtils.readFileToString(file, "UTF-8");
        Object obj = RacemgrUtils.jsonStrToObj(jsonString);
        return obj;
    }

    public JSONObject getStats() throws IOException, ParseException {
        String gameServerFsPath = System.getenv("RM_PATH_TO_DEDICATED_SERVER");
        String gameServerStatsFilePath = gameServerFsPath + "\\lua_config\\sms_stats_data.json";
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

    private List weatherWithoutRain(List weatherData) {
        List<String> rainyWeatherNames = Arrays.asList(
            "LightRain",
            "FogWithRain",
            "HeavyFogWithRain",
            "HeavyFog",
            "ThunderStorm",
            "Rain",
            "Storm",
            "Random"
        );

        Predicate byWeather = weatherElement -> {
            String weather = RacemgrUtils.getValueFromObj("name", weatherElement);
            return !rainyWeatherNames.contains(weather);
        };
        var filteredWeather = weatherData.stream().filter(byWeather)
                .collect(Collectors.toList());
        return (List) filteredWeather;
    }


    public List getWeather(int count, boolean random, boolean withoutRain) throws ParseException {
        String endpoint = GameServerEndpoints.WEATHER.getEndpoint();
        String apiUrl = this.getDataApiUrl(endpoint);
        List apiData = this.getData(apiUrl);
        List filteredApiData = apiData;
        if (withoutRain) {
            filteredApiData = this.weatherWithoutRain(apiData);
        }

        return RacemgrUtils.filterList(filteredApiData, count, random);
    }
}