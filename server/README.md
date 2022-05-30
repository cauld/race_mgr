# Race Manager Server (RMS)

## Dev Setup
- If not present on the machine, install [Java 18](https://docs.aws.amazon.com/corretto/latest/corretto-18-ug/downloads-list.html) JDK to dev/build.
- Now follow `Server Setup` below

## Server Setup
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
     - `RM_ADMIN_USER` - All `admin` features/API endpoints require basic authentication. Set to whatever you want the admin username to be.
     - `RM_ADMIN_PASSWORD` - All `admin` features/API endpoints require basic authentication. Set to whatever you want the admin password to be.
     - Open the Window's command prompt, `cd` to RMS server director (important), run `java -jar racemgr-0.0.X.jar` (X being the version you downloaded).

     NOTE for Devs:
     - If you are building yourself and using IntelliJ you should define these same variables [in the IDE](https://www.jetbrains.com/help/objc/add-environment-variables-and-program-arguments.html).

## MongoDB Setup
- Unless you plan to use a remote MongoDB, install MongoDB now. Any recent version (5.0+) should work fine. The [free community edition](https://www.mongodb.com/try/download/community) is all you need.
- Say yes to running MongoDB as a service so that you don't have to start/restart manually when using Race Manager.
- MongoDB is not secure by default. Race Manager requires authentication, so next we'll add a user and enable authentication:
  - Open the Windows Command Prompt
  - Switch to Mongo install directory, `cd C:\Program Files\MongoDB\Server\5.0\bin` (unless you changed during install).
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
 - All server admin related features live under the `/api/v1/admin/` resource (e.g.) `http://localhost:8080/api/v1/admin/...`. These require basic authentication.

## API Exploration (Postman)
 - Download/Install [Postman](https://www.postman.com/downloads/)
 - [Import collection & environment](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/) found in the `postman` directory
 - Open the collection, select the `RaceMgr` environment, click on the `Admin` folder in the collection and update the admin user/password values. Make sure to save after updating. More on managing environments [here](https://learning.postman.com/docs/sending-requests/managing-environments/).
 - Use APIs against running server
 - Here is a [demo/explanation video](https://www.youtube.com/watch?v=_ou79ZR819s&ab_channel=RaceManager) of our APIs and Postman usage.
