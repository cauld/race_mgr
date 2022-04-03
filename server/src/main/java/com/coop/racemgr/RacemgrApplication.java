package com.coop.racemgr;

import org.json.simple.parser.ParseException;
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

@SpringBootApplication
public class RacemgrApplication {

	public static void main(String[] args) throws ParseException, IOException {
		SpringApplication app = new SpringApplication(RacemgrApplication.class);
		app.setBannerMode(Banner.Mode.OFF);
		app.run(args);

		//var rotationFileMaker = new RacemgrRotationFileMaker(10, true);
		//rotationFileMaker.writeGeneratedRotationFile();

		Thread gameServerMgr = new Thread(new GameServerMgr());
		gameServerMgr.start();

		RacemgrBanner.print();
		System.out.println("Race Manager running, start your engines!");
	}

}
