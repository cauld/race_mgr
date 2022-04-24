package com.coop.racemgr;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@EnableScheduling
public class SpringConfiguration {
//    @Bean
//    public RaceEventProcessor raceEventProcessor() {
//        return new RaceEventProcessor();
//    }

    private WebClient eventProcessingClient = WebClient.create();

    // NOTE: This calls the self-hosted REST endpoint that triggers event process. It has
    // a 1s delay for the first call and then calls 1s after each execution completes.
    // Would be nice to call the event processor directly, but I haven't figured out how
    // to autowire the repository outside of the rest controller class yet.
    // Ref: https://www.baeldung.com/spring-scheduled-tasks
    @Scheduled(fixedDelay = 1000)
    public void scheduleFixedDelayTask() {
        this.eventProcessingClient.post()
            .uri("http://localhost:8080/api/v1/race/events")
            .retrieve()
            .bodyToMono(String.class)
            .block();
    }
}
