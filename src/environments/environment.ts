// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://test.healthybazar.com/api/v2/',   //api url
  // apiUrl: 'http://167.71.235.83:8081/api/v2/',     //dev url
  // apiUrl: 'http://167.71.235.83:8082/api/v2/',     //dev url
  // apiUrl: 'http://35.154.221.175:8082/api/v2/',     //dev url

  // apiUrl: 'http://localhost:8080/api/v2/',     //dev local url
  pickupLocation: "Healthybazar SURFACE",
  client_name: "HealthybazarSURFACE-B2C",
  imageUrl: 'https://cdn.healthybazar.com/images/',
  userAppHost: 'http://167.71.235.83:3050/',
  defaultauth: 'fackbackenssd',
  apikey: "e28390d3-8f65-4f24-9d85-b2650cf0433b",
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
