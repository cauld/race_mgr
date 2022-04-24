package com.coop.racemgr.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document("races")
public class Race {
    @Id
    public String id;
    @Indexed(unique=true)
    public String race_id;
    public String start_time;
    public String end_time;
    public Boolean finished;
    public Integer index;

    // We may want to further model the nested objects below but there is some variability in the
    // properties plus we aren't using in the backend, just storing and returning to the UI for now.
    public JSONObject members;
    public JSONObject participants;
    public JSONObject setup;
    public JSONObject stages;

    public void setRaceId() {
        this.race_id = this.end_time;
    }
}