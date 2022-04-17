package com.coop.racemgr.repositories;

import com.coop.racemgr.entities.RaceStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RaceStageRepository extends JpaRepository<RaceStage,Long> { }