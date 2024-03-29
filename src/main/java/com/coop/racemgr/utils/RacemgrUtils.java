package com.coop.racemgr.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.collect.Lists;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

public class RacemgrUtils {
    public static List jsonArrToList(JSONArray jsonArr) {
        return Lists.newArrayList(jsonArr);
    }

    public static List filterList(List incomingLIst, int count, boolean random) {
        List filteredList;
        if (random) {
            filteredList = RacemgrUtils.getRandomElement(incomingLIst, count);
        } else {
            filteredList = incomingLIst.subList(0, count);
        }
        return filteredList;
    }

    public static ArrayList getRandomElement(List list, int totalItems) {
        int listSize = list.size();
        int count = totalItems > listSize ? listSize : totalItems;

        Random rand = new Random();
        List newList = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            // Random index between 0 to size of given List
            int randomIndex = rand.nextInt(list.size());
            newList.add(list.get(randomIndex));
            list.remove(randomIndex); //Don't select again
        }

        return (ArrayList) newList;
    }

    // NOTE: This does read the whole file into memory, fine for our small files
    public static void replaceStringInFile(File file, String search, String replace) {
        try {
            FileReader fr = new FileReader(file);
            String s;
            String totalStr = "";
            try (BufferedReader br = new BufferedReader(fr)) {
                while ((s = br.readLine()) != null) {
                    totalStr += s + "\r\n";
                }
                totalStr = totalStr.replaceAll(search, replace);
                FileWriter fw = new FileWriter(file);
                fw.write(totalStr);
                fw.close();
            }
        } catch(Exception e){
            e.printStackTrace();
        }
    }

    public static String getValueFromObj(String key, Object obj, String defaultValue) {
        String val;
        try {
            val = String.valueOf(RacemgrUtils.getValueFromObj(key, obj));
            if (val == null || val.trim().equals("")) {
                val = defaultValue;
            }
        } catch (Exception e) {
            val = defaultValue;
        }
        return val;
    }

    public static String getValueFromObj(String key, Object obj) {
        ObjectMapper mapper = new ObjectMapper();
        String val = null;
        try {
            String objStr = mapper.writeValueAsString(obj);
            ObjectNode node = new ObjectMapper().readValue(objStr, ObjectNode.class);
            val = node.get(key).textValue();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return val;
    }

    public static Object jsonStrToObj (String jsonString) {
        Object obj = null;
        try {
            obj = new JSONParser().parse(jsonString);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return obj;
    }

    public static void wait(int ms) {
        try {
            Thread.sleep(ms);
        } catch(InterruptedException ex) {
            Thread.currentThread().interrupt();
        }
    }

    public static String getCurrentDateTime() {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd 'at' HH:mm:ss z");
        Date date = new Date(System.currentTimeMillis());
        return formatter.format(date);
    }

    public static String getXsrfToken(String raceMgrBaseUrl) {
        var xsrfUrl = raceMgrBaseUrl + "api";

        WebClient webClient = WebClient.create();
        final AtomicReference<String> xsrfToken = new AtomicReference<>();
        webClient.get()
            .uri(xsrfUrl)
            .retrieve()
            .onStatus(HttpStatus::is2xxSuccessful, r -> {
                xsrfToken.set(r.cookies().get("XSRF-TOKEN").get(0).getValue());
                return Mono.empty();
            })
            .bodyToMono(String.class)
            .block();

        return String.valueOf(xsrfToken);
    }

    public static String getJwt(String raceMgrBaseUrl) {
        String adminUser = System.getenv("RM_ADMIN_USER");
        String adminPassword = System.getenv("RM_ADMIN_PASSWORD");

        Map<String, String> bodyMap = new HashMap();
        bodyMap.put("username", adminUser);
        bodyMap.put("password", adminPassword);

        WebClient webClient = WebClient.create();

        var authUrl = raceMgrBaseUrl + "api/v1/authenticate";
        var xsrfToken = RacemgrUtils.getXsrfToken(raceMgrBaseUrl);

        var response = webClient.post()
                .uri(authUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .headers(httpHeaders -> httpHeaders.set("X-XSRF-TOKEN", xsrfToken))
                .cookies(cookies -> cookies.add("XSRF-TOKEN", xsrfToken))
                .body(BodyInserters.fromValue(bodyMap))
                .retrieve()
                .bodyToMono(JSONObject.class)
                .block();

        Object obj = RacemgrUtils.jsonStrToObj(String.valueOf(response));
        JSONObject jo = (JSONObject) obj;
        JSONObject joResponse = (JSONObject) jo.get("data");
        var jwt = RacemgrUtils.getValueFromObj("token", joResponse);

        return jwt;
    }
}
