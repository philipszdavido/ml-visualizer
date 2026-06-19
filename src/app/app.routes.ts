import { Routes } from '@angular/router';
import { MlSandbox } from './ml-sandbox/ml-sandbox';
import { EmbeddingSimComponent } from './embedding-sim/embedding-sim';
import { Home } from './home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'ml-sandbox',
    component: MlSandbox
  },
  {
    path: 'embed-sim',
    component: EmbeddingSimComponent
  }
];
