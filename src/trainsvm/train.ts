import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-train',
  templateUrl: './train.html',
  styleUrls: ['./train.css'],
  imports: [DecimalPipe, FormsModule],
})
export class TrainComponent implements OnInit {

  numSamples: number = 40;
  learningRate: number = 0.05;
  C: number = 1.0;

  X: number[][] = [];
  y: number[] = [];
  currentSampleIndex: number = 0;
  totalStepsTaken: number = 0;

  w: number[] = [0.0, 0.0];
  b: number = 0.0;
  currentLoss: number = 0;

  lossHistory: number[] = [];
  iterationLabels: number[] = [];

  private isBrowser: boolean;
  private Plotly: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit() {
    this.resetSimulation();

    if (this.isBrowser) {
      this.Plotly = await import('plotly.js-dist-min');
      this.updatePlots();
    }
  }

  resetSimulation() {
    this.X = [];
    this.y = [];
    this.w = [0.0, 0.0];
    this.b = 0.0;
    this.currentSampleIndex = 0;
    this.totalStepsTaken = 0;
    this.lossHistory = [];
    this.iterationLabels = [];
    this.currentLoss = 0;

    for (let i = 0; i < this.numSamples; i++) {
      const isClass1 = i < this.numSamples / 2;
      const x1 = isClass1 ? this.randomNormal(1.5, 0.6) : this.randomNormal(-1.5, 0.6);
      const x2 = isClass1 ? this.randomNormal(1.5, 0.6) : this.randomNormal(-1.5, 0.6);

      this.X.push([x1, x2]);
      this.y.push(isClass1 ? 1 : -1);
    }

    if (this.isBrowser && this.Plotly) {
      this.updatePlots();
    }
  }

  trainOneStep() {
    if (this.X.length === 0) return;

    const xi = this.X[this.currentSampleIndex];
    const yi = this.y[this.currentSampleIndex];

    const dotProduct = this.w[0] * xi[0] + this.w[1] * xi[1];
    const condition = yi * (dotProduct - this.b) >= 1;

    if (condition) {

      this.w[0] -= this.learningRate * (2 * (1 / this.C) * this.w[0]);
      this.w[1] -= this.learningRate * (2 * (1 / this.C) * this.w[1]);
    } else {

      this.w[0] -= this.learningRate * (2 * (1 / this.C) * this.w[0] - xi[0] * yi);
      this.w[1] -= this.learningRate * (2 * (1 / this.C) * this.w[1] - xi[1] * yi);
      this.b -= this.learningRate * yi;
    }

    this.currentLoss = this.calculateCurrentLoss();
    this.totalStepsTaken++;

    this.lossHistory.push(this.currentLoss);
    this.iterationLabels.push(this.totalStepsTaken);

    this.currentSampleIndex = (this.currentSampleIndex + 1) % this.X.length;

    this.updatePlots();
  }

  calculateCurrentLoss(): number {
    let hingeLossSum = 0;
    for (let i = 0; i < this.X.length; i++) {
      const dot = this.w[0] * this.X[i][0] + this.w[1] * this.X[i][1];
      hingeLossSum += Math.max(0, 1 - this.y[i] * (dot - this.b));
    }
    const l2Norm = this.w[0] * this.w[0] + this.w[1] * this.w[1];
    return (1 / this.C) * l2Norm + hingeLossSum / this.y.length;
  }

  updatePlots() {
    if (!this.isBrowser || !this.Plotly) return;
    this.plotDataAndBoundary();
    this.plotLossTrace();
  }

  plotDataAndBoundary() {
    const class1X = this.X.filter((_, idx) => this.y[idx] === 1).map((pt) => pt[0]);
    const class1Y = this.X.filter((_, idx) => this.y[idx] === 1).map((pt) => pt[1]);
    const classNeg1X = this.X.filter((_, idx) => this.y[idx] === -1).map((pt) => pt[0]);
    const classNeg1Y = this.X.filter((_, idx) => this.y[idx] === -1).map((pt) => pt[1]);

    const data: any[] = [
      {
        x: class1X,
        y: class1Y,
        mode: 'markers',
        name: 'Class +1',
        marker: { color: '#3b82f6', size: 10, symbol: 'x' },
      },
      {
        x: classNeg1X,
        y: classNeg1Y,
        mode: 'markers',
        name: 'Class -1',
        marker: { color: '#ef4444', size: 10, symbol: 'circle' },
      },
    ];

    const activeX = this.X[this.currentSampleIndex];
    if (activeX) {
      data.push({
        x: [activeX[0]],
        y: [activeX[1]],
        mode: 'markers',
        name: 'Next Sample to Process',
        marker: { color: '#f59e0b', size: 18, line: { color: '#000', width: 2 }, symbol: 'star' },
      });
    }

    const xMin = -5,
      xMax = 5;
    const xVals = [xMin, xMax];

    if (this.w[0] !== 0 || this.w[1] !== 0) {
      const yBoundary = xVals.map((x) => (-this.w[0] * x + this.b) / this.w[1]);
      const yMarginPos = xVals.map((x) => (-this.w[0] * x + this.b + 1) / this.w[1]);
      const yMarginNeg = xVals.map((x) => (-this.w[0] * x + this.b - 1) / this.w[1]);

      data.push({
        x: xVals,
        y: yBoundary,
        mode: 'lines',
        name: 'Decision Boundary',
        line: { color: '#111827', width: 3 },
      });
      data.push({
        x: xVals,
        y: yMarginPos,
        mode: 'lines',
        name: 'Margin +1',
        line: { color: '#3b82f6', width: 1, dash: 'dash' },
      });
      data.push({
        x: xVals,
        y: yMarginNeg,
        mode: 'lines',
        name: 'Margin -1',
        line: { color: '#ef4444', width: 1, dash: 'dash' },
      });
    }

    const layout = {
      xaxis: { range: [xMin, xMax], title: { text: 'Feature 1 (x₁)' } },
      yaxis: { range: [-5, 5], title: { text: 'Feature 2 (x₂)' } },
      margin: { t: 20, b: 40, l: 40, r: 20 },
      height: 450,
    };

    this.Plotly.newPlot('svmPlot', data, layout, { responsive: true });
  }

  plotLossTrace() {
    const trace = {
      x: this.iterationLabels,
      y: this.lossHistory,
      mode: 'lines+markers',
      name: 'Loss Trend',
      line: { color: '#8b5cf6' },
    };

    const layout = {
      xaxis: { title: { text: 'Step Clicks' } },
      yaxis: { title: { text: 'Dataset Hinge Loss' } },
      margin: { t: 10, b: 40, l: 50, r: 20 },
      height: 180,
    };

    this.Plotly.newPlot('lossPlot', [trace], layout, { responsive: true });
  }

  private randomNormal(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    return mean + stdDev * (Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2));
  }
}
