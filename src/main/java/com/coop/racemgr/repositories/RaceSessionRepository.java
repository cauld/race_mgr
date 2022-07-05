package com.coop.racemgr.repositories;

import com.coop.racemgr.model.RaceSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RaceSessionRepository extends PagingAndSortingRepository<RaceSession, Integer> {
    RaceSession findItemById(String id);

    @Query(value="{active:true}")
    Page<RaceSession> findAll(Pageable pageable);

    public long count();
}
