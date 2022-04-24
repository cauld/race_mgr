package com.coop.racemgr.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Data
@Document("race_sessions")
public class RaceSession {
    @Id
    public String id;
    @Indexed(unique=true)
    public String name;
    public ArrayList<String> raceRotationIds;
    public Long created;
    public Long updated;
    public Boolean active;

    public RaceSession(String name, ArrayList<String> raceRotationIds) {
        this.name = name;
        this.raceRotationIds = raceRotationIds;
        this.created = System.currentTimeMillis();
        this.active = true;
    }
}
