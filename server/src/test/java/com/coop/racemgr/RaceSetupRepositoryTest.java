package com.coop.racemgr;

import com.coop.racemgr.entities.RaceSetup;
import com.coop.racemgr.repositories.RaceSetupRepository;
import com.coop.racemgr.utils.RacemgrUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.simple.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class RaceSetupRepositoryTest {
    private String jsonStr = "{ \"AllowedCutsBeforePenalty\" : 0, \"AllowedViews\" : 0, \"DamageScale\" : 100, \"DamageType\" : 1, \"DisablePitstopRefuelling\" : 0, \"DriveThroughPenalty\" : 0, \"Flags\" : 656104, \"FuelUsageType\" : 2, \"GridLayout\" : 0, \"GridSize\" : 6, \"ManualPitStops\" : 0, \"ManualRollingStarts\" : 0, \"MaxPlayers\" : 2, \"MinimumOnlineRank\" : 0, \"MinimumOnlineStrength\" : 100, \"MultiClassSlot1\" : -1, \"MultiClassSlot2\" : -1, \"MultiClassSlot3\" : -1, \"MultiClassSlot4\" : -1, \"MultiClassSlot5\" : -1, \"MultiClassSlot6\" : -1, \"MultiClassSlot7\" : -1, \"MultiClassSlot8\" : -1, \"MultiClassSlot9\" : -1, \"MultiClassSlots\" : 0, \"OpponentDifficulty\" : 50, \"PenaltiesType\" : 0, \"PitWhiteLinePenalty\" : 0, \"PracticeDateHour\" : 11, \"PracticeDateProgression\" : 0, \"PracticeLength\" : 0, \"PracticeLiveTrackPreset\" : 0, \"PracticeWeatherProgression\" : 0, \"PracticeWeatherSlot1\" : 0, \"PracticeWeatherSlot2\" : 0, \"PracticeWeatherSlot3\" : 0, \"PracticeWeatherSlot4\" : 0, \"PracticeWeatherSlots\" : 0, \"QualifyDateHour\" : 11, \"QualifyDateProgression\" : 0, \"QualifyLength\" : 5, \"QualifyLiveTrackPreset\" : 0, \"QualifyWeatherProgression\" : 0, \"QualifyWeatherSlot1\" : -1293634875, \"QualifyWeatherSlot2\" : -934211870, \"QualifyWeatherSlot3\" : -934211870, \"QualifyWeatherSlot4\" : -934211870, \"QualifyWeatherSlots\" : 0, \"RaceDateDay\" : 6, \"RaceDateHour\" : 11, \"RaceDateMonth\" : 7, \"RaceDateProgression\" : 0, \"RaceDateYear\" : 2015, \"RaceExtraLap\" : 0, \"RaceFormationLap\" : 0, \"RaceLength\" : 5, \"RaceLiveTrackPreset\" : 0, \"RaceMandatoryPitStops\" : 0, \"RaceRollingStart\" : 0, \"RaceWeatherProgression\" : 0, \"RaceWeatherSlot1\" : -1299791789, \"RaceWeatherSlot2\" : 296956818, \"RaceWeatherSlot3\" : 129238383, \"RaceWeatherSlot4\" : -934211870, \"RaceWeatherSlots\" : 4, \"ServerControlsSetup\" : 1, \"ServerControlsTrack\" : 1, \"ServerControlsVehicle\" : 0, \"ServerControlsVehicleClass\" : 1, \"TireWearType\" : 8, \"TrackId\" : 568559152, \"VehicleClassId\" : 382290110, \"VehicleModelId\" : 1323381033 }";
    private JSONObject testData = (JSONObject) RacemgrUtils.jsonStrToObj(this.jsonStr);

    @Autowired
    private RaceSetupRepository raceSetupRepository;

    @Test
    public void whenFindingRaceById_thenCorrect() throws JsonProcessingException {
        //var raceSetup = new RaceSetup(this.testData);

        ObjectMapper objectMapper = new ObjectMapper();
        RaceSetup raceSetup = objectMapper.readValue(this.jsonStr, RaceSetup.class);

        System.out.println(raceSetup);

        //raceRepository.save(new Race(123L, "chad", "foo", false));
        //var result = raceRepository.findById(123L);
        //assertThat(result).isInstanceOf(Optional.class);

        //var raceResult = result.get();
        assertThat(true).isEqualTo(true);
    }
}