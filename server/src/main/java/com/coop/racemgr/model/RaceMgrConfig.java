package com.coop.racemgr.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document("racemgr_config")
public class RaceMgrConfig {
    String serverName;
    String activeRaceSessionId;
    String activeRaceRotationId;
}
