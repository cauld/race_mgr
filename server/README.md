# Race Manager Server (RMS)

## Dev Setup
- If not present on the machine, install [Java 17](https://docs.aws.amazon.com/corretto/latest/corretto-17-ug/downloads-list.html) JDK to dev/build.
- Install Mongodb (Community Edition [here](https://www.mongodb.com/try/download/community))
- To interact with Mongo directly you can use Mongo Compass (default included Mongo GUI)
- Now follow `Server Setup` below

## Server Setup
 - In the dedicated game server's `server.cfg` file, set `eventsLogSize` to a smaller value (e.g.) 1000. The default is something like 10000. One each pass RMS checks and processes each so the more there are the longer it takes to do so. We are capturing them in the mongo database at roughly 1s intervals. 
 - If you didn't do the `Dev Setup` above for JDK, and it's not already present on the machine, install the latest [Java JRE](https://docs.aws.amazon.com/corretto/latest/corretto-18-ug/downloads-list.html).
 - Add the following ENV VARS in Windows:
   - `RM_GAMESERVER_HOST` - Host running dedicated game sever (e.g.) localhost
   - `RM_GAMESERVER_PORT` - Host running dedicated game sever (e.g.) 9000
   - `RM_PATH_TO_DEDICATED_SERVER` (e.g.) `D:\SteamLibrary\steamapps\common\Automobilista 2\Automobilista 2 - Dedicated Server`
     - NOTE: Don't use quotes, path is escaped internally
   - Open the Window's command prompt, `cd` to RMS server director (important), run `java -jar racemgr-0.0.X.jar` (X being the version you downloaded).

## API Endpoints
 - All API endpoints start with `/api/v1/` (e.g.) `http://localhost:8080/api/v1/rotation`
 - `/rotation`: List and/or change existing rotation

## API Exploration (Postman)
 - Download/Install [Postman](https://www.postman.com/downloads/)
 - [Import collection](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/) found in the `postman` directory
 - Use APIs against running server
