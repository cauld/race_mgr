package com.coop.racemgr.entities;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "race_stage")
public class RaceStage {
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long raceStageId;
    public Long raceId;
    public String stageName;
    public String endTime;

    public RaceStage() {
    }

    public RaceStage(Long raceStageId, Long raceId, String stageName, String endTime) {
        this.raceStageId = raceStageId;
        this.raceId = raceId;
        this.stageName = stageName;
        this.endTime = endTime;
    }
}