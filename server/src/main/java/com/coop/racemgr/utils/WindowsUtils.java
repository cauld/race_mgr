package com.coop.racemgr.utils;

import java.io.IOException;
import java.lang.ProcessHandle.Info;
import java.util.ArrayList;
import java.util.stream.Stream;

public class WindowsUtils {
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
            String cmd = String.format("taskkill /pid %s /F", pid);
            Runtime.getRuntime().exec(cmd);
            System.out.println(pid + " killed successfully! ");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}