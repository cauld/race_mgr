package com.coop.racemgr;

import com.coop.racemgr.gameserver.GameServerMgr;
import org.json.simple.parser.ParseException;
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import java.io.IOException;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "com.coop.racemgr")
public class RacemgrApplication {
	public static void main(String[] args) throws IOException, ParseException {
		SpringApplication app = new SpringApplication(RacemgrApplication.class);
		app.setBannerMode(Banner.Mode.OFF);
		app.run(args);

		Thread gameServerMgr = new Thread(new GameServerMgr());
		gameServerMgr.start();

		RacemgrBanner.print();
		System.out.println("Race Manager running, start your engines!");
	}
}
