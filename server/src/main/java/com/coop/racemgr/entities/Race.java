package com.coop.racemgr.entities;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "race")
public class Race {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long race_id;
    private String start_time;
    private String end_time;
    private Boolean finished;

    public Race() {
    }
    //get & set methods
}