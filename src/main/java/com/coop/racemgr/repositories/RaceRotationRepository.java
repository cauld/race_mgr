package com.coop.racemgr.repositories;

import com.coop.racemgr.model.RaceRotation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RaceRotationRepository extends PagingAndSortingRepository<RaceRotation, Integer> {
    RaceRotation findItemById(String id);

    @Query(value="{active:true}")
    Page<RaceRotation> findAll(Pageable pageable);

    public long count();
}

