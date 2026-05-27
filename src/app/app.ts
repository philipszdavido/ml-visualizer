import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [FormsModule],
})
export class App implements OnInit {

  selectedModel: string = 'kmeans';
  numSamples: number = 40;
  learningRate: number = 0.1;

  X: number[][] = [];
  y: number[] = [];

  currentSampleIndex: number = 0;
  totalStepsTaken: number = 0;
  equationString: string = '';
  metricsTable: { name: string; value: string }[] = [];
  lossHistory: number[] = [];
  stepLabels: number[] = [];

  centroids: number[][] = [];
  clusterAssignments: number[] = [];
  kmeansPhase: 'assign' | 'update' = 'assign';

  treeSplitValue: number = 0;
  treeSplitFeature: number = 0;

  wNN: number[] = [0.2, -0.5];
  bNN: number = 0.1;

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
    this.lossHistory = [];
    this.stepLabels = [];
    this.totalStepsTaken = 0;
    this.currentSampleIndex = 0;

    if (this.selectedModel === 'kmeans') {

      for (let i = 0; i < this.numSamples; i++) {
        const r = Math.random();
        if (r < 0.33) this.X.push([this.randomNormal(-2, 0.5), this.randomNormal(-2, 0.5)]);
        else if (r < 0.66) this.X.push([this.randomNormal(2, 0.5), this.randomNormal(2, 0.5)]);
        else this.X.push([this.randomNormal(0, 0.6), this.randomNormal(2.5, 0.5)]);
        this.y.push(-1);
      }

      this.centroids = [
        [this.randomNormal(-1, 1), this.randomNormal(-1, 1)],
        [this.randomNormal(0, 1), this.randomNormal(1, 1)],
        [this.randomNormal(1, 1), this.randomNormal(-1, 1)],
      ];
      this.clusterAssignments = new Array(this.numSamples).fill(-1);
      this.kmeansPhase = 'assign';
    } else if (this.selectedModel === 'decisiontree') {

      for (let i = 0; i < this.numSamples; i++) {
        const x1 = Math.random() * 8 - 4;
        const x2 = Math.random() * 8 - 4;
        this.X.push([x1, x2]);
        this.y.push(x1 > 0.5 ? 1 : 0);
      }
      this.treeSplitValue = -2;
    } else if (this.selectedModel === 'neural') {

      for (let i = 0; i < this.numSamples; i++) {
        const x1 = Math.random() * 6 - 3;
        const x2 = Math.random() * 6 - 3;
        this.X.push([x1, x2]);
        this.y.push(x1 * x1 + x2 * x2 < 3.5 ? 1 : 0);
      }
      this.wNN = [this.randomNormal(0, 0.5), this.randomNormal(0, 0.5)];
      this.bNN = this.randomNormal(0, 0.2);
    }

    this.buildEquationAndMetrics();
    if (this.isBrowser && this.Plotly) this.updateVisualizations();
  }

  trainOneStep() {
    this.totalStepsTaken++;

    switch (this.selectedModel) {
      case 'kmeans': {
        if (this.kmeansPhase === 'assign') {

          for (let i = 0; i < this.X.length; i++) {
            let minD = Infinity;
            let closest = 0;
            for (let c = 0; c < this.centroids.length; c++) {
              const d =
                Math.pow(this.X[i][0] - this.centroids[c][0], 2) +
                Math.pow(this.X[i][1] - this.centroids[c][1], 2);
              if (d < minD) {
                minD = d;
                closest = c;
              }
            }
            this.clusterAssignments[i] = closest;
          }
          this.lossHistory.push(this.calculateWCSS());
          this.kmeansPhase = 'update';
        } else {

          for (let c = 0; c < this.centroids.length; c++) {
            const assignedPoints = this.X.filter((_, idx) => this.clusterAssignments[idx] === c);
            if (assignedPoints.length > 0) {
              const meanX =
                assignedPoints.reduce((sum, p) => sum + p[0], 0) / assignedPoints.length;
              const meanY =
                assignedPoints.reduce((sum, p) => sum + p[1], 0) / assignedPoints.length;
              this.centroids[c] = [meanX, meanY];
            }
          }
          this.lossHistory.push(this.calculateWCSS());
          this.kmeansPhase = 'assign';
        }
        break;
      }
      case 'decisiontree': {

        this.treeSplitValue += 0.4;
        if (this.treeSplitValue > 3) this.treeSplitValue = -3;
        this.lossHistory.push(this.calculateTreeEntropy());
        break;
      }
      case 'neural': {

        const xi = this.X[this.currentSampleIndex];
        const yi = this.y[this.currentSampleIndex];
        const net = this.wNN[0] * xi[0] + this.wNN[1] * xi[1] + this.bNN;
        const activation = 1 / (1 + Math.exp(-net));
        const error = activation - yi;

        this.wNN[0] -= this.learningRate * error * activation * (1 - activation) * xi[0];
        this.wNN[1] -= this.learningRate * error * activation * (1 - activation) * xi[1];
        this.bNN -= this.learningRate * error * activation * (1 - activation);

        this.lossHistory.push(this.calculateNeuralLoss());
        this.currentSampleIndex = (this.currentSampleIndex + 1) % this.X.length;
        break;
      }
    }

    this.stepLabels.push(this.totalStepsTaken);
    this.buildEquationAndMetrics();
    this.updateVisualizations();
  }

  private calculateWCSS(): number {
    return this.X.reduce((sum, xi, idx) => {
      const cIdx = this.clusterAssignments[idx];
      if (cIdx === -1) return sum;
      return (
        sum +
        Math.pow(xi[0] - this.centroids[cIdx][0], 2) +
        Math.pow(xi[1] - this.centroids[cIdx][1], 2)
      );
    }, 0);
  }

  private calculateTreeEntropy(): number {
    const leftLabels = this.y.filter((_, idx) => this.X[idx][0] <= this.treeSplitValue);
    const rightLabels = this.y.filter((_, idx) => this.X[idx][0] > this.treeSplitValue);

    const entropy = (labels: number[]) => {
      if (labels.length === 0) return 0;
      const p1 = labels.filter((l) => l === 1).length / labels.length;
      const p0 = 1 - p1;
      return -(p1 > 0 ? p1 * Math.log2(p1) : 0) - (p0 > 0 ? p0 * Math.log2(p0) : 0);
    };

    const total = this.y.length;
    return (
      (leftLabels.length / total) * entropy(leftLabels) +
      (rightLabels.length / total) * entropy(rightLabels)
    );
  }

  private calculateNeuralLoss(): number {
    return (
      this.X.reduce((sum, xi, i) => {
        const net = this.wNN[0] * xi[0] + this.wNN[1] * xi[1] + this.bNN;
        const act = 1 / (1 + Math.exp(-net));
        return sum + Math.pow(act - this.y[i], 2);
      }, 0) / this.X.length
    );
  }

  updateVisualizations() {
    if (!this.isBrowser || !this.Plotly) return;

    const traces: any[] = [];
    let layout = {
      xaxis: { range: [-5, 5], title: { text: 'x₁' } },
      yaxis: { range: [-5, 5], title: { text: 'x₂' } },
      height: 400,
    };

    if (this.selectedModel === 'kmeans') {
      const colors = ['#ef4444', '#3b82f6', '#10b981'];
      for (let c = 0; c < this.centroids.length; c++) {
        const cX = this.X.filter((_, i) => this.clusterAssignments[i] === c).map((p) => p[0]);
        const cY = this.X.filter((_, i) => this.clusterAssignments[i] === c).map((p) => p[1]);
        traces.push({
          x: cX,
          y: cY,
          mode: 'markers',
          name: `Cluster ${c}`,
          marker: { color: colors[c], size: 8 },
        });
      }

      const unassigned = this.X.filter((_, i) => this.clusterAssignments[i] === -1);
      if (unassigned.length > 0) {
        traces.push({
          x: unassigned.map((p) => p[0]),
          y: unassigned.map((p) => p[1]),
          mode: 'markers',
          name: 'Unassigned',
          marker: { color: '#94a3b8', size: 7 },
        });
      }

      traces.push({
        x: this.centroids.map((c) => c[0]),
        y: this.centroids.map((c) => c[1]),
        mode: 'markers',
        name: '🎯 Centroids',
        marker: { color: '#000000', size: 14, symbol: 'square' },
      });
    } else if (this.selectedModel === 'decisiontree') {
      const c1 = this.X.filter((_, i) => this.y[i] === 1);
      const c0 = this.X.filter((_, i) => this.y[i] === 0);
      traces.push({
        x: c1.map((p) => p[0]),
        y: c0.map((p) => p[1]),
        mode: 'markers',
        name: 'Class 1',
        marker: { color: '#10b981' },
      });
      traces.push({
        x: c0.map((p) => p[0]),
        y: c0.map((p) => p[1]),
        mode: 'markers',
        name: 'Class 0',
        marker: { color: '#6366f1' },
      });

      traces.push({
        x: [this.treeSplitValue, this.treeSplitValue],
        y: [-5, 5],
        mode: 'lines',
        name: 'Entropy Split Axis',
        line: { color: '#f59e0b', width: 3, dash: 'solid' },
      });
    } else if (this.selectedModel === 'neural') {
      const c1 = this.X.filter((_, i) => this.y[i] === 1);
      const c0 = this.X.filter((_, i) => this.y[i] === 0);
      traces.push({
        x: c1.map((p) => p[0]),
        y: c1.map((p) => p[1]),
        mode: 'markers',
        name: 'Inner Target',
        marker: { color: '#ec4899' },
      });
      traces.push({
        x: c0.map((p) => p[0]),
        y: c0.map((p) => p[1]),
        mode: 'markers',
        name: 'Outer Ring',
        marker: { color: '#3b82f6' },
      });

      const bX = [-5, 5];
      const bY = bX.map((x) => (-this.wNN[0] * x - this.bNN) / this.wNN[1]);
      traces.push({
        x: bX,
        y: bY,
        mode: 'lines',
        name: 'Decision Layer Threshold',
        line: { color: '#0f172a', width: 2 },
      });
    }

    this.Plotly.newPlot('modelPlot', traces, layout, { responsive: true });

    this.Plotly.newPlot(
      'lossPlot',
      [
        {
          x: this.stepLabels,
          y: this.lossHistory,
          mode: 'lines+markers',
          name: 'Objective Error',
          line: { color: '#f43f5e' },
        },
      ],
      {
        xaxis: { title: { text: 'Execution Steps Taken' } },
        yaxis: { title: { text: 'Objective Cost Metric' } },
        height: 160,
        margin: { t: 5, b: 35, l: 45, r: 15 },
      },
      { responsive: true },
    );
  }

  private buildEquationAndMetrics() {
    const fix = (v: number) => v.toFixed(3);
    this.metricsTable = [];

    switch (this.selectedModel) {
      case 'kmeans':
        this.equationString = `Phase Context: ${this.kmeansPhase.toUpperCase()} STEP`;
        this.metricsTable = [
          { name: 'Total WCSS Inertia Error', value: fix(this.calculateWCSS()) },
          {
            name: 'Centroid 0 coordinate',
            value: `[${fix(this.centroids[0][0])}, ${fix(this.centroids[0][1])}]`,
          },
          {
            name: 'Centroid 1 coordinate',
            value: `[${fix(this.centroids[1][0])}, ${fix(this.centroids[1][1])}]`,
          },
        ];
        break;
      case 'decisiontree':
        this.equationString = `Node Split Rules: If (x₁ <= ${fix(this.treeSplitValue)}) → Left Node`;
        this.metricsTable = [
          { name: 'Calculated Split Threshold', value: fix(this.treeSplitValue) },
          { name: 'Information Split Entropy Score', value: fix(this.calculateTreeEntropy()) },
        ];
        break;
      case 'neural':
        this.equationString = `Forward Output = σ(${fix(this.wNN[0])}x₁ + ${fix(this.wNN[1])}x₂ + ${fix(this.bNN)})`;
        this.metricsTable = [
          { name: 'Synaptic Weight w₁', value: fix(this.wNN[0]) },
          { name: 'Synaptic Weight w₂', value: fix(this.wNN[1]) },
          { name: 'Activation Neuron Bias (b)', value: fix(this.bNN) },
        ];
        break;
    }
  }

  private randomNormal(mean: number, stdDev: number): number {
    const u1 = Math.random(),
      u2 = Math.random();
    return mean + stdDev * (Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2));
  }
}
