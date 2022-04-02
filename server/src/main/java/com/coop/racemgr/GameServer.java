package com.coop.racemgr;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

// https://code.google.com/archive/p/json-simple/
// https://www.geeksforgeeks.org/parse-json-java/
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.*;

import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Component
public class GameServer {
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

        return this.serverResponseToJson(response);
    }

    private List serverResponseToJson(String jsonString) {
        Object obj = null;
        try {
            obj = new JSONParser().parse(jsonString);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        JSONObject jo = (JSONObject) obj;
        JSONObject joResponse = (JSONObject) jo.get("response");
        JSONArray jsonArr = (JSONArray) joResponse.get("list");
        return RacemgrUtils.jsonArrToList(jsonArr);
    }

    public String getDataApiUrl(String endpoint) {
        return this.gameServerListBaseUrl + "/" + endpoint;
    }

    public List getTracks(int count, boolean random) throws ParseException {
        String endpoint = GameServerEndpoints.TRACKS.getEndpoint();
        String apiUrl = this.getDataApiUrl(endpoint);
        List apiData = this.getData(apiUrl);
        return RacemgrUtils.filterList(apiData, count, random);
    }

    public List getVehicles(int count, boolean random) throws ParseException {
        String endpoint = GameServerEndpoints.VEHICLES.getEndpoint();
        String apiUrl = this.getDataApiUrl(endpoint);
        List apiData = this.getData(apiUrl);
        return RacemgrUtils.filterList(apiData, count, random);
    }

    public List getLiveries(int count, boolean random) throws ParseException {
        String endpoint = GameServerEndpoints.LIVERIES.getEndpoint();
        String apiUrl = this.getDataApiUrl(endpoint);
        List apiData = this.getData(apiUrl);
        return RacemgrUtils.filterList(apiData, count, random);
    }

    public List getVehicleClasses(int count, boolean random) throws ParseException {
        String endpoint = GameServerEndpoints.VEHICLE_CLASSES.getEndpoint();
        String apiUrl = this.getDataApiUrl(endpoint);
        List apiData = this.getData(apiUrl);
        return RacemgrUtils.filterList(apiData, count, random);
    }

    private List weatherWithoutRain(List weatherData) {
        List<String> rainyWeatherNames = Arrays.asList(
            "LightRain",
            "FogWithRain",
            "HeavyFogWithRain",
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