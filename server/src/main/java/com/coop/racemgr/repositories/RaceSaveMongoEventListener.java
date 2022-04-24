package com.coop.racemgr.repositories;

import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;

// Refs:
// 1) https://www.baeldung.com/cascading-with-dbref-and-lifecycle-events-in-spring-data-mongodb
// 2) https://docs.spring.io/spring-data/mongodb/docs/current/reference/html/#mongodb.mapping-usage.events
public class RaceSaveMongoEventListener extends AbstractMongoEventListener<Object> {
//    @Override
//    public void onBeforeConvert(BeforeConvertEvent<Object> event) {
//        Object source = event.getSource();
//        System.out.println("HERERERERERERERRERERERER SV");
//        if (source instanceof Race) {
//            System.out.println("HERERERERERERERRERERERER SV22222");
//            ((Race) source).setRaceId();
//            super.onBeforeConvert(event);
//        }
//    }
}