package com.coop.racemgr.repositories;

import com.coop.racemgr.entities.RaceStageEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RaceStageEventRepository extends JpaRepository<RaceStageEvent,Long> { }