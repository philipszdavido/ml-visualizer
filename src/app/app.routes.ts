import { Routes } from '@angular/router';
import { MlSandbox } from './ml-sandbox/ml-sandbox';
import { EmbeddingSimComponent } from './pages/embedding-sim/embedding-sim';
import { Home } from './pages/home/home';
import { LinearReg } from './pages/linear-reg/linear-reg';
import { Knn } from './pages/knn/knn';
import { LogisticReg } from './pages/logistic-reg/logistic-reg';
import { NaiveBayes } from './pages/naive-bayes/naive-bayes';
import { PeceptronClassifier } from './pages/peceptron-classifier/peceptron-classifier';
import { PolynomialReg } from './pages/polynomial-reg/polynomial-reg';
import { LinearSVM } from './pages/linear-svm/linear-svm';
import { TrainComponent } from './pages/trainsvm/train';

// export const routes: Routes = [
//   {
//     path: '',
//     component: Home,
//   },
//   {
//     path: 'models/linear-regression',
//     component: LinearReg,
//   },
//   {
//     path: 'models/knn',
//     component: Knn,
//   },
//   {
//     path: 'models/logistic-regression',
//     component: LogisticReg,
//   },
//   {
//     path: 'models/naive-bayes',
//     component: NaiveBayes,
//   },
//   {
//     path: 'models/peceptron-classifier',
//     component: PeceptronClassifier,
//   },
//   {
//     path: 'models/polynomial-regression',
//     component: PolynomialReg,
//   },
//   {
//     path: 'models/linear-svm',
//     component: LinearSVM,
//   },
//   {
//     path: 'models/train-linear-svm',
//     component: TrainComponent,
//   },
//   {
//     path: 'models/tiny-embedding-sim',
//     component: EmbeddingSimComponent,
//   },
// ];

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
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
