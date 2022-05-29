package com.coop.racemgr.model;

import com.google.common.hash.Hashing;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.nio.charset.StandardCharsets;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document("races")
public class Race {
    @Id
    public String id;
    @Indexed(unique=true)
    public String race_id;
    public String race_session_id;
    public String race_rotation_id;
    public String start_time;
    public String end_time;
    public Boolean finished;
    public Integer index;

    // We may want to further model the nested objects below but there is some variability in the
    // properties plus we aren't using in the backend, just storing and returning to the UI for now.
    public JSONObject members;
    // Would be better as JSONArray or JSONObject but the dedicated server is inconsistent/buggy
    public Object participants;
    public JSONObject setup;
    public JSONObject stages;

    // We need to create a unique string to act as the race id
    // We do this by combining and hashing the event dates and index.
    // Indexes can be recycled when the file is replaced, but we should
    // never have the same times and index.
    public void setRaceId() {
        String key = this.start_time + this.end_time + this.index.toString();
        String raceId = Hashing.sha256()
                .hashString(key, StandardCharsets.UTF_8)
                .toString();
        this.race_id = raceId;
    }

    public void setRaceSessionId(String raceSessionId) {
        this.race_session_id = raceSessionId;
    }

    public void setRaceRotationId(String raceRotationId) {
        this.race_rotation_id = raceRotationId;
    }
}