import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Plotly from 'plotly.js-dist-min';

interface IterationState {
  w: number[];
  b: number;
  loss: number;
}

@Component({
  selector: 'app-linear-svm',
  templateUrl: './linear-svm.component.html',
  styleUrls: ['./linear-svm.component.css'],
  imports: [DecimalPipe, FormsModule],
})
export class LinearSVM implements OnInit {
  numSamples: number = 40;
  learningRate: number = 0.01;
  C: number = 1.0;
  epochs: number = 1000;

  currentIteration: number = 0;
  X: number[][] = [];
  y: number[] = [];
  history: IterationState[] = [];

  currentW: number[] = [0, 0];
  currentB: number = 0;
  currentLoss: number = 0;

  ngOnInit() {
    this.generateData();
    this.trainSVM();
  }

  generateData() {
    this.X = [];
    this.y = [];

    for (let i = 0; i < this.numSamples; i++) {
      const isClass1 = i < this.numSamples / 2;
      const x1 = isClass1 ? this.randomNormal(2, 0.8) : this.randomNormal(-2, 0.8);
      const x2 = isClass1 ? this.randomNormal(2, 0.8) : this.randomNormal(-2, 0.8);

      this.X.push([x1, x2]);
      this.y.push(isClass1 ? 1 : -1);
    }
    this.trainSVM();
  }

  private randomNormal(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    return mean + stdDev * randStdNormal;
  }

  trainSVM() {
    const nFeatures = 2;
    let w = [0.0, 0.0];
    let b = 0.0;
    this.history = [{ w: [...w], b, loss: NaN }];

    for (let epoch = 1; epoch <= this.epochs; epoch++) {
      let hingeLossSum = 0;

      for (let i = 0; i < this.X.length; i++) {
        const xi = this.X[i];
        const yi = this.y[i];
        const dotProduct = w[0] * xi[0] + w[1] * xi[1];
        const condition = yi * (dotProduct - b) >= 1;

        if (condition) {
          w[0] -= this.learningRate * (2 * (1 / this.C) * w[0]);
          w[1] -= this.learningRate * (2 * (1 / this.C) * w[1]);
        } else {
          w[0] -= this.learningRate * (2 * (1 / this.C) * w[0] - xi[0] * yi);
          w[1] -= this.learningRate * (2 * (1 / this.C) * w[1] - xi[1] * yi);
          b -= this.learningRate * yi;
        }

        hingeLossSum += Math.max(0, 1 - yi * (w[0] * xi[0] + w[1] * xi[1] - b));
      }

      const l2Norm = w[0] * w[0] + w[1] * w[1];
      const totalLoss = (1 / this.C) * l2Norm + hingeLossSum / this.y.length;

      this.history.push({ w: [...w], b, loss: totalLoss });
    }

    this.currentIteration = 0;
    this.updateStep();
  }

  updateStep() {
    const state = this.history[this.currentIteration];
    this.currentW = state.w;
    this.currentB = state.b;
    this.currentLoss = state.loss;

    this.plotDataAndBoundary();
    this.plotLossTrace();
  }

  plotDataAndBoundary() {
    const class1X = this.X.filter((_, idx) => this.y[idx] === 1).map((pt) => pt[0]);
    const class1Y = this.X.filter((_, idx) => this.y[idx] === 1).map((pt) => pt[1]);
    const classNeg1X = this.X.filter((_, idx) => this.y[idx] === -1).map((pt) => pt[0]);
    const classNeg1Y = this.X.filter((_, idx) => this.y[idx] === -1).map((pt) => pt[1]);

    const trace1 = {
      x: class1X,
      y: class1Y,
      mode: 'markers',
      name: 'Class +1',
      marker: { color: '#3b82f6', size: 10, symbol: 'x' },
    };
    const trace2 = {
      x: classNeg1X,
      y: classNeg1Y,
      mode: 'markers',
      name: 'Class -1',
      marker: { color: '#ef4444', size: 10, symbol: 'circle' },
    };

    const data: any[] = [trace1, trace2];

    const xMin = Math.min(...this.X.map((p) => p[0])) - 1;
    const xMax = Math.max(...this.X.map((p) => p[0])) + 1;
    const xVals = [xMin, xMax];

    if (this.currentW[0] !== 0 || this.currentW[1] !== 0) {
      const yBoundary = xVals.map(
        (x) => (-this.currentW[0] * x + this.currentB) / this.currentW[1],
      );

      const yMarginPos = xVals.map(
        (x) => (-this.currentW[0] * x + this.currentB + 1) / this.currentW[1],
      );

      const yMarginNeg = xVals.map(
        (x) => (-this.currentW[0] * x + this.currentB - 1) / this.currentW[1],
      );

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

    const layout: Partial<Plotly.Layout> = {
      xaxis: {
        range: [xMin, xMax],
        title: { text: 'Feature 1 (x₁)' },
      },
      yaxis: {
        range: [Math.min(...this.X.map((p) => p[1])) - 1, Math.max(...this.X.map((p) => p[1])) + 1],
        title: { text: 'Feature 2 (x₂)' },
      },
      margin: { t: 20, b: 40, l: 40, r: 20 },
      height: 450,
    };

    Plotly.newPlot('svmPlot', data, layout, { responsive: true });
  }

  plotLossTrace() {
    const losses = this.history.slice(1).map((h) => h.loss);
    const iterations = Array.from({ length: losses.length }, (_, i) => i + 1);

    const trace = {
      x: iterations,
      y: losses,
      mode: 'lines+markers',
      name: 'Loss',
      line: { color: '#8b5cf6' },
    };

    const layout: Partial<Plotly.Layout> = {
      xaxis: {
        title: { text: 'Iteration (Epoch)' },
      },
      yaxis: {
        title: { text: 'Total Objective Loss' },
      },
      margin: { t: 10, b: 40, l: 50, r: 20 },
      height: 200,
      shapes:
        this.currentIteration > 0
          ? [
              {
                type: 'line',
                x0: this.currentIteration,
                x1: this.currentIteration,
                y0: 0,
                y1: Math.max(...losses.filter((l) => !isNaN(l))),
                line: { color: '#f59e0b', width: 2, dash: 'dashdot' },
              },
            ]
          : [],
    };

    Plotly.newPlot('lossPlot', [trace], layout, { responsive: true });
  }
}
