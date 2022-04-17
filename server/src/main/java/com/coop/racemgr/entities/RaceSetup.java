package com.coop.racemgr.entities;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "race_setup")
public class RaceSetup {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long raceSetupId;
    public Long raceId;

    // NOTE: Fields below here are named to match the event log to ease objectmapper linkages
    public Integer AllowedCutsBeforePenalty;
    public Integer AllowedViews;
    public Integer DamageScale;
    public Integer DamageType;
    public Integer DisablePitstopRefuelling;
    public Integer DriveThroughPenalty;
    public Integer Flags;
    public Integer FuelUsageType;
    public Integer GridLayout;
    public Integer GridSize;
    public Integer ManualPitStops;
    public Integer ManualRollingStarts;
    public Integer MaxPlayers;
    public Integer MinimumOnlineRank;
    public Integer MinimumOnlineStrength;
    public Integer MultiClassSlot1;
    public Integer MultiClassSlot2;
    public Integer MultiClassSlot3;
    public Integer MultiClassSlot4;
    public Integer MultiClassSlot5;
    public Integer MultiClassSlot6;
    public Integer MultiClassSlot7;
    public Integer MultiClassSlot8;
    public Integer MultiClassSlot9;
    public Integer MultiClassSlots;
    public Integer OpponentDifficulty;
    public Integer PenaltiesType;
    public Integer PitWhiteLinePenalty;
    public Integer PracticeDateHour;
    public Integer PracticeDateProgression;
    public Integer PracticeLength;
    public Integer PracticeLiveTrackPreset;
    public Integer PracticeWeatherProgression;
    public Integer PracticeWeatherSlot1;
    public Integer PracticeWeatherSlot2;
    public Integer PracticeWeatherSlot3;
    public Integer PracticeWeatherSlot4;
    public Integer PracticeWeatherSlots;
    public Integer QualifyDateHour;
    public Integer QualifyDateProgression;
    public Integer QualifyLength;
    public Integer QualifyLiveTrackPreset;
    public Integer QualifyWeatherProgression;
    public Integer QualifyWeatherSlot1;
    public Integer QualifyWeatherSlot2;
    public Integer QualifyWeatherSlot3;
    public Integer QualifyWeatherSlot4;
    public Integer QualifyWeatherSlots;
    public Integer RaceDateDay;
    public Integer RaceDateHour;
    public Integer RaceDateMonth;
    public Integer RaceDateProgression;
    public Integer RaceDateYear;
    public Integer RaceExtraLap;
    public Integer RaceFormationLap;
    public Integer RaceLength;
    public Integer RaceLiveTrackPreset;
    public Integer RaceMandatoryPitStops;
    public Integer RaceRollingStart;
    public Integer RaceWeatherProgression;
    public Integer RaceWeatherSlot1;
    public Integer RaceWeatherSlot2;
    public Integer RaceWeatherSlot3;
    public Integer RaceWeatherSlot4;
    public Integer RaceWeatherSlots;
    public Integer ServerControlsSetup;
    public Integer ServerControlsTrack;
    public Integer ServerControlsVehicle;
    public Integer ServerControlsVehicleClass;
    public Integer TireWearType;
    public Integer TrackId;
    public Integer VehicleClassId;
    public Integer VehicleModelId;

    public RaceSetup() {}
}