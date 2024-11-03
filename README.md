# nc-2024

[Link to app](https://nc-2024-614d0.web.app/)

## Background
This app is developed with Node v22.11.0 and time spent is around 10h.

### Techniques used
* React
* Typescript
* Material UI
* Css
* Node.js
* Github Actions
* Firebase
    - Hosting
    - Firestore
    - Functions
    - Auth

### Set up
This is a basic webapp where the user can sign in with a phone number, which is configured with Firebase Auth. The signInWithPhoneNumber from Firebase is used together with an invisible recaptcha. The text will be sent and the code text field appear and the user will enter the code received. If the code is correct the user will be navigated to the profile page where the user can enter name and email, if save is pressed the data is stored in Firestore. When the Profile page is mounted a check will be done to make sure user is signed in (otherwise the user will be navigared back to sign in), via a function I get data from Firestore (if any) and populate the text fields with the data. When entering name and email it is validated via a regex, the user will only get error feedback after first save attempt. On save the second function is used to store the data on Firestore. In Firestore there is one collection with one document for each phone number and inside that document there is one name and one email. Via Github actions the frontend is deployed via Firebase hosting. The webapp is build with Material UI for the components and routed with React router.

### Frontend
The frontend is initialized with `npm create vite@latest`

## Further development

* Use generated id instead of phone number as primary key in order to not expose the phone number too much (with current setup the primary key is used as the route in the url as well)
* Type handling can be improved, in a big scale project I would want to share the common types
* API key should not be exposed, can be saved in eg. Github secrets
* If more time was spent, of course the error/status handling would be improved
* Debug log in a better way
* Phone auth should not be the only option to sign in since text messages sometimes do not get delivered

### Backend
* Github actions can be used to deploy the functions
* Functions are by default deployed in the US, depending on usage this can be changed

### Frontend
* Use internationalization framework
* Put Firebase configuration apikey in for example Github Sectret and variables
* More support for keyboard interaction and other accessibility improvements

## Other

* I did not receive text messages the first day I tried Firebase Auth, other phones I had at home worked. Trying a couple of days later it worked as expected.
