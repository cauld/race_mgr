package com.coop.racemgr.entities;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "race_participant")
public class RaceParticipant {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long raceParticipantId;
    public Long raceId;
    public Integer isPlayer;
    public String name;
    public Integer refId;
    public Integer vehicleId;

    public RaceParticipant() {
    }

    public RaceParticipant(Long raceParticipantId, Long raceId, Integer isPlayer, String name, Integer refId, Integer vehicleId) {
        this.raceParticipantId = raceParticipantId;
        this.raceId = raceId;
        this.isPlayer = isPlayer;
        this.name = name;
        this.refId = refId;
        this.vehicleId = vehicleId;
    }

    //get & set methods
}