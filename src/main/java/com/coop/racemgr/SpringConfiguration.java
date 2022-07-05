package com.coop.racemgr;

import com.coop.racemgr.utils.RacemgrUtils;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@EnableScheduling
@ComponentScan(basePackages = {"com.coop.racemgr"})
public class SpringConfiguration {
//    @Bean
//    public RaceEventProcessor raceEventProcessor() {
//        return new RaceEventProcessor();
//    }

//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }

    private String raceMgrBaseUrl = "http://localhost:8080/";
    private String adminUser = System.getenv("RM_ADMIN_USER");
    private String adminPassword = System.getenv("RM_ADMIN_PASSWORD");

    // NOTE: This calls the self-hosted REST endpoint that triggers event process. It has
    // a 1s delay for the first call and then calls 1s after each execution completes.
    // Would be nice to call the event processor directly, but I haven't figured out how
    // to autowire the repository outside of the rest controller class yet.
    // Ref: https://www.baeldung.com/spring-scheduled-tasks
    @Scheduled(fixedDelay = 1000)
    public void scheduleFixedDelayTask() {
        WebClient eventProcessingClient = WebClient.create();
        var xsrfToken = String.valueOf(RacemgrUtils.getXsrfToken(raceMgrBaseUrl + "api"));
        eventProcessingClient.post()
            .uri(raceMgrBaseUrl + "api/v1/admin/race/events")
                .headers(httpHeaders -> httpHeaders.setBasicAuth(adminUser, adminPassword))
                .headers(httpHeaders -> httpHeaders.set( "X-XSRF-TOKEN", xsrfToken))
                .cookies(cookies -> cookies.add("XSRF-TOKEN", xsrfToken))
            .retrieve()
            .bodyToMono(String.class)
            .block();
    }
}
