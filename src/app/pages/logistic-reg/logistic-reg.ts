import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-logistic-reg',
  imports: [FormsModule],
  templateUrl: './logistic-reg.html',
  styleUrl: './logistic-reg.css',
})
export class LogisticReg {
  selectedModel: string = 'linear';
  numSamples: number = 40;
  learningRate: number = 0.05;

  X: number[][] = [];
  y: number[] = [];

  currentSampleIndex: number = 0;
  totalStepsTaken: number = 0;
  equationString: string = '';
  metricsTable: { name: string; value: string }[] = [];

  w: number[] = [0.0, 0.0, 0.0];
  b: number = 0.0;

  nbSummary: any = {
    posMean: [0, 0],
    posVar: [1, 1],
    negMean: [0, 0],
    negVar: [1, 1],
    priorPos: 0.5,
  };

  lossHistory: number[] = [];
  stepLabels: number[] = [];

  private isBrowser: boolean;
  private Plotly: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit() {
    this.initializeDataset();
    if (this.isBrowser) {
      this.Plotly = await import('plotly.js-dist-min');
      this.updateVisualizations();
    }
  }

  onModelChange() {
    this.initializeDataset();
  }

  initializeDataset() {
    this.X = [];
    this.y = [];
    this.w = [0, 0, 0];
    this.b = 0;
    this.currentSampleIndex = 0;
    this.totalStepsTaken = 0;
    this.lossHistory = [];
    this.stepLabels = [];

    const model = this.selectedModel;

    for (let i = 0; i < this.numSamples; i++) {
      if (model === 'linear' || model === 'poly') {
        const x = Math.random() * 8 - 4;
        const noise = this.randomNormal(0, 0.5);
        const target =
          model === 'linear' ? 1.5 * x - 0.5 + noise : 0.5 * (x * x) + 0.8 * x - 2 + noise;
        this.X.push([x]);
        this.y.push(target);
      } else {
        const isClass1 = i < this.numSamples / 2;
        const x1 = isClass1 ? this.randomNormal(1.8, 0.7) : this.randomNormal(-1.8, 0.7);
        const x2 = isClass1 ? this.randomNormal(1.8, 0.7) : this.randomNormal(-1.8, 0.7);
        this.X.push([x1, x2]);
        this.y.push(isClass1 ? 1 : 0);
      }
    }
    this.buildEquationAndMetrics();
    if (this.isBrowser && this.Plotly) this.updateVisualizations();
  }

  trainOneStep() {
    if (this.X.length === 0) return;

    const xi = this.X[this.currentSampleIndex];
    const yi = this.y[this.currentSampleIndex];
    this.totalStepsTaken++;

    switch (this.selectedModel) {
      case 'linear': {
        const pred = this.w[0] * xi[0] + this.b;
        const error = pred - yi;
        this.w[0] -= this.learningRate * (error * xi[0]);
        this.b -= this.learningRate * error;
        this.lossHistory.push(this.calculateMSE());
        break;
      }
      case 'poly': {
        // Polynomial Gradient Step: y = w1*x² + w0*x + b
        const pred = this.w[1] * (xi[0] * xi[0]) + this.w[0] * xi[0] + this.b;
        const error = pred - yi;
        this.w[1] -= this.learningRate * (error * xi[0] * xi[0] * 0.1);
        this.w[0] -= this.learningRate * (error * xi[0]);
        this.b -= this.learningRate * error;
        this.lossHistory.push(this.calculateMSE());
        break;
      }
      case 'logistic': {
        const linearModel = this.w[0] * xi[0] + this.w[1] * xi[1] + this.b;
        const pred = 1 / (1 + Math.exp(-linearModel));
        const error = pred - yi;
        this.w[0] -= this.learningRate * error * xi[0];
        this.w[1] -= this.learningRate * error * xi[1];
        this.b -= this.learningRate * error;
        this.lossHistory.push(this.calculateCrossEntropy());
        break;
      }
      case 'perceptron': {
        const activation = this.w[0] * xi[0] + this.w[1] * xi[1] + this.b;
        const pred = activation >= 0 ? 1 : 0;
        if (pred !== yi) {
          const sign = yi === 1 ? 1 : -1;
          this.w[0] += this.learningRate * sign * xi[0];
          this.w[1] += this.learningRate * sign * xi[1];
          this.b += this.learningRate * sign;
        }
        this.lossHistory.push(this.calculateMisclassifications());
        break;
      }
      case 'naivebayes': {
        const historySubset = this.X.slice(0, this.currentSampleIndex + 1);
        const labelsSubset = this.y.slice(0, this.currentSampleIndex + 1);
        this.updateNaiveBayesParameters(historySubset, labelsSubset);
        this.lossHistory.push(this.calculateMisclassifications());
        break;
      }
      case 'knn': {
        this.lossHistory.push(this.calculateMisclassifications());
        break;
      }
    }

    this.stepLabels.push(this.totalStepsTaken);
    this.currentSampleIndex = (this.currentSampleIndex + 1) % this.X.length;
    this.buildEquationAndMetrics();
    this.updateVisualizations();
  }

  private calculateMSE(): number {
    return (
      this.X.reduce((sum, xi, i) => {
        const pred =
          this.selectedModel === 'linear'
            ? this.w[0] * xi[0] + this.b
            : this.w[1] * xi[0] * xi[0] + this.w[0] * xi[0] + this.b;
        return sum + Math.pow(pred - this.y[i], 2);
      }, 0) / this.X.length
    );
  }

  private calculateCrossEntropy(): number {
    return (
      -this.X.reduce((sum, xi, i) => {
        const net = this.w[0] * xi[0] + this.w[1] * xi[1] + this.b;
        const p = Math.max(1e-15, Math.min(1 - 1e-15, 1 / (1 + Math.exp(-net))));
        return sum + (this.y[i] * Math.log(p) + (1 - this.y[i]) * Math.log(1 - p));
      }, 0) / this.X.length
    );
  }

  private calculateMisclassifications(): number {
    let wrong = 0;
    for (let i = 0; i < this.X.length; i++) {
      const xi = this.X[i];
      let pred = 0;
      if (this.selectedModel === 'perceptron') {
        pred = this.w[0] * xi[0] + this.w[1] * xi[1] + this.b >= 0 ? 1 : 0;
      } else if (this.selectedModel === 'naivebayes') {
        pred = this.predictNB(xi);
      } else if (this.selectedModel === 'knn') {
        pred = this.predictKNN(xi, 3);
      }
      if (pred !== this.y[i]) wrong++;
    }
    return wrong;
  }

  private updateNaiveBayesParameters(X_sub: number[][], y_sub: number[]) {
    const pos = X_sub.filter((_, idx) => y_sub[idx] === 1);
    const neg = X_sub.filter((_, idx) => y_sub[idx] === 0);

    this.nbSummary.priorPos = pos.length / Math.max(1, X_sub.length);

    if (pos.length > 0) {
      this.nbSummary.posMean = [this.mean(pos, 0), this.mean(pos, 1)];
      this.nbSummary.posVar = [
        Math.max(0.1, this.variance(pos, this.nbSummary.posMean[0], 0)),
        Math.max(0.1, this.variance(pos, this.nbSummary.posMean[1], 1)),
      ];
    }
    if (neg.length > 0) {
      this.nbSummary.negMean = [this.mean(neg, 0), this.mean(neg, 1)];
      this.nbSummary.negVar = [
        Math.max(0.1, this.variance(neg, this.nbSummary.negMean[0], 0)),
        Math.max(0.1, this.variance(neg, this.nbSummary.negMean[1], 1)),
      ];
    }
  }

  private predictNB(xi: number[]): number {
    const pdf = (x: number, m: number, v: number) =>
      (1 / Math.sqrt(2 * Math.PI * v)) * Math.exp(-Math.pow(x - m, 2) / (2 * v));
    const pPos =
      Math.log(this.nbSummary.priorPos || 0.5) +
      Math.log(pdf(xi[0], this.nbSummary.posMean[0], this.nbSummary.posVar[0])) +
      Math.log(pdf(xi[1], this.nbSummary.posMean[1], this.nbSummary.posVar[1]));
    const pNeg =
      Math.log(1 - this.nbSummary.priorPos || 0.5) +
      Math.log(pdf(xi[0], this.nbSummary.negMean[0], this.nbSummary.negVar[0])) +
      Math.log(pdf(xi[1], this.nbSummary.negMean[1], this.nbSummary.negVar[1]));
    return pPos > pNeg ? 1 : 0;
  }

  private predictKNN(xi: number[], k: number): number {
    const dists = this.X.map((xVal, idx) => ({
      dist: Math.sqrt(Math.pow(xVal[0] - xi[0], 2) + Math.pow((xVal[1] || 0) - (xi[1] || 0), 2)),
      label: this.y[idx],
    })).sort((a, b) => a.dist - b.dist);
    const neighbors = dists.slice(0, k);
    const score = neighbors.reduce((acc, curr) => acc + curr.label, 0);
    return score / k >= 0.5 ? 1 : 0;
  }

  updateVisualizations() {
    if (!this.isBrowser || !this.Plotly) return;

    const model = this.selectedModel;
    const dataTraces: any[] = [];
    let layout = {};

    if (model === 'linear' || model === 'poly') {
      dataTraces.push({
        x: this.X.map((p) => p[0]),
        y: this.y,
        mode: 'markers',
        name: 'Actual Data Points',
        marker: { color: '#2563eb' },
      });

      const lineX: number[] = [];
      for (let x = -5; x <= 5; x += 0.2) lineX.push(x);

      const lineY = lineX.map((x) =>
        model === 'linear' ? this.w[0] * x + this.b : this.w[1] * x * x + this.w[0] * x + this.b,
      );

      dataTraces.push({
        x: lineX,
        y: lineY,
        mode: 'lines',
        name: 'Model Prediction Curve',
        line: { color: '#ef4444', width: 3 },
      });
      layout = {
        xaxis: { title: { text: 'Input Feature (x)' }, range: [-5, 5] },
        yaxis: { title: { text: 'Target Continuous Output (y)' }, range: [-6, 6] },
        height: 400,
      };
    } else {
      const c1X = this.X.filter((_, idx) => this.y[idx] === 1).map((p) => p[0]);
      const c1Y = this.X.filter((_, idx) => this.y[idx] === 1).map((p) => p[1]);
      const c0X = this.X.filter((_, idx) => this.y[idx] === 0).map((p) => p[0]);
      const c0Y = this.X.filter((_, idx) => this.y[idx] === 0).map((p) => p[1]);

      dataTraces.push({
        x: c1X,
        y: c1Y,
        mode: 'markers',
        name: 'Class 1',
        marker: { color: '#10b981', symbol: 'diamond', size: 9 },
      });
      dataTraces.push({
        x: c0X,
        y: c0Y,
        mode: 'markers',
        name: 'Class 0',
        marker: { color: '#6366f1', symbol: 'circle', size: 9 },
      });

      if (model === 'logistic' || model === 'perceptron') {
        const bX = [-5, 5];
        const bY = bX.map((x) => (-this.w[0] * x - this.b) / this.w[1]);
        dataTraces.push({
          x: bX,
          y: bY,
          mode: 'lines',
          name: 'Hyperplane Limit',
          line: { color: '#111827', width: 2.5 },
        });
      }
      layout = {
        xaxis: { title: { text: 'Feature x₁' }, range: [-5, 5] },
        yaxis: { title: { text: 'Feature x₂' }, range: [-5, 5] },
        height: 400,
      };
    }

    if (this.X[this.currentSampleIndex]) {
      dataTraces.push({
        x: [this.X[this.currentSampleIndex][0]],
        y: [this.X[this.currentSampleIndex][1] || this.y[this.currentSampleIndex]],
        mode: 'markers',
        name: '👉 Focus Point',
        marker: { color: '#f59e0b', size: 16, symbol: 'star', line: { color: '#000', width: 2 } },
      });
    }

    this.Plotly.newPlot('modelPlot', dataTraces, layout as any, { responsive: true });

    this.Plotly.newPlot(
      'lossPlot',
      [
        {
          x: this.stepLabels,
          y: this.lossHistory,
          mode: 'lines+markers',
          name: 'Performance Metric',
          line: { color: '#a855f7' },
        },
      ],
      {
        xaxis: { title: { text: 'Gradient Evaluation Clicks' } },
        yaxis: { title: { text: 'Loss Trend Value' } },
        height: 160,
        margin: { t: 5, b: 35, l: 45, r: 15 },
      },
      { responsive: true },
    );
  }

  private buildEquationAndMetrics() {
    this.metricsTable = [];
    const fix = (v: number) => v.toFixed(3);

    switch (this.selectedModel) {
      case 'linear':
        this.equationString = `ŷ = ${fix(this.w[0])}x + (${fix(this.b)})`;
        this.metricsTable = [
          { name: 'Slope Weight (w₁)', value: fix(this.w[0]) },
          { name: 'Intercept Bias (b)', value: fix(this.b) },
        ];
        break;
      case 'poly':
        this.equationString = `ŷ = ${fix(this.w[1])}x² + ${fix(this.w[0])}x + (${fix(this.b)})`;
        this.metricsTable = [
          { name: 'Quadratic Weight (w₂)', value: fix(this.w[1]) },
          { name: 'Linear Slope (w₁)', value: fix(this.w[0]) },
          { name: 'Bias (b)', value: fix(this.b) },
        ];
        break;
      case 'logistic':
        this.equationString = `P(y=1) = σ(${fix(this.w[0])}x₁ + ${fix(this.w[1])}x₂ + ${fix(this.b)})`;
        this.metricsTable = [
          { name: 'Weight 1', value: fix(this.w[0]) },
          { name: 'Weight 2', value: fix(this.w[1]) },
          { name: 'Bias Offset', value: fix(this.b) },
        ];
        break;
      case 'perceptron':
        this.equationString = `Output = Step(${fix(this.w[0])}x₁ + ${fix(this.w[1])}x₂ + ${fix(this.b)})`;
        this.metricsTable = [
          { name: 'Feature 1 Weight', value: fix(this.w[0]) },
          { name: 'Feature 2 Weight', value: fix(this.w[1]) },
          { name: 'Activation Shift', value: fix(this.b) },
        ];
        break;
      case 'naivebayes':
        this.equationString = `P(C_k|X) ∝ P(C_k) ∏ P(x_i|C_k)`;
        this.metricsTable = [
          { name: 'Class 1 Prior', value: fix(this.nbSummary.priorPos) },
          {
            name: 'Class 1 Centroid',
            value: `[${fix(this.nbSummary.posMean[0])}, ${fix(this.nbSummary.posMean[1])}]`,
          },
          {
            name: 'Class 0 Centroid',
            value: `[${fix(this.nbSummary.negMean[0])}, ${fix(this.nbSummary.negMean[1])}]`,
          },
        ];
        break;
      case 'knn':
        this.equationString = `ŷ = Mode(y_i ∈ k-Nearest Neighbors)`;
        this.metricsTable = [
          { name: 'Hyperparameter k', value: '3' },
          { name: 'Distance Function', value: 'Euclidean Vector Space' },
        ];
        break;
    }
  }

  private mean = (arr: number[][], dim: number) =>
    arr.reduce((acc, v) => acc + v[dim], 0) / arr.length;
  private variance = (arr: number[][], mean: number, dim: number) =>
    arr.reduce((acc, v) => acc + Math.pow(v[dim] - mean, 2), 0) / arr.length;
  private randomNormal(mean: number, stdDev: number): number {
    const u1 = Math.random(),
      u2 = Math.random();
    return mean + stdDev * (Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2));
  }
}
