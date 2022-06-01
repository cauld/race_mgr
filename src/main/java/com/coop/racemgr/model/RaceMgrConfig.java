package com.coop.racemgr.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

// @NOTE: This will only have 1 record as it is basically just server config
@Data
@Document("config")
public class RaceMgrConfig {
    // @TODO support all the normal game server configs
    @JsonIgnore
    String id;
    String serverName;
    String activeRaceSessionId;
    String activeRaceRotationId;
    Long updated;

    public RaceMgrConfig(String serverName, String activeRaceSessionId, String activeRaceRotationId) {
        this.id = "1"; // There's only every one config document
        this.serverName = serverName;
        this.activeRaceSessionId = activeRaceSessionId;
        this.activeRaceRotationId = activeRaceRotationId;
    }
}
