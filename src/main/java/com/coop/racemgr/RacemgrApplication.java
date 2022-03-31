package com.coop.racemgr;

import com.google.common.collect.Lists;
import org.json.simple.parser.ParseException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.List;

@SpringBootApplication
public class RacemgrApplication {

	public static void main(String[] args) throws ParseException {
		SpringApplication.run(RacemgrApplication.class, args);

		RacemgrRotationGenerator generator = new RacemgrRotationGenerator();
		GameServer gameServer = new GameServer();
		var tracks = gameServer.getTracks();

		// take a random element from list and print them
		System.out.println(generator.getRandomElement(tracks, 3));
	}

}
