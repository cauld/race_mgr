package com.coop.racemgr.rotation;

// NOTE: Jackson will only work/serialize fields that are either public
// or have a public getter methods
public class RacemgrRotationEntry {
    public String TrackId;
    // public int QualifyWeatherSlots;
    public String QualifyWeatherSlot1;
    public String QualifyWeatherSlot2;
    // public int RaceWeatherSlots;
    public String RaceWeatherSlot1;
    public String RaceWeatherSlot2;

    // Right now we are just always using 2 weather slots
    public RacemgrRotationEntry(String trackId, String qualifyWeatherSlot1, String qualifyWeatherSlot2,
                                String raceWeatherSlot1, String raceWeatherSlot2) {
        this.TrackId = trackId;
        // this.QualifyWeatherSlots = qualifyWeatherSlots;
        this.QualifyWeatherSlot1 = qualifyWeatherSlot1;
        this.QualifyWeatherSlot2 = qualifyWeatherSlot2;
        // this.RaceWeatherSlots = raceWeatherSlots;
        this.RaceWeatherSlot1 = raceWeatherSlot1;
        this.RaceWeatherSlot2 = raceWeatherSlot2;
    }
}