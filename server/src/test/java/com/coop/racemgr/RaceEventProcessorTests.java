package com.coop.racemgr;

import com.coop.racemgr.jobs.RaceEventProcessor;
import com.coop.racemgr.repositories.RaceRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class RaceEventProcessorTests {

	@Autowired
	private RaceRepository raceRepository;

	RaceEventProcessor raceEventProcessor;

//	@BeforeEach
//	void setUp() {
//		raceEventProcessor = new RaceEventProcessor();
//	}

	@Test
	void demoTestMethod() {
		assertTrue(true);
	}
}
