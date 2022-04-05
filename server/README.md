# Race Manager Server (RMS)

## Setup
 - Add the following ENV VARS in Windows:
   - `RM_GAMESERVER_HOST` (e.g.) localhost
   - `RM_GAMESERVER_PORT` (e.g.) 9000
   - `RM_PATH_TO_DEDICATED_SERVER` (e.g.) `D:\SteamLibrary\steamapps\common\Automobilista 2\Automobilista 2 - Dedicated Server`
     - NOTE: Don't use quotes, path is escaped internally
   - Open the Window's command prompt, `cd` to RMS server director (important), run `java -jar racemgr-0.0.1.jar`

## Troubleshooting
 - If the server ever starts complaining about not being able to bind ports then most likely RMS lost track of the Game Server thread. To fix open task manager in Windows, kill "DedicatedServerCmd.exe", and restart RMS.