package com.coop.racemgr.repositories;

import com.coop.racemgr.model.Race;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RaceRepository extends MongoRepository<Race, Integer> {
    @Query("{name:'?0'}")
    Race findItemById(Long id);

    //@Query(value="{category:'?0'}", fields="{'name' : 1, 'quantity' : 1}")
    //List<Race> findAll(String category);

    public long count();
}

