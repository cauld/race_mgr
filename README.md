# Race Manager (RM)
RM is an advanced (unofficial) Automobilista 2 server management interface. It supports online championships with permanent history tracking, easy rotation management/generation, general server management, etc. It's now easier than every to race with your friends and brag about your results (or blame them on someone else). It assumes you have the [Automobilista 2 Dedicated Server](https://steamdb.info/app/1338040/z) installed on the same machine.

![Race Manager home screen](https://github.com/cauld/race_mgr/blob/main/screenshots/race_mgr_home.png?raw=true)

## Dev Setup
- If not present on the machine, install [Java 18](https://docs.aws.amazon.com/corretto/latest/corretto-18-ug/downloads-list.html) JDK to dev/build.
- Now follow `Server Setup` below

NOTES:
- The server log (`race_mgr.log`) lands in whatever system directory is defined in the Windows `TEMP` environment variable

## Race Manager Server Setup
- For reference, here is a [demo video](https://www.youtube.com/watch?v=qrG-Usr3-2A) that walks through the setup step shown below.
- Race Manager uses MongoDB to store race history data. Follow the MongoDB Setup section below and then return back here and continue with the rest.
- In the dedicated game server's `server.cfg` file, set `eventsLogSize` to a smaller value (e.g.) 1000. The default is something like 10000. One each pass RMS checks and processes each so the more there are the longer it takes to do so. We are capturing them in the mongo database at roughly 1s intervals.
- If you didn't do the `Dev Setup` above for JDK, and it's not already present on the machine, install the latest [Java JRE](https://docs.aws.amazon.com/corretto/latest/corretto-18-ug/downloads-list.html).
  - Add the following ENV VARS in Windows:
    - `RM_GAMESERVER_HOST` - Host running dedicated game sever (e.g.) localhost
    - `RM_GAMESERVER_PORT` - Host running dedicated game sever (e.g.) 9000
    - `RM_PATH_TO_DEDICATED_SERVER` (e.g.) `D:\SteamLibrary\steamapps\common\Automobilista 2\Automobilista 2 - Dedicated Server`
      - NOTE: Don't use quotes, path is escaped internally
    - `RM_MONGO_USER` - The username you set when creating the user above, `racemgr` is unchanged
    - `RM_MONGO_PASS` - That password you set when creating the user above
    - `RM_MONGO_HOST` - Use `localhost` if you are running on the same machine
    - `RM_MONGO_PORT` - Use `27017` unless you've customized
    - `RM_ADMIN_USER` - All `admin` features/API endpoints require Bearer (JWT) authentication. Set to whatever you want the admin username to be.
    - `RM_ADMIN_PASSWORD` - All `admin` features/API endpoints require Bearer (JWT) authentication. Set to whatever you want the admin password to be.
    - `RM_JWT_SECRET` - This is used as part of user authentication. It should be a random 64 character string. We recommend using [this tool](http://www.unit-conversion.info/texttools/random-string-generator/) to generate one.
    - Open the Window's command prompt, `cd` to RMS server director (important), run `java -jar racemgr-X.X.X.jar` (X being the version you downloaded).
    - The web application UI is now available on port `8080` (e.g.) http://localhost:8080/

    NOTE for Devs:
    - If you are building yourself and using IntelliJ you can define these same variables [in the IDE](https://www.jetbrains.com/help/objc/add-environment-variables-and-program-arguments.html) to override the Windows System Env ones as needed.

## MongoDB Setup
- Unless you plan to use a remote MongoDB, install MongoDB now. Any recent version (5.0+) should work fine. The [free community edition](https://www.mongodb.com/try/download/community) is all you need.
- Say yes to running MongoDB as a service so that you don't have to start/restart manually when using Race Manager.
- MongoDB is not secure by default. Race Manager requires authentication, so next we'll add a user and enable authentication:
  - Open the Windows Command Prompt
  - Browse to Mongo install directory (e.g.) `cd C:\Program Files\MongoDB\Server\6.0\bin`
  - Next we'll launch Mongo Shell to add a user for the Race Manager database (NOTE: the database itself is created automatically later when the app is launched).
  - In the Windows Command Prompt, run `mongo` to start the Mongo Shell.
  - Next we'll switch to the `admin` auth database and create your user. Run the following commands and you will be prompted for the password you'd like to use:
  ```
  use admin
  db.createUser(
    {
      user: "racemgr",
      pwd:  passwordPrompt(),
      roles: [ { role: "readWrite", db: "racemgr" } ]
    }
  )
  ```
  - From the same shell, you can test the user with the following command, `db.auth("racemgr", passwordPrompt())`. A return value of `1` is good.
  - Back in the Mongo install directory, open `mongod.cfg` in a text editor (NOTE: to save the updated file you will need admin privileges).
  - Look for the `security` section which is commented out by default. Uncomment and enable security like so:
  ```
  security:
    authorization: "enabled"
  ```
  - Now restart the "MongoDB" service using the "Services" tab in Windows Task Manager or just reboot your machine.
  - That's it. Return to "Server Setup" above.

## API Endpoints
- All API endpoints start with `/api/v1/` (e.g.) `http://localhost:8080/api/v1/rotation`
- All server admin related features live under the `/api/v1/admin/` resource (e.g.) `http://localhost:8080/api/v1/admin/...`. These require Bearer (JWT) authentication.

## API Exploration (Postman)
- Download/Install [Postman](https://www.postman.com/downloads/)
- [Import collection & environment](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/) found in the `postman` directory
- Open the collection, select the `RaceMgr` environment, click on the `Admin` folder in the collection and update the admin user/password values. Make sure to save after updating. More on managing environments [here](https://learning.postman.com/docs/sending-requests/managing-environments/).
- Use APIs against running server
- Here is a [demo/explanation video](https://www.youtube.com/watch?v=_ou79ZR819s&ab_channel=RaceManager) of our APIs and Postman usage.

## TODOs (based on demand/request)
- Support for Linux
- A ready made Docker image
- Support for custom (vs randomly generated) rotations
- Support for rotation exporting/sharing
- Track and car images addded for enhanced UI
- Ability to Linux race sessions to external videos (youtube/twitch)
