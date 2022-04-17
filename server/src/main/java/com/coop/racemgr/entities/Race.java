package com.coop.racemgr.entities;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "race")
public class Race {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long raceId;
    public String startTime;
    public String endTime;
    public Boolean finished;

    public Race() {
    }

    public Race(Long raceId, String startTime, String endTime, Boolean finished) {
        this.raceId = raceId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.finished = finished;
    }
}