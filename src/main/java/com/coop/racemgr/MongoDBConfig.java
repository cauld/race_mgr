package com.coop.racemgr;


import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;

// @TODO: Revisit this. It disables JPA _class assignment on serialization for save.
// We'd have to rework RaceRotationConfig to sep the model and the rotation maker
@Configuration
@ComponentScan(basePackages = {"com.coop.racemgr"})
public class MongoDBConfig implements InitializingBean {
    @Autowired
    @Lazy
    private MappingMongoConverter mappingMongoConverter;

    @Override
    public void afterPropertiesSet() throws Exception {
        mappingMongoConverter.setTypeMapper(new DefaultMongoTypeMapper(null));
    }
}