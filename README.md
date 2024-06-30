- For running the frontend type:
  npm run frontend

- For runing the backend type:
  npm run backend

---

## Deploying

@New

1. Push your changes to the `dev` branch.
2. Create SSL-VPN Connection (Doron sent the instrunctions on email)
3. Start SSH Shell with Putty / Mobaxtrem to the remote server `triprice.cs.colman.ac.il`.
4. Enter the credentials:
   username: cs302
   password: Orbit@Cs717
   and then enter.
5. Enter the command `sudo -i`, then type the password: Orbit@Cs717, and then enter.
6. Enter the command `/prod/runDeploy.sh` and then enter. This command will take about 10 minutes to run.
Basically, it's pull the changes from dev branch, erase the old docker containers and regenrating all the docker containers from the start, including the installation of all npm dependencies.

- For general info, there is a cronjob on the server which deploys automatically (doing all the steps above) every day at 3:00 AM.

@Deprecated

- First of all make sure you already installed firebase to your computer, if not run :
  npm install -g firebase-tools
- For deploying frontend run the following commands:
  nx build triprice-frontend --prod
  firebase deploy
- For deploying backend:
  Go to Render, URL : https://render.com/
  Sign in with google with the gmail user of triprice.
  Then go to dashboard, and press on 'triprice-backend'
  Press from your top-right on the blue button 'Manual Deploy' -> Deploy latest commit

---

## !Mailing only! Gmail User (2 Factor Authentication method is on with this one)

username: triprice.do.not.replay@gmail.com
password: Trip123!
email password code: pnehnqwbvgknjljo

---

## Gmail User

username: triprice123@gmail.com
password: Trip123!

---

Links

---

Jira - https://triprice.atlassian.net/jira/software/c/projects/DEV/boards/1

Gitlab - https://gitlab.com/triprice/triprice

Firebase frontend - https://triprice-cs.web.app/search

Amadeus - https://developers.amadeus.com/signin
password: Trip123123!

EVERY 2 WEEKS NEED TO CREATE NEW ACCOUNT FOR SEARCH ENGINE:

1. go to https://www.air-port-codes.com/
2. register with fake Email from here: https://10minutemail.com/
3. copy API KEY and API SECRET to our .env file - AIRPORTS_AUTH_KEY, AIRPORTS_AUTH_SECRET
