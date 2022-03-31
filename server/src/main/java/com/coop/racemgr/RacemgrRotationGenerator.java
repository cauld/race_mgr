package com.coop.racemgr;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class RacemgrRotationGenerator {
    public ArrayList getRandomElement(List list, int totalItems) {
        Random rand = new Random();
        List newList = new ArrayList<>();
        for (int i = 0; i < totalItems; i++) {
            // Random index between 0 to size of given List
            int randomIndex = rand.nextInt(list.size());
            newList.add(list.get(randomIndex));
            list.remove(randomIndex); //Don't select again
        }

        return (ArrayList) newList;
    }
}