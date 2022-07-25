package com.coop.racemgr;

import com.coop.racemgr.utils.RacemgrUtils;
import org.json.simple.JSONObject;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableScheduling
@ComponentScan(basePackages = {"com.coop.racemgr"})
public class SpringConfiguration {
//    @Bean
//    public RaceEventProcessor raceEventProcessor() {
//        return new RaceEventProcessor();
//    }

    private String raceMgrBaseUrl = "http://localhost:8080/";

    // NOTE: This calls the self-hosted REST endpoint that triggers event process. It has
    // a 1s delay for the first call and then calls 1s after each execution completes.
    // Would be nice to call the event processor directly, but I haven't figured out how
    // to autowire the repository outside of the rest controller class yet.
    // Ref: https://www.baeldung.com/spring-scheduled-tasks
    @Scheduled(fixedDelay = 1000)
    public void scheduleRaceEventProcessing() {
        // @TODO: Cache and only refresh when the token has expired vs getting with each cycle
        var jwt = RacemgrUtils.getJwt(raceMgrBaseUrl);

        var eventProcessingUrl = raceMgrBaseUrl + "api/v1/admin/race/events";
        var xsrfToken = RacemgrUtils.getXsrfToken(raceMgrBaseUrl);

        WebClient eventProcessingClient = WebClient.create();
        eventProcessingClient.post()
            .uri(eventProcessingUrl)
                .headers(httpHeaders -> httpHeaders.setBearerAuth(jwt))
                .headers(httpHeaders -> httpHeaders.set("X-XSRF-TOKEN", xsrfToken))
                .cookies(cookies -> cookies.add("XSRF-TOKEN", xsrfToken))
            .retrieve()
            .bodyToMono(String.class)
            .block();
    }
}
