// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  url: '192.168.1.90:8000',
  superUrl: '192.168.1.90:8000',
  urlRead: '192.168.1.90:8000',
  fiscalYearStartDate: 1,
  fiscalYearStartMonth: 0,
  fiscalYearEndDate: 31,
  fiscalYearEndMonth: 11,
  sslEnabled: false,
  production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.