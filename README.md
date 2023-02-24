
  
# Race Manager (RM)  
RM is an advanced (unofficial) [Automobilista 2](https://www.game-automobilista2.com/) server management interface. It supports online championships with permanent history tracking, easy rotation management/generation, general server management, etc. It's now easier than every to race with your friends and brag about your results (or blame them on someone else).  
  
![Race Manager home screen](https://github.com/cauld/race_mgr/blob/main/screenshots/race_mgr_home.png?raw=true)  
  
**@TODO** Add a UI demo here....  
  
  
## Installation/Upgrade  
Official Race Manager releases/downloads can found on [the releases page](https://github.com/cauld/race_mgr/releases). With each new release you'll find 3 main files; an installer .exe, a standalone .exe and a .jar file. We'll cover their differences in the sections below.  
  
**@TODO** (_update outdated demos_) For reference, here is a [demo video](https://www.youtube.com/watch?v=qrG-Usr3-2A) that walks through the setup step shown below.  
  
### Prerequisites for all Installation Types
First, let's start with the prerequisites that are required by all installations. The following 4 items are required regardless of setup type:  
  
1. **Windows OS**: Some day we may support Linux as well, but for now Windows is the only option. *NOTE:* Most of our testing is done with Windows 10 & 11.  
2. **Automobilista 2 - Dedicated Server (AM2DS)**: Race Manager must be installed on the same machine as [AM2DS](https://steamdb.info/app/1338040/z). A lot of interactions are done against the API which would support remote deployments, but Race Manager also interacts directly with the core files used in AM2DS (e.g.) sms_rotation, eventually server.cfg, etc. In addition to installing AM2DS, you must also create a `server.cfg` file in the AM2DS installation directory (e.g.) `C:\Program Files (x86)\Steam\steamapps\common\Automobilista 2 - Dedicated Server`. Inside the AM2DS directory you'll find some sample configs in the `config_sample` sub-directory. You can start by copying one of those into the AM2DS parent directory (make sure to rename it to `server.cfg`). Alternatively, you can [download](https://raw.githubusercontent.com/cauld/race_mgr/main/sample_files/server.cfg) and use our starter config. You'll find a file called `UserGuide.pdf` in the AM2DS directory that explains the various configuration options. The most important one for Race Manager is `enableHttpApi`. This setting must be set to `true` for Race Manager to interact with the AM2DS APIs.  
- (Optional) In the AM2DS `server.cfg` file, set `eventsLogSize` to a smaller value (e.g.) 1000. The default is something like 10000. One each pass RM checks and processes each record so the more there are the longer it takes to do so. We are capturing them in the mongo database at roughly 1s intervals. This recommendation is already applied if using our Race Manager starter config file.  
3. **Java 18+**: Race Manager requires a recent version of Java. If not already present on the machine, install the **Java 18 JDK**. Updated standalone JRE versions are no longer offered by the main Java projects. These days the JRE is bundled with the JDK. Any standard JDK from Oracle or OpenJDK should work fine. We find the version of OpenJDK offered by Amazon ([Corsetto](https://docs.aws.amazon.com/corretto/latest/corretto-18-ug/downloads-list.html)) easiest for most people because it offers an .MSI installer. Here is a [direct link](https://corretto.aws/downloads/latest/amazon-corretto-18-x64-windows-jdk.msi) for the .MSI download.  
4. **MongoDB**:  Race Manager uses MongoDB, a popular open source NoSQL database, to store race history data. Follow the [MongoDB Setup section](#mongodb-setup) below and then return back here to continue with the rest of the setup.  
  
### End User Installation  
In the section above we talked about the 3 different release files. For brand new end user installations you'll probably want the installer .exe. The installer does not handle any of the prerequisites so make sure to have completed that checklist first. The installer handles the installation of Race Manager like a traditional Windows application. It will create a Race Manager folder in `C:\Program Files (x86)`, collect important configuration information (e.g.) mongo password, set the required Windows environment variables and create a desktop icon for you (optional).  
  
Once installed simply use the installed `RaceManager.exe` (or shortcut) to launch Race Manager. The application starts a persistent console window that outputs various state messages during normal operation. You will *NOT* start AM2DS directly as Race Manager takes over operation, (i.e.) start/stop/restart, as needed.  
  
**NOTE:** If you want to stop Race Manager click on the console and then use the key combination `Ctrl + c`. Race Manager is meant to operate much like a background service, but doesn't actually register itself as a Windows service. To that end, closing the console window directly using the `X` doesn't actually close the application. That simply hides the output window. If you've closed the console window and now desire to close application itself then launch the Windows `Task Manager`, look for Race Manager in the `Processes` list, click on it and choose `End Task`.  Should you want to have Race Manager startup with Windows then [the following method](https://support.microsoft.com/en-us/windows/add-an-app-to-run-automatically-at-startup-in-windows-10-150da165-dcd9-7230-517b-cf3c295d89dd) can be utilized.  
  
#### End User Upgrade  
The easiest way to upgrade Race Manager is to stop the application and then simply replace the standalone .exe in your `C:\Program Files (x86)\Race Manager` folder with the latest one from the releases page.  
  
**NOTE:** You can also technically use the installer .exe to perform upgrades, but this isn't generally recommended. The installer is still pretty simple and as such doesn't yet retain previous configuration settings. It will also replace the previously generated application security secret which invalidates any existing authentication tokens (requiring users to clear their cookies and re-login).  
  
### Using the .jar File Instead  
`RaceManager.exe` wraps the Race Manager `.jar` file to bring a native Windows application look and feel, make it easy to launch, etc. If you prefer, you can also choose to run Race Manager directly from the released `.jar` file. You must set the required Windows environment variables manually first given that the installer normally does that (*see that section below*). With that done simply download the released `.jar` file, place it wherever you want, launch the Windows command prompt, browse to the location you placed the `.jar` and run `java -jar racemgr-x.x.x.jar` (where `x` is dependent on the version you downloaded). Then use `Ctrl + c` to stop the application as needed. To upgrade simply stop the application and replace the `.jar` file with the latest one from the releases page.  
  
### Accessing the Web UI  
As long as Race Manager is running, the main web application UI is available at http://localhost:8080/. General race data is available for browsing by anyone that can access the URL. If you are running this on your home network then by default that generally means just your computer. Admin related features like the creation/update of sessions & rotations, management of the underlying AM2DS, etc are secured behind the admin user/password that you created during installation.  You'll have to login to access those features.
  
**NOTE:** If you do [port forwarding](https://learn.g2.com/port-forwarding) from your router, then you can technically expose your Race Manager instance to the Internet and your racing friends. In that case the URL would be `http://{YOUR-IP}:8080`. Given that ISPs change IPs from time to time, you'll probably want to use a free service like [NO-IP](https://www.noip.com/) to get a permanent hostname that stays updated with your IP as it changes.

### Troubleshooting Tips
- If the console window appears and disappears immediate after launch, there is likely a configuration error (i.e.) something incorrect with the values you supplied to the installer and/or entered directly into the required Windows environment variables. For example, Race Manager is unable to connect to Mongo because the wrong password was supplied. It could also be a Java version mismatch (installing from the link provided above would rule this problem out).
  
## Additional Setup Information  
  
### MongoDB Setup  
- Unless you plan to use a remote MongoDB, install MongoDB now. Any recent version (5.0+) should work fine. The [free community edition](https://www.mongodb.com/try/download/community) is all you need.  
- Say yes to running MongoDB as a service so that you don't have to start/restart manually when using Race Manager.  
- MongoDB is not secure by default. Race Manager requires authentication, so next we'll add a user and enable authentication:  
  - Open the Windows Command Prompt  
  - Browse to Mongo install directory (e.g.) `cd C:\Program Files\MongoDB\Server\6.0\bin`    
  - In the Windows Command Prompt, run `mongo` to start the Mongo Shell.  
 - For Mongo 6.X:  
      - The mongo shell is removed from MongoDB 6.0. The replacement is mongosh which requires a seperate [download](https://www.mongodb.com/docs/mongodb-shell/install/#install-from-msi) / install.  
      - In the Windows Command Prompt, run `mongosh` to start the Mongosh Shell.
 - For Older Mongo 5.X Installations:    
      - Next we'll launch Mongo Shell to add a user for the Race Manager database (NOTE: the database itself is created automatically later when the app is launched).  
 - The rest of the steps are the same regardless of MongoDB version. So next we'll switch to the `admin` auth database and create your user. Run the following commands and you will be prompted for the password you'd like to use (**NOTE**: Do not use the special characters `@` or `:`):  
 ```
 use admin    
 db.createUser( { user: "racemgr", pwd:  passwordPrompt(), roles: [ { role: "readWrite", db: "racemgr" } ] } )   
 ```  
- Type `quit` and hit enter to exit the mongo/mongosh shell and return the Windows command prompt.  
- From the same shell, you can test the user with the following command, `db.auth("racemgr", passwordPrompt())`. A return value of `1` is good.  
- Back in the Mongo install directory, open `mongod.cfg` in a text editor (NOTE: to save the updated file you will need admin privileges).  
- Look for the `security` section which is commented out by default. Uncomment and enable security like so:  
```    
security:
  authorization: "enabled" 
 ```
 - Now restart the "MongoDB" service using the "Services" tab in Windows Task Manager or just reboot your machine.  
- That's it. Return to [installation section](#end-user-installation) above.  
  
### Windows Environment Variables  
When using the installer .exe the required Windows environment variables will be set for you. Otherwise, you will need to [manage these yourself](https://geekflare.com/system-environment-variables-in-windows/).  
  
- `RM_GAMESERVER_HOST`: Host running dedicated game sever (i.e.) `localhost`  
- `RM_GAMESERVER_PORT`: Host running dedicated game sever (i.e.) `9000` (unless you customized)  
- `RM_PATH_TO_DEDICATED_SERVER`: The local filesystem path to which you've installed AM2DS (e.g.) `C:\Program Files (x86)\Steam\steamapps\common\Automobilista 2 - Dedicated Server`  
- **NOTE**: Don't use quotes, the path is escaped internally  
- `RM_MONGO_USER`: The username you set when creating the user during the mongo setup. If you follow the directions exactly, then `racemgr` was the default value.  
- `RM_MONGO_PASS`: That password you set when creating the user during the mongo setup  
- `RM_MONGO_HOST`: Use `localhost` if you are running on the same machine  
- `RM_MONGO_PORT`: Use the mongo default port, (i.e.) `27017`, unless you've customized  
- `RM_ADMIN_USER`: All `admin` features/API endpoints require Bearer (JWT) authentication. Set to whatever you want the admin username to be.  
- `RM_ADMIN_PASSWORD`: All `admin` features/API endpoints require Bearer (JWT) authentication. Set to whatever you want the admin password to be.  
- `RM_JWT_SECRET`: This is used as part of user authentication. It should be a random 64 character string that is unique to each installation. We recommend using [this tool](http://www.unit-conversion.info/texttools/random-string-generator/) to generate one.  
  
## Developer Setup  
If you are looking to add or enhance features, fix bugs, etc then this is the section for you. The core prerequisites remain the same so start by following that section above and then return here.  
  
### Frontend  
- TypeScript/React/Redux/NodeJS are used to develop the frontend single page application (SPA). You will need to install the latest version of [NodeJS](https://nodejs.org/en/download/) in addition to the other prerequisites outline above.  
- The frontend source is located at `src/main/client`. There is a `README` file there with more details. During development you generally start the backend and then also start the frontend separately using `npm run start` from the client director. This makes all the standard React tooling available for development. The development UI loads at `http://localhost:3000`. It internally proxies API requests to the backend running on port `8080`.  
- During the normal application build process the frontend bundle is produced and copied into the `.jar` for hosting during general usage.  
  
### Backend  
- Java is used to develop the backend of Race Manager.  
- [Spring Boot](https://spring.io/projects/spring-boot) is the main framework in use.  
  
### Application Builds  
- Maven is used manage the Java Dependencies and build the whole application.  
- A Maven plugin is used to integrate [Launch4j](https://launch4j.sourceforge.net/) for wrapping the `jar` as a lightweight Windows native executable.  
- [Inno Setup](https://jrsoftware.org/isinfo.php) is then used to create a Windows installer from Launch4j's resulting `.exe`. This part is still manual. The installer project file is `installer/racemanager.iss`.  
  
### Additional Notes:  
- The server log (`race_mgr.log`) lands in whatever system directory is defined in the Windows `TEMP` environment variable  
  
## API Endpoints  
- All API endpoints start with `/api/v1/` (e.g.) `http://localhost:8080/api/v1/rotation`  
- All server admin related features live under the `/api/v1/admin/` resource (e.g.) `http://localhost:8080/api/v1/admin/...`. These require Bearer (JWT) authentication.  
  
## API Exploration (Postman)  
- Download/Install [Postman](https://www.postman.com/downloads/)  
- [Import collection & environment](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/) found in the `postman` directory  
- Open the collection, select the `RaceMgr` environment, click on the `Admin` folder in the collection and update the admin user/password values. Make sure to save after updating. More on managing environments [here](https://learning.postman.com/docs/sending-requests/managing-environments/).  
- Use APIs against running server  
- **@TODO** (*update demo)*: Here is a [demo/explanation video](https://www.youtube.com/watch?v=_ou79ZR819s&ab_channel=RaceManager) of our APIs and Postman usage.  
  
## Future TODOs (based on demand/request)  
  
- Support for custom (vs randomly generated) rotations  
- Support for rotation exporting/sharing  
- Track and car images added for enhanced UI  
- Ability to link race sessions to external videos (YouTube/Twitch)  
- Support for Linux  
- A ready-made Docker image
