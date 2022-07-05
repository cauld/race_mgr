package com.coop.racemgr.utils;

import com.coop.racemgr.RacemgrApplication;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.File;
import java.io.IOException;
import java.lang.ProcessHandle.Info;
import java.util.ArrayList;
import java.util.stream.Stream;

public class WindowsUtils {
    private static final Logger logger = LogManager.getLogger(RacemgrApplication.class);
    public static ArrayList<Long> getPidsByName(String processName) throws IOException {
        ArrayList<Long> pids = new ArrayList<Long>();
        Stream<ProcessHandle> processStream = ProcessHandle.allProcesses();

        Stream<ProcessHandle> toReturnProcessHandle = processStream.filter(processHandle -> {
            if (processHandle.isAlive()) {
                Info info = processHandle.info();
                if (info.command().toString().toLowerCase().endsWith(processName.toLowerCase() + "]")) {
                    return true;
                }
            }
            return false;
        });
        toReturnProcessHandle.forEach(handle -> pids.add(handle.pid()));
        return pids;
    }

    public static boolean isProcessRunning(String serviceName) throws IOException {
        var pids = WindowsUtils.getPidsByName(serviceName);
        return pids.size() > 0;
    }

    public static void killProcess(Long pid) {
        try {
            String[] command = { "taskkill" };
            String[] commandArgs = { String.format("/pid %s", pid), "/F" };
            Runtime.getRuntime().exec(command, commandArgs);
            logger.info(pid + " killed successfully!");
        } catch (IOException e) {
            logger.error(e);
            e.printStackTrace();
        }
    }
}