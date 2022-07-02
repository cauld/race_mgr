package com.coop.racemgr.gameserver;

import com.coop.racemgr.utils.WindowsUtils;
import org.springframework.stereotype.Component;

import javax.annotation.PreDestroy;
import java.io.*;

@Component
public class GameServerMgr implements Runnable {
    final private static String gameServerFsPath = System.getenv("RM_PATH_TO_DEDICATED_SERVER");
    final private static String gameServerExeName = "DedicatedServerCmd.exe";
    final private static String gameServerExe = gameServerFsPath + "\\" + gameServerExeName;

    /**
     * Calling run() will actually run the server on the current thread. Call start() to
     * get a background thread instead.
     */
    public void run() {
        try {
            GameServerMgr.start();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void start() throws InterruptedException, IOException {
        if (isRunning() == true) {
            System.out.println("External game server already running, forcing restart!");
            GameServerMgr.stop();
        }

        try {
            System.out.println("Starting the external game server!");
            String[] command = { gameServerExe };
            String[] commandArgs = {};
            Runtime.getRuntime().exec(command, commandArgs, new File(gameServerFsPath));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void restart() throws IOException, InterruptedException {
        GameServerMgr.start();
    }

    @PreDestroy
    public static void stop() throws IOException {
        if (isRunning() == true) {
            System.out.println("Stopping the external game server!");
            var pids = WindowsUtils.getPidsByName(gameServerExeName);
            if (pids.size() > 0) {
                WindowsUtils.killProcess(pids.get(0));
            }
        } else {
            System.out.println("External game server not running, nothing to stop.");
        }
    }

    public static boolean isRunning() throws IOException {
        return WindowsUtils.isProcessRunning(gameServerExeName);
    }
}
