# Race Manager Server (RMS)

## Server Setup
 - If not present on the machine, install [Java 17](https://docs.aws.amazon.com/corretto/latest/corretto-17-ug/downloads-list.html) JRE (to run) or JDK to dev/build.
 - Create the following folder on the machine `C:\race_mgr\data`
 - Add the following ENV VARS in Windows:
   - `RM_GAMESERVER_HOST` (e.g.) localhost
   - `RM_GAMESERVER_PORT` (e.g.) 9000
   - `RM_PATH_TO_DEDICATED_SERVER` (e.g.) `D:\SteamLibrary\steamapps\common\Automobilista 2\Automobilista 2 - Dedicated Server`
     - NOTE: Don't use quotes, path is escaped internally
   - Open the Window's command prompt, `cd` to RMS server director (important), run `java -jar racemgr-0.0.1.jar`

## Dev Setup
 - To interact with HSQLDB directly you can use:
   - [JPA Buddy](https://www.jpa-buddy.com/) in IntelliJ
   - [DBeaver](https://dbeaver.io/download/)
   - HSQLDB Server Manager Swing App: If you want to [download HSQLDB directly](https://sourceforge.net/projects/hsqldb/files/)
 - In any case, point your selected tool at the hsqldb file `C:\race_mgr\data`

## API Endpoints
 - All API endpoints start with `/api/v1/` (e.g.) `http://localhost:8080/api/v1/rotation`
 - `/rotation`: List and/or change existing rotation

## API Exploration (Postman)
 - Download/Install [Postman](https://www.postman.com/downloads/)
 - ]Import collection](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/) found in the `postman` directory
 - Use APIs against running server
