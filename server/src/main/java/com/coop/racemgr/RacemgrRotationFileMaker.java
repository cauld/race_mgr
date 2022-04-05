package com.coop.racemgr;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.json.simple.parser.ParseException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

// NOTE: Jackson will only work/serialize fields that are either public
// or have a public getter methods
public class RacemgrRotationFileMaker {
    final public int version;
    public RacemgrRotationConfig config;

    public RacemgrRotationFileMaker(int raceCount, boolean persist) throws ParseException, IOException {
        this.version = 7;
        this.config = new RacemgrRotationConfig(new GameServerProxy(), raceCount, persist);
    }

    private void deleteCachedRotationFile(String gameServerFsPath) {
        String gameServerCachedRotationFilePath = gameServerFsPath + "\\lua_config\\sms_rotate_config.json";
        File file = new File(gameServerCachedRotationFilePath);
        if (file.delete()) {
            System.out.println("Game Server cached rotation deleted successfully");
        } else {
            System.out.println("Game Server cached rotation");
        }
    }

    public void writeGeneratedRotationFile() throws IOException {
        String gameServerFsPath = System.getenv("RM_PATH_TO_DEDICATED_SERVER");
        String gameServerDefaultRotationFilePath = gameServerFsPath + "\\lua\\sms_rotate\\sms_rotate_default_config.json";

        ObjectMapper mapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        // Convert config object to JSON file
        mapper.writerWithDefaultPrettyPrinter().writeValue(Paths.get(gameServerDefaultRotationFilePath).toFile(), this);
        // The game server expects the default config to use the property name "default"
        // which is a Java reserved word. So we call it defaultConfig in the class and update
        // once it has been serialized in the file itself.
        File rotationFileToUpdate = new File(gameServerDefaultRotationFilePath);
        RacemgrUtils.replaceStringInFile(rotationFileToUpdate, "defaultConfig", "default");

        // Once a new file has been written we must remove the active/cached one and reboot
        // the game server for this to take effect.
        this.deleteCachedRotationFile(gameServerFsPath);
        GameServerMgr.restart();
    }
}
