package com.coop.racemgr;

import org.json.simple.parser.ParseException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

@SpringBootApplication
public class RacemgrApplication {

	public static void main(String[] args) throws ParseException, IOException {
		SpringApplication.run(RacemgrApplication.class, args);

		var rotationFileMaker = new RacemgrRotationFileMaker(10, true);
		rotationFileMaker.writeGeneratedRotationFile();
	}

}
