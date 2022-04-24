package com.coop.racemgr.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.collect.Lists;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

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
}
