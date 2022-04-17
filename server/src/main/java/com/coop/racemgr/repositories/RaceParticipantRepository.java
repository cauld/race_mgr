package com.coop.racemgr.repositories;

import com.coop.racemgr.entities.RaceParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RaceParticipantRepository extends JpaRepository<RaceParticipant,Long> { }