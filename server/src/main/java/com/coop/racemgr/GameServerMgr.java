package com.coop.racemgr;

import org.springframework.stereotype.Component;

import javax.annotation.PreDestroy;
import java.io.*;

@Component
public class GameServerMgr implements Runnable {
    private static Process gameServerMgrInstance = null;
    private static String gameServerFsPath = System.getenv("RM_PATH_TO_DEDICATED_SERVER");
    private static String gameServerExe = gameServerFsPath + "\\DedicatedServerCmd.exe";

    /**
     * Calling run() will actually run the server on the current thread. Call start() to
     * get a background thread instead.
     */
    public void run() {
        if (gameServerMgrInstance == null) {
            System.out.println("Starting the external game server!");
            try {
                gameServerMgrInstance = Runtime.getRuntime().exec(GameServerMgr.gameServerExe, null, new File(GameServerMgr.gameServerFsPath));
            } catch (IOException e) {
                e.printStackTrace();
            }

            try {
                GameServerMgr.listen(gameServerMgrInstance);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * Prints thread stdout as it happens
     * @param process
     * @throws IOException
     */
    private static void listen(Process process) throws IOException {
        InputStream is = process.getInputStream();
        InputStreamReader isr = new InputStreamReader(is);
        BufferedReader buff = new BufferedReader(isr);
        String line;
        while((line = buff.readLine()) != null) {
            System.out.println(line);
        }
    }

    @PreDestroy
    public void destroy() {
        System.out.println("Stopping the external game server!");
        gameServerMgrInstance.destroy();
    }
}
