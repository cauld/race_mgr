package com.coop.racemgr.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("race_rotations")
public class RaceRotation {
    @Id
    public String id;
    @Indexed(unique=true)
    public String name;
    public Object config;
    public Long created;
    public Long updated;
    public Boolean active;

    public RaceRotation(String name, Object config) {
        this.name = name;
        this.config = config;
        this.created = System.currentTimeMillis();
        this.active = true;
    }
}
