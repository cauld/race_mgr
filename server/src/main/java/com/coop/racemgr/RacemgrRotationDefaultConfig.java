package com.coop.racemgr;

// NOTE: Jackson will only work/serialize fields that are either public
// or have a public getter methods
public class RacemgrRotationDefaultConfig {
    // Grid size up to 32, all reserved to players, so no AI.
    // Note that 32-bit clients will not be able to join the game if this is larger than 16.
    public int PracticeLength = 0;
    public int QualifyLength = 5;
    public int RaceLength = 5;
    public String VehicleClassId;
    public String Flags = "ALLOW_CUSTOM_VEHICLE_SETUP,ABS_ALLOWED,SC_ALLOWED,TCS_ALLOWED,FILL_SESSION_WITH_AI,AUTO_START_ENGINE";
    public String DamageType = "VISUAL_ONLY";
    public String TireWearType = "OFF";
    public String FuelUsageType = "OFF";
    public String PenaltiesType = "NONE";
    public String AllowedViews = "Any";

    public int QualifyDateHour = 9;
    public int QualifyDateProgression = 30;

    // Weather slots: between 1 and 4 slots. Using these slots, the race setup will feed a weather timeline into the weather system.
    // Each slot represents what the weather will be at the top of every hour with slot 1 being the race start time slot 2 race
    // start time +1 hour and so on. We repeat this cycle over a 24 hour period.
    // Good explanation - https://www.projectcarsgame.com/two/blog/the_insiders_guide/episode-25-weather-configuration/
    public int QualifyWeatherSlots = 2;
    public String QualifyWeatherSlot1 = "Clear";
    public String QualifyWeatherSlot2 = "Clear";

    public int RaceWeatherSlots = 2;
    public String RaceWeatherSlot1 = "Clear";
    public String RaceWeatherSlot2 = "Clear";

    // public int RaceDateYear = 2015;
    // public int RaceDateMonth = 7;
    // public int RaceDateDay = 6;
    // public int RaceDateHour = 14;
    public int RaceDateProgression = 30;

    public RacemgrRotationDefaultConfig(String raceVehicleClassId) {
        this.VehicleClassId = raceVehicleClassId;
    }
}
