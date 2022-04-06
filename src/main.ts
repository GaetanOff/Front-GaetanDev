import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import * as Sentry from "@sentry/angular";
import { BrowserTracing } from "@sentry/tracing";

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

Sentry.init({
  dsn: "https://0f9903d8b6a447618dd5fa97f87c688e@o969342.ingest.sentry.io/6313985",
  integrations: [
    new BrowserTracing({
      tracingOrigins: ["localhost", "https://yourserver.io/api"],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
