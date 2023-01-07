package com.coop.racemgr.gameserver;

import com.coop.racemgr.RacemgrApplication;
import com.coop.racemgr.utils.WindowsUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import javax.annotation.PreDestroy;
import java.io.*;

@Component
public class GameServerMgr implements Runnable {
    final private static String gameServerFsPath = System.getenv("RM_PATH_TO_DEDICATED_SERVER");
    final private static String gameServerExeName = "DedicatedServerCmd.exe";
    final private static String gameServerExe = gameServerFsPath + "\\" + gameServerExeName;

    private static final Logger logger = LogManager.getLogger(RacemgrApplication.class);

    /**
     * Calling run() will actually run the server on the current thread. Call start() to
     * get a background thread instead.
     */
    public void run() {
        try {
            GameServerMgr.start();
        } catch (InterruptedException e) {
            logger.error(e);
            e.printStackTrace();
        } catch (IOException e) {
            logger.error(e);
            e.printStackTrace();
        }
    }

    public static void start() throws InterruptedException, IOException {
        if (isRunning() == true) {
            logger.info("External game server already running, forcing restart!");
            GameServerMgr.stop();
            Thread.sleep(1000); // Avoid race, let the thread die before starting
        }

        try {
            logger.info("Starting the external game server!");
            String[] command = { gameServerExe };
            String[] commandArgs = {};
            Runtime.getRuntime().exec(command, commandArgs, new File(gameServerFsPath));
        } catch (IOException e) {
            logger.error(e);
            e.printStackTrace();
        }
    }

    public static void restart() throws IOException, InterruptedException {
        GameServerMgr.start();
    }

    @PreDestroy
    public static void stop() throws IOException {
        if (isRunning() == true) {
            logger.info("Stopping the external game server!");
            var pids = WindowsUtils.getPidsByName(gameServerExeName);
            if (pids.size() > 0) {
                WindowsUtils.killProcess(gameServerExeName);
            }
        } else {
            logger.info("External game server not running, nothing to stop.");
        }
    }

    public static boolean isRunning() throws IOException {
        return WindowsUtils.isProcessRunning(gameServerExeName);
    }
}
