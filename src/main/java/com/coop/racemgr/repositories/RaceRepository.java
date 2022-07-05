package com.coop.racemgr.repositories;

import com.coop.racemgr.model.Race;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RaceRepository extends PagingAndSortingRepository<Race, Integer> {
    @Query("{race_id:'?0'}")
    Race findItemByRaceId(String id);

    Page<Race> findAll(Pageable pageable);

    @Query("{race_session_id:'?0'}")
    Page<Race> findAllBySessionId(String raceSessionId, Pageable pageable);

    @Query("{race_rotation_id:'?0'}")
    Page<Race> findAllByRotationId(String raceRotationId, Pageable pageable);

    @Query("{race_session_id:'?0', 'race_rotation_id':'?1'}")
    Page<Race> findAllBySessionIdAndRotationId(String raceSessionId, String raceRotationId, Pageable pageable);

    public long count();
}

