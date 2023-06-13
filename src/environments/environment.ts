// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appVersion: 'v8.1.0',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  apiUrl: 'https://easy-bq-backend-dot-bqls-368213.lm.r.appspot.com',

  firebaseConfig: {
    apiKey: "AIzaSyCyfTkKG18baK-NIzS14SqgYziH_iEv_QQ",
    authDomain: "bqls-test217.firebaseapp.com",
    projectId: "bqls-test217",
    storageBucket: "bqls-test217.appspot.com",
    messagingSenderId: "238773999299",
    appId: "1:238773999299:web:d54fec8b37334dfea0f476",
    measurementId: "G-JYD6B3N3FB"
  },
  appThemeName: 'Metronic',
  appPurchaseUrl: 'https://1.envato.market/EA4JP',
  appHTMLIntegration: 'https://preview.keenthemes.com/metronic8/demo1/documentation/base/helpers/flex-layouts.html',
  appPreviewUrl: 'https://preview.keenthemes.com/metronic8/angular/demo1/',
  appPreviewAngularUrl: 'https://preview.keenthemes.com/metronic8/angular/demo1',
  appPreviewDocsUrl: 'https://preview.keenthemes.com/metronic8/angular/docs',
  appPreviewChangelogUrl: 'https://preview.keenthemes.com/metronic8/angular/docs/changelog',
  appDemos: {
    'demo1': {
      'title': 'Demo 1',
      'description': 'Default Dashboard',
      'published': true,
      'thumbnail': './assets/media/demos/demo1.png'
    },
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
