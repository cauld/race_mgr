package com.coop.racemgr.entities;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "race_stage_event")
public class RaceStageEvent {
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long raceStageEventId;
    public Long raceStageId;

    // NOTE: Fields below here are named to match the event log to ease objectmapper linkages
    public String NewState;
    public String PreviousState;
    public String event_name;
    public String is_player;
    public String name;
    public String participantid;
    public String refid;
    public String time;

    public RaceStageEvent() {}
}