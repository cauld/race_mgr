package com.coop.racemgr;

import com.coop.racemgr.repositories.RaceSaveMongoEventListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringConfiguration {
    @Bean
    public RaceSaveMongoEventListener raceSaveMongoEventListener() {
        return new RaceSaveMongoEventListener();
    }
}
