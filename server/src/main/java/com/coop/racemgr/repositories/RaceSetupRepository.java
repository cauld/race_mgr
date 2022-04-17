package com.coop.racemgr.repositories;

import com.coop.racemgr.entities.RaceSetup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RaceSetupRepository extends JpaRepository<RaceSetup,Long> { }