package com.coop.racemgr.repositories;

import com.coop.racemgr.model.RaceMgrConfig;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RaceMgrConfigRepository extends MongoRepository<RaceMgrConfig, Integer> {
    RaceMgrConfig findItemById(String id);
}

