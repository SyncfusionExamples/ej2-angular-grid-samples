import { bootstrapApplication, platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';
import { AppComponent } from './app/app';

// platformBrowser().bootstrapModule(AppModule, {
//   ngZoneEventCoalescing: true,
// })
//   .catch(err => console.error(err));


  
bootstrapApplication(AppComponent)
  .catch(err => console.error(err));