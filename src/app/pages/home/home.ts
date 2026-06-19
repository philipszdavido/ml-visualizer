import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface MLModelMeta {
  id: string;
  name: string;
  type: 'Supervised' | 'Unsupervised';
  target: 'Classification' | 'Regression' | 'Clustering' | 'Dimensionality Reduction';
  driver: string;
  description: string;
  complexity: {
    train: string;
    inference: string;
  };
}

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  models: MLModelMeta[] = [
    {
      id: 'tiny-embedding-sim',
      name: 'Neural Network / Embedding Engine',
      type: 'Supervised',
      target: 'Classification',
      driver: 'Gradient Descent / Chain Rule',
      description:
        'Multi-layer matrix lookup architecture updating weights and processing structural vector transformations live.',
      complexity: { train: 'O(E · V · D)', inference: 'Fast' },
    },
    {
      id: 'kmeans-clustering',
      name: 'k-Means Engine',
      type: 'Unsupervised',
      target: 'Clustering',
      driver: 'Euclidean Space L2 Norm',
      description:
        'Iterative partition engine moving k cluster centroids to center points until cluster boundary stabilization.',
      complexity: { train: 'O(I · K · N · M)', inference: 'Moderate' },
    },
    {
      id: 'naive-bayes',
      name: 'Naive Bayes Classifier',
      type: 'Supervised',
      target: 'Classification',
      driver: 'Conditional Probability',
      description:
        'Log-likelihood probabilistic calculator utilizing strict feature independence assumptions for instant training.',
      complexity: { train: 'O(N · D)', inference: 'Extremely Fast' },
    },
    {
      id: 'knn-classifier',
      name: 'k-Nearest Neighbors',
      type: 'Supervised',
      target: 'Classification',
      driver: 'Instance Distance Matching',
      description:
        'Lazy non-parametric algorithm mapping immediate neighborhood density matrices without an explicit training step.',
      complexity: { train: 'O(1)', inference: 'Slow O(N · D)' },
    },
    {
      id: 'linear-regression',
      name: 'Linear Regression Engine',
      type: 'Supervised',
      target: 'Regression',
      driver: 'Ordinary Least Squares',
      description:
        'Fits a continuous optimized hyperplane across scalar metrics by minimizing residual sums of squares.',
      complexity: { train: 'O(D³ + N·D²)', inference: 'Instant O(D)' },
    },
    {
      id: 'logistic-regression',
      name: 'Logistic Regression',
      type: 'Supervised',
      target: 'Classification',
      driver: 'Sigmoid / Cross-Entropy',
      description:
        'Maps binary or multinomial classes by driving dot products through a logistic function to bound outputs between 0 and 1.',
      complexity: { train: 'O(N · D)', inference: 'Instant O(D)' },
    },
    {
      id: 'svm-classifier',
      name: 'Support Vector Machine',
      type: 'Supervised',
      target: 'Classification',
      driver: 'Hinge Loss / Convex Opt',
      description:
        'Maximizes the geometric margin between boundary vectors. Includes structural kernel options for non-linear boundary maps.',
      complexity: { train: 'O(N² · D) to O(N³ · D)', inference: 'O(S · D)' },
    },
    {
      id: 'decision-tree',
      name: 'Decision Tree (ID3/CART)',
      type: 'Supervised',
      target: 'Classification',
      driver: 'Shannon Entropy / Gini Impurity',
      description:
        'Greedy recursive feature splitting engine built on information gain metrics to construct explicit programmatic parsing branches.',
      complexity: { train: 'O(D · N log N)', inference: 'Fast O(Tree Depth)' },
    },
    {
      id: 'random-forest',
      name: 'Random Forest Ensemble',
      type: 'Supervised',
      target: 'Classification',
      driver: 'Bootstrap Aggregation (Bagging)',
      description:
        'Constructs an uncorrelated forest of structural decision trees, averaging node parsing to drop model variance errors.',
      complexity: { train: 'O(T · D · N log N)', inference: 'O(T · Tree Depth)' },
    },
    {
      id: 'pca-reduction',
      name: 'Principal Component Analysis (PCA)',
      type: 'Unsupervised',
      target: 'Dimensionality Reduction',
      driver: 'Covariance Eigenvalues / SVD',
      description:
        'Orthogonal linear transform mapping data covariance vectors onto high-variance directions to condense dimensional profiles.',
      complexity: { train: 'O(D³ + N · D²)', inference: 'O(D · K)' },
    },
    {
      id: 'peceptron-classifier',
      name: 'Peceptron Classifier',
      type: 'Unsupervised',
      target: 'Dimensionality Reduction',
      driver: 'Covariance Eigenvalues / SVD',
      description:
        'Orthogonal linear transform mapping data covariance vectors onto high-variance directions to condense dimensional profiles.',
      complexity: { train: 'O(D³ + N · D²)', inference: 'O(D · K)' },
    },
    {
      id: 'polynomial-regression',
      name: 'Polynomial Regression (PCA)',
      type: 'Unsupervised',
      target: 'Dimensionality Reduction',
      driver: 'Covariance Eigenvalues / SVD',
      description:
        'Orthogonal linear transform mapping data covariance vectors onto high-variance directions to condense dimensional profiles.',
      complexity: { train: 'O(D³ + N · D²)', inference: 'O(D · K)' },
    },
    {
      id: 'linear-svm',
      name: 'Linear SVM',
      type: 'Supervised',
      target: 'Dimensionality Reduction',
      driver: 'Covariance Eigenvalues / SVD',
      description:
        'Orthogonal linear transform mapping data covariance vectors onto high-variance directions to condense dimensional profiles.',
      complexity: { train: 'O(D³ + N · D²)', inference: 'O(D · K)' },
    },
    {
      id: 'train-linear-svm',
      name: 'Train SVM',
      type: 'Supervised',
      target: 'Dimensionality Reduction',
      driver: 'Covariance Eigenvalues / SVD',
      description:
        'Orthogonal linear transform mapping data covariance vectors onto high-variance directions to condense dimensional profiles.',
      complexity: { train: 'O(D³ + N · D²)', inference: 'O(D · K)' },
    },
  ];

  constructor(private router: Router) {}

  async navigateToModel(modelId: string): Promise<void> {
    await this.router.navigate(['/models', modelId]);
  }
}
