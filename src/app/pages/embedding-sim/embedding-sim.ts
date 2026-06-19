import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StepMetrics {
  epoch: number;
  inputWord: string;
  targetWord: string;
  embedding: number[];
  logits: number[];
  probs: number[];
  loss: number;
  gradLogits: number[];
  gradEmbedding: number[];
  gradW: number[][];
}

@Component({
  selector: 'app-embedding-sim',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './embedding-sim.html',
  styleUrl: './embedding-sim.css',
})
export class EmbeddingSimComponent {
  vocab = ['dog', 'puppy', 'ball'];
  tokenToId: Record<string, number> = { dog: 0, puppy: 1, ball: 2 };
  embeddingSize = 2;
  vocabSize = 3;
  learningRate = 0.1;
  epochCount = 0;

  embeddings = [
    [0.2, -0.3], // dog
    [0.9, 0.1], // puppy
    [0.4, 0.7], // ball
  ];

  W = [
    [0.5, 0.2],
    [0.1, 0.4],
    [0.7, 0.3],
  ];

  metrics: StepMetrics | null = null;

  constructor() {
    this.computeInitialMetrics();
  }

  computeInitialMetrics() {
    const inputId = this.tokenToId['dog'];
    const targetId = this.tokenToId['ball'];
    const embedding = [...this.embeddings[inputId]];
    const logits = this.matVecMul(this.W, embedding);
    const probs = this.softmax(logits);
    const loss = this.crossEntropy(probs, targetId);

    this.metrics = {
      epoch: this.epochCount,
      inputWord: 'dog',
      targetWord: 'ball',
      embedding,
      logits,
      probs,
      loss,
      gradLogits: new Array(this.vocabSize).fill(0),
      gradEmbedding: new Array(this.embeddingSize).fill(0),
      gradW: Array.from({ length: this.vocabSize }, () => new Array(this.embeddingSize).fill(0)),
    };
  }

  runSingleStep() {
    this.epochCount++;
    const inputWord = 'dog';
    const targetWord = 'ball';
    const inputId = this.tokenToId[inputWord];
    const targetId = this.tokenToId[targetWord];

    const embedding = [...this.embeddings[inputId]];
    const logits = this.matVecMul(this.W, embedding);
    const probs = this.softmax(logits);
    const loss = this.crossEntropy(probs, targetId);

    const gradLogits = this.computeLogitGradients(probs, targetId);
    const gradEmbedding = this.embeddingGradient(gradLogits, this.W);
    const gradW = this.weightGradient(gradLogits, embedding);

    for (let i = 0; i < this.embeddingSize; i++) {
      this.embeddings[inputId][i] -= this.learningRate * gradEmbedding[i];
    }

    for (let row = 0; row < this.vocabSize; row++) {
      for (let col = 0; col < this.embeddingSize; col++) {
        this.W[row][col] -= this.learningRate * gradW[row][col];
      }
    }

    this.metrics = {
      epoch: this.epochCount,
      inputWord,
      targetWord,
      embedding,
      logits,
      probs,
      loss,
      gradLogits,
      gradEmbedding,
      gradW,
    };
  }

  resetSimulation() {
    this.epochCount = 0;
    this.embeddings = [
      [0.2, -0.3],
      [0.9, 0.1],
      [0.4, 0.7],
    ];
    this.W = [
      [0.5, 0.2],
      [0.1, 0.4],
      [0.7, 0.3],
    ];
    this.computeInitialMetrics();
  }

  matVecMul(matrix: number[][], vector: number[]): number[] {
    return matrix.map((row) => row.reduce((sum, value, i) => sum + value * vector[i], 0));
  }

  softmax(x: number[]): number[] {
    const max = Math.max(...x);
    const exps = x.map((v) => Math.exp(v - max));
    const total = exps.reduce((a, b) => a + b, 0);
    return exps.map((v) => v / total);
  }

  crossEntropy(probs: number[], targetId: number): number {
    return -Math.log(probs[targetId]);
  }

  computeLogitGradients(probs: number[], targetId: number): number[] {
    const grad = [...probs];
    grad[targetId] -= 1;
    return grad;
  }

  embeddingGradient(gradLogits: number[], W: number[][]): number[] {
    const grad = new Array(this.embeddingSize).fill(0);
    for (let row = 0; row < W.length; row++) {
      for (let col = 0; col < this.embeddingSize; col++) {
        grad[col] += gradLogits[row] * W[row][col];
      }
    }
    return grad;
  }

  weightGradient(gradLogits: number[], embedding: number[]): number[][] {
    return Array.from({ length: this.vocabSize }, (_, row) =>
      Array.from({ length: this.embeddingSize }, (_, col) => gradLogits[row] * embedding[col]),
    );
  }

  getSvgX(val: number): number {
    return 150 + val * 90;
  }

  getSvgY(val: number): number {
    return 150 - val * 90;
  }
}
