import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AttentionVisual } from './pages/attention-visual/attention-visual';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'models/attention',
    component: AttentionVisual,
  },
  {
    path: 'back-prop',
    loadComponent: () =>
      import('./pages/backprop-graph.component/backprop-graph.component').then((m) => m.BackpropGraphComponent),
  },
  {
    path: 'models/linear-regression',
    loadComponent: () => import('./pages/linear-reg/linear-reg').then((m) => m.LinearReg),
  },
  {
    path: 'models/knn-classifier',
    loadComponent: () => import('./pages/knn/knn').then((m) => m.Knn),
  },
  {
    path: 'models/logistic-regression',
    loadComponent: () => import('./pages/logistic-reg/logistic-reg').then((m) => m.LogisticReg),
  },
  {
    path: 'models/naive-bayes',
    loadComponent: () => import('./pages/naive-bayes/naive-bayes').then((m) => m.NaiveBayes),
  },
  {
    path: 'models/peceptron-classifier',
    loadComponent: () =>
      import('./pages/peceptron-classifier/peceptron-classifier').then(
        (m) => m.PeceptronClassifier,
      ),
  },
  {
    path: 'models/polynomial-regression',
    loadComponent: () =>
      import('./pages/polynomial-reg/polynomial-reg').then((m) => m.PolynomialReg),
  },
  {
    path: 'models/linear-svm',
    loadComponent: () => import('./pages/linear-svm/linear-svm').then((m) => m.LinearSVM),
  },
  {
    path: 'models/train-linear-svm',
    loadComponent: () => import('./pages/trainsvm/train').then((m) => m.TrainComponent),
  },
  {
    path: 'models/tiny-embedding-sim',
    loadComponent: () =>
      import('./pages/embedding-sim/embedding-sim').then((m) => m.EmbeddingSimComponent),
  },
];
