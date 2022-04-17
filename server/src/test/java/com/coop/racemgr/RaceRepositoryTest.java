package com.coop.racemgr;

import com.coop.racemgr.entities.Race;
import com.coop.racemgr.repositories.RaceRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class RaceRepositoryTest {

    @Autowired
    private RaceRepository raceRepository;

    @Test
    public void whenFindingRaceById_thenCorrect() {
        raceRepository.save(new Race(123L, "chad", "foo", false));
        var result = raceRepository.findById(123L);
        assertThat(result).isInstanceOf(Optional.class);

        var raceResult = result.get();
        assertThat(raceResult.startTime).isEqualTo("chad");
    }

    @Test
    public void whenFindingAllCustomers_thenCorrect() {
        raceRepository.save(new Race(123L, "chad", "foo", false));
        raceRepository.save(new Race(456L, "chad", "bar", false));
        assertThat(raceRepository.findAll()).isInstanceOf(List.class);
    }
}