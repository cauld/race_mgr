package com.coop.racemgr;

import com.google.common.collect.Lists;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

// https://code.google.com/archive/p/json-simple/
// https://www.geeksforgeeks.org/parse-json-java/
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.*;

import java.util.List;

@Component
public class GameServer {
    private String gameServerHost = System.getenv("RM_GAMESERVER_HOST"); // e.g. localhost
    private String gameServerPort = System.getenv("RM_GAMESERVER_PORT");
    // e.g. http://localhost:9000/api
    private String gameServerBaseUrl = "http://" + gameServerHost + ":" + gameServerPort + "/api";
    // All the interesting game data generally hangs off the /lists endpoint
    private String gameServerListBaseUrl = gameServerBaseUrl + "/list";

    // @TODO: Support game server basic auth
    // @TODO: Add error handling
    private List getData(String url) throws ParseException {
        //https://stackoverflow.com/a/62863017
        WebClient webClient = WebClient.create();
        String response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return this.serverResponseToJson(response);
    }

    private List serverResponseToJson(String jsonString) throws ParseException {
        Object obj = new JSONParser().parse(jsonString);
        JSONObject jo = (JSONObject) obj;
        JSONObject joResponse = (JSONObject) jo.get("response");
        JSONArray jsonArr = (JSONArray) joResponse.get("list");
        List data = this.jsonArrToList(jsonArr);
        return data;
    }

    private List jsonArrToList(JSONArray jsonArr) {
        List list = Lists.newArrayList(jsonArr);
        return list;
    }

    public String getDataApiUrl(String endpoint) {
        return this.gameServerListBaseUrl + "/" + endpoint;
    }

    public List getTracks() throws ParseException {
        String endpoint = GameServerEndpoints.TRACKS.getEndpoint();
        String apiUrl = this.getDataApiUrl(endpoint);
        return this.getData(apiUrl);
    }

    public List getVehicles() throws ParseException {
        String endpoint = GameServerEndpoints.VEHICLES.getEndpoint();
        String apiUrl = this.getDataApiUrl(endpoint);
        return this.getData(apiUrl);
    }

    public List getLiveries() throws ParseException {
        String endpoint = GameServerEndpoints.LIVERIES.getEndpoint();
        String apiUrl = this.getDataApiUrl(endpoint);
        return this.getData(apiUrl);
    }

    public List getVehicleClasses() throws ParseException {
        String endpoint = GameServerEndpoints.VEHICLE_CLASSES.getEndpoint();
        String apiUrl = this.getDataApiUrl(endpoint);
        return this.getData(apiUrl);
    }

    public List getWeather() throws ParseException {
        String endpoint = GameServerEndpoints.WEATHER.getEndpoint();
        String apiUrl = this.getDataApiUrl(endpoint);
        return this.getData(apiUrl);
    }
}