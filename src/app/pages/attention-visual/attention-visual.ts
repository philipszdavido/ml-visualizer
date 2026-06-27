import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import Plotly from 'plotly.js-dist-min';
//
// interface Matrix {
//   name: string;
//   data: number[][];
//   rows: number;
//   cols: number;
// }
//
// @Component({
//   selector: 'app-attention-visual',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <div class="attention-container">
//       <header>
//         <h2>🧠 Self-Attention Mechanism Step-by-Step</h2>
//         <p>
//           Step through the linear transformations to see how $Q$, $K$, and $V$ are computed and
//           combined.
//         </p>
//       </header>
//
//       <div class="steps-pager">
//         <button
//           *ngFor="let stepNum of [1, 2, 3, 4, 5]; let i = index"
//           [class.active]="currentStep === stepNum"
//           (click)="currentStep = stepNum"
//         >
//           Step {{ stepNum }}: {{ stepLabels[i] }}
//         </button>
//       </div>
//
//       <section class="controls-card">
//         <h3>Interactive Inputs (Matrix $X$)</h3>
//         <p class="help-text">
//           Modify the token embedding values below to see the entire pipeline recalculate instantly.
//         </p>
//         <div class="matrix-grid-input">
//           <div *ngFor="let row of X.data; let rIdx = index" class="matrix-row-input">
//             <span class="token-label">Token {{ rIdx + 1 }}:</span>
//             <div class="input-group" *ngFor="let val of row; let cIdx = index">
//               <input
//                 type="number"
//                 step="0.1"
//                 [(ngModel)]="X.data[rIdx][cIdx]"
//                 (ngModelChange)="recalculatePipeline()"
//               />
//             </div>
//           </div>
//         </div>
//       </section>
//
//       <hr />
//
//       <main class="step-content">
//         <div *ngIf="currentStep === 1">
//           <h3>Step 1: Projecting Inputs into $Q$, $K$, $V$ Spaces</h3>
//           <p>
//             We multiply our Input Embedding ($X$) by three distinct weight matrices: $W_Q$, $W_K$,
//             and $W_V$. This maps our input tokens into specific spaces optimized for querying,
//             matching, and value representation.
//           </p>
//
//           <div class="visual-row">
//             <div class="math-block">
//               <h4>$Q = X cdot W_Q$</h4>
//               <div class="matrix-flex">
//                 <ng-container *ngTemplateOutlet="matrixTpl; context: { matrix: X }"></ng-container>
//                 <span class="operator">×</span>
//                 <ng-container *ngTemplateOutlet="matrixTpl; context: { matrix: WQ }"></ng-container>
//                 <span class="operator">=</span>
//                 <ng-container
//                   *ngTemplateOutlet="matrixTpl; context: { matrix: Q, highlight: true }"
//                 ></ng-container>
//               </div>
//             </div>
//           </div>
//
//           <div class="visual-row mt-4">
//             <div class="math-block">
//               <h4>$K = X cdot W_K$</h4>
//               <div class="matrix-flex">
//                 <ng-container *ngTemplateOutlet="matrixTpl; context: { matrix: X }"></ng-container>
//                 <span class="operator">×</span>
//                 <ng-container *ngTemplateOutlet="matrixTpl; context: { matrix: WK }"></ng-container>
//                 <span class="operator">=</span>
//                 <ng-container
//                   *ngTemplateOutlet="matrixTpl; context: { matrix: K, highlight: true }"
//                 ></ng-container>
//               </div>
//             </div>
//           </div>
//
//           <div class="visual-row mt-4">
//             <div class="math-block">
//               <h4>$V = X cdot W_V$</h4>
//               <div class="matrix-flex">
//                 <ng-container *ngTemplateOutlet="matrixTpl; context: { matrix: X }"></ng-container>
//                 <span class="operator">×</span>
//                 <ng-container *ngTemplateOutlet="matrixTpl; context: { matrix: WV }"></ng-container>
//                 <span class="operator">=</span>
//                 <ng-container
//                   *ngTemplateOutlet="matrixTpl; context: { matrix: V, highlight: true }"
//                 ></ng-container>
//               </div>
//             </div>
//           </div>
//         </div>
//
//         <div *ngIf="currentStep === 2">
//           <h3>Step 2: Calculating Raw Scores ($Q cdot K^T$)</h3>
//           <p>
//             We compute the dot product of the Queries ($Q$) and Keys ($K$) to determine how much
//             attention each token should pay to every other token. A higher dot product means higher
//             structural or semantic correlation.
//           </p>
//
//           <div class="math-block">
//             <h4>{{ '$	ext{Raw Scores} = Q cdot K^T$' }}</h4>
//             <div class="matrix-flex">
//               <ng-container *ngTemplateOutlet="matrixTpl; context: { matrix: Q }"></ng-container>
//               <span class="operator">×</span>
//               <div>
//                 <p class="matrix-caption">Transpose of $K$ ($K^T$)</p>
//                 <ng-container *ngTemplateOutlet="matrixTpl; context: { matrix: KT }"></ng-container>
//               </div>
//               <span class="operator">=</span>
//               <ng-container
//                 *ngTemplateOutlet="matrixTpl; context: { matrix: rawScores, highlight: true }"
//               ></ng-container>
//             </div>
//           </div>
//         </div>
//
//         @if (currentStep === 3) {
//           <div>
//             <h3>Step 3: Scaling the Scores</h3>
//             <!--          <p>To prevent extremely large values (which lead to vanishing gradients during backpropagation), we divide the raw scores by the square root of the key dimension ($d_k$). Here, $sqrt{d_k} = sqrt{2} approx 1.414$.</p>-->
//
//             <div class="math-block">
//               <h4>{{"$	ext{Scaled Scores} = rac{Q cdot K^T}{sqrt{d_k}}$"}}</h4>
//               <div class="matrix-flex">
//                 <ng-container
//                   *ngTemplateOutlet="matrixTpl; context: { matrix: rawScores }"
//                 ></ng-container>
//                 <span class="operator">÷ 1.414 =</span>
//                 <ng-container
//                   *ngTemplateOutlet="matrixTpl; context: { matrix: scaledScores, highlight: true }"
//                 ></ng-container>
//               </div>
//             </div>
//           </div>
//         }
//
//         <div *ngIf="currentStep === 4">
//           <h3>Step 4: Applying Softmax (Attention Weights)</h3>
//           <p>
//             We apply the Softmax function row-by-row. This normalizes the scaled scores into
//             probabilities between 0 and 1 that sum up to exactly 1.0. These represent the final
//             attention percentages.
//           </p>
//
//           <div class="math-block">
//             <!--            <h4>$	ext{Attention Weights} = 	ext{Softmax}left(rac{Q cdot K^T}{sqrt{d_k}}
// ight)$</h4>-->
//             <div class="matrix-flex">
//               <ng-container
//                 *ngTemplateOutlet="
//                   matrixTpl;
//                   context: { matrix: attentionWeights, highlight: true }
//                 "
//               ></ng-container>
//             </div>
//           </div>
//
//           <div class="heatmap-container mt-4">
//             <h4>Visual Distribution Heatmap</h4>
//             <div class="heatmap-grid">
//               <div *ngFor="let row of attentionWeights.data; let r = index" class="heatmap-row">
//                 <div
//                   *ngFor="let score of row; let c = index"
//                   class="heatmap-cell"
//                   [style.background-color]="'rgba(99, 102, 241, ' + score + ')'"
//                   [style.color]="score > 0.5 ? '#fff' : '#000'"
//                 >
//                   {{ score * 100 | number: '1.1-1' }}%
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//
//         <div *ngIf="currentStep === 5">
//           <!--          <h3>Step 5: Output Generation ($	ext{Attention Weights} cdot V$)</h3>-->
//           <p>
//             Finally, we multiply the Softmax attention weights by the Value matrix ($V$). This sums
//             up the contextual meaning of all tokens, weighted precisely by how much attention they
//             deserve.
//           </p>
//
//           <div class="math-block">
//             <!--            <h4>$	ext{Output} = 	ext{Attention} cdot V$</h4>-->
//             <div class="matrix-flex">
//               <ng-container
//                 *ngTemplateOutlet="matrixTpl; context: { matrix: attentionWeights }"
//               ></ng-container>
//               <span class="operator">×</span>
//               <ng-container *ngTemplateOutlet="matrixTpl; context: { matrix: V }"></ng-container>
//               <span class="operator">=</span>
//               <ng-container
//                 *ngTemplateOutlet="matrixTpl; context: { matrix: output, highlight: true }"
//               ></ng-container>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//
//     <ng-template #matrixTpl let-matrix="matrix" let-highlight="highlight">
//       <div class="matrix-wrapper" [class.highlighted-matrix]="highlight">
//         <div class="matrix-title">
//           {{ matrix.name }} <small>({{ matrix.rows }}×{{ matrix.cols }})</small>
//         </div>
//         <div class="matrix-brackets">
//           <div *ngFor="let row of matrix.data" class="matrix-row">
//             <span *ngFor="let val of row" class="matrix-cell">
//               {{ val | number: '1.2-2' }}
//             </span>
//           </div>
//         </div>
//       </div>
//     </ng-template>
//   `,
//   styles: [
//     `
//       .attention-container {
//         font-family:
//           system-ui,
//           -apple-system,
//           sans-serif;
//         padding: 2rem;
//         max-width: 1100px;
//         margin: 0 auto;
//         color: #1e293b;
//         background: #f8fafc;
//         border-radius: 12px;
//         box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
//       }
//       header h2 {
//         margin-bottom: 0.25rem;
//         color: #0f172a;
//       }
//       header p {
//         color: #64748b;
//         margin-top: 0;
//       }
//
//       .steps-pager {
//         display: flex;
//         gap: 0.5rem;
//         margin: 1.5rem 0;
//         flex-wrap: wrap;
//       }
//       .steps-pager button {
//         background: #e2e8f0;
//         border: none;
//         padding: 0.6rem 1rem;
//         border-radius: 6px;
//         cursor: pointer;
//         font-weight: 500;
//         transition: all 0.2s ease;
//       }
//       .steps-pager button.active {
//         background: #4f46e5;
//         color: #ffffff;
//       }
//
//       .controls-card {
//         background: #ffffff;
//         padding: 1.25rem;
//         border-radius: 8px;
//         border: 1px solid #e2e8f0;
//       }
//       .controls-card h3 {
//         margin-top: 0;
//         font-size: 1.1rem;
//       }
//       .help-text {
//         font-size: 0.85rem;
//         color: #64748b;
//         margin-top: -0.5rem;
//       }
//
//       .matrix-grid-input {
//         display: flex;
//         flex-direction: column;
//         gap: 0.5rem;
//       }
//       .matrix-row-input {
//         display: flex;
//         align-items: center;
//         gap: 0.75rem;
//       }
//       .token-label {
//         width: 70px;
//         font-weight: 600;
//         font-size: 0.85rem;
//         color: #475569;
//       }
//       .input-group input {
//         width: 60px;
//         padding: 0.35rem;
//         border: 1px solid #cbd5e1;
//         border-radius: 4px;
//         text-align: center;
//       }
//
//       .step-content {
//         background: #ffffff;
//         padding: 1.5rem;
//         border-radius: 8px;
//         border: 1px solid #e2e8f0;
//         min-height: 350px;
//       }
//
//       .math-block {
//         background: #fafafa;
//         padding: 1rem;
//         border-radius: 6px;
//         overflow-x: auto;
//       }
//       .matrix-flex {
//         display: flex;
//         align-items: center;
//         gap: 1rem;
//         flex-wrap: nowrap;
//         margin-top: 1rem;
//       }
//       .operator {
//         font-size: 1.5rem;
//         font-weight: bold;
//         color: #64748b;
//       }
//
//       /* Matrix Bracket Rendering */
//       .matrix-wrapper {
//         text-align: center;
//       }
//       .matrix-title {
//         font-size: 0.8rem;
//         font-weight: bold;
//         color: #475569;
//         margin-bottom: 0.25rem;
//       }
//       .matrix-caption {
//         font-size: 0.75rem;
//         color: #64748b;
//         margin: 0;
//       }
//       .matrix-brackets {
//         border-left: 2px solid #1e293b;
//         border-right: 2px solid #1e293b;
//         padding: 0 0.5rem;
//         border-radius: 4px;
//         display: inline-block;
//         background: #fff;
//       }
//       .matrix-row {
//         display: flex;
//         justify-content: center;
//         gap: 0.75rem;
//         margin: 0.25rem 0;
//       }
//       .matrix-cell {
//         min-width: 50px;
//         font-family: monospace;
//         font-size: 0.9rem;
//         text-align: right;
//       }
//       .highlighted-matrix .matrix-brackets {
//         border-color: #4f46e5;
//         background: #f5f3ff;
//       }
//
//       /* Heatmap styling */
//       .heatmap-grid {
//         display: inline-block;
//         border: 1px solid #cbd5e1;
//         border-radius: 4px;
//         overflow: hidden;
//       }
//       .heatmap-row {
//         display: flex;
//       }
//       .heatmap-cell {
//         width: 65px;
//         height: 45px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         font-family: monospace;
//         font-weight: bold;
//         font-size: 0.85rem;
//         transition: background-color 0.2s;
//       }
//       .mt-4 {
//         margin-top: 1rem;
//       }
//     `,
//   ],
// })
// export class AttentionVisual_ implements OnInit {
//   currentStep = 1;
//   stepLabels = ['Projections', 'Raw Scores', 'Scaling', 'Softmax', 'Output Context'];
//
//   // Dimensions: 3 Tokens (Rows), 2 Embedding Dimensions (Cols)
//   X: Matrix = {
//     name: 'X (Embeddings)',
//     rows: 3,
//     cols: 2,
//     data: [
//       [1.0, 0.5], // Token 1
//       [0.2, 1.8], // Token 2
//       [0.9, -0.3], // Token 3
//     ],
//   };
//
//   // Static weight projections for clean educational outcomes
//   WQ: Matrix = {
//     name: 'Wq',
//     rows: 2,
//     cols: 2,
//     data: [
//       [0.5, 0.1],
//       [-0.2, 0.8],
//     ],
//   };
//   WK: Matrix = {
//     name: 'Wk',
//     rows: 2,
//     cols: 2,
//     data: [
//       [0.2, 0.9],
//       [0.4, -0.1],
//     ],
//   };
//   WV: Matrix = {
//     name: 'Wv',
//     rows: 2,
//     cols: 2,
//     data: [
//       [0.7, 0.3],
//       [0.1, 0.6],
//     ],
//   };
//
//   // Computed Outputs
//   Q!: Matrix;
//   K!: Matrix;
//   V!: Matrix;
//   KT!: Matrix;
//   rawScores!: Matrix;
//   scaledScores!: Matrix;
//   attentionWeights!: Matrix;
//   output!: Matrix;
//
//   ngOnInit() {
//     this.recalculatePipeline();
//   }
//
//   recalculatePipeline() {
//     // 1. Projections
//     this.Q = {
//       name: 'Q (Queries)',
//       rows: 3,
//       cols: 2,
//       data: this.multiply(this.X.data, this.WQ.data),
//     };
//     this.K = { name: 'K (Keys)', rows: 3, cols: 2, data: this.multiply(this.X.data, this.WK.data) };
//     this.V = {
//       name: 'V (Values)',
//       rows: 3,
//       cols: 2,
//       data: this.multiply(this.X.data, this.WV.data),
//     };
//
//     // 2. Transpose K
//     this.KT = { name: 'Kᵀ', rows: 2, cols: 3, data: this.transpose(this.K.data) };
//
//     // 3. Raw attention scores (Q * K^T)
//     this.rawScores = {
//       name: 'Q · Kᵀ',
//       rows: 3,
//       cols: 3,
//       data: this.multiply(this.Q.data, this.KT.data),
//     };
//
//     // 4. Scaling (by sqrt(dk), dk=2 => sqrt(2) ≈ 1.4142)
//     const dkSqrt = Math.sqrt(2);
//     const scaledData = this.rawScores.data.map((row) => row.map((v) => v / dkSqrt));
//     this.scaledScores = { name: 'Scaled Scores', rows: 3, cols: 3, data: scaledData };
//
//     // 5. Softmax row-by-row
//     const softmaxData = this.scaledScores.data.map((row) => this.softmax(row));
//     this.attentionWeights = { name: 'Attention Weights (☉)', rows: 3, cols: 3, data: softmaxData };
//
//     // 6. Final Weighted Output (Attention Weights * V)
//     this.output = {
//       name: 'Output Matrix',
//       rows: 3,
//       cols: 2,
//       data: this.multiply(this.attentionWeights.data, this.V.data),
//     };
//   }
//
//   // --- Linear Algebra Core Utility Methods ---
//   private multiply(A: number[][], B: number[][]): number[][] {
//     const rowsA = A.length,
//       colsA = A[0].length;
//     const colsB = B[0].length;
//     const result: number[][] = Array.from({ length: rowsA }, () => new Array(colsB).fill(0));
//
//     for (let i = 0; i < rowsA; i++) {
//       for (let j = 0; j < colsB; j++) {
//         let sum = 0;
//         for (let k = 0; k < colsA; k++) {
//           sum += A[i][k] * B[k][j];
//         }
//         result[i][j] = sum;
//       }
//     }
//     return result;
//   }
//
//   private transpose(A: number[][]): number[][] {
//     return A[0].map((_, colIndex) => A.map((row) => row[colIndex]));
//   }
//
//   private softmax(vector: number[]): number[] {
//     const max = Math.max(...vector); // Stability trick
//     const exps = vector.map((v) => Math.exp(v - max));
//     const sumExps = exps.reduce((a, b) => a + b, 0);
//     return exps.map((e) => e / sumExps);
//   }
// }
//
// interface Matrix {
//   name: string;
//   data: number[][];
//   rows: number;
//   cols: number;
// }
//
// @Component({
//   selector: 'app-attention-visual',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <div class="attention-container">
//       <header>
//         <h2>🧠 Self-Attention Mechanism Step-by-Step</h2>
//         <p>
//           Step through the linear transformations to see both mathematical matrices and Plotly
//           charts update in real time.
//         </p>
//       </header>
//
//       <div class="steps-pager">
//         <button
//           *ngFor="let stepNum of [1, 2, 3, 4, 5]; let i = index"
//           [class.active]="currentStep === stepNum"
//           (click)="changeStep(stepNum)"
//         >
//           Step {{ stepNum }}: {{ stepLabels[i] }}
//         </button>
//       </div>
//
//       <section class="controls-card">
//         <h3>Interactive Inputs (Matrix $X$)</h3>
//         <p class="help-text">
//           Modify the token embedding values below to see the entire pipeline recalculate instantly.
//         </p>
//         <div class="matrix-grid-input">
//           <div *ngFor="let row of X.data; let rIdx = index" class="matrix-row-input">
//             <span class="token-label">Token {{ rIdx + 1 }}:</span>
//             <div class="input-group" *ngFor="let val of row; let cIdx = index">
//               <input
//                 type="number"
//                 step="0.1"
//                 [(ngModel)]="X.data[rIdx][cIdx]"
//                 (ngModelChange)="recalculatePipeline()"
//               />
//             </div>
//           </div>
//         </div>
//       </section>
//
//       <hr />
//
//       <main class="step-content">
//         <div [hidden]="currentStep !== 1">
//           <h3>Step 1: Projecting Inputs into $Q$, $K$, $V$ Spaces</h3>
//           <p>
//             We multiply our Input Embedding ($X$) by three distinct weight matrices: $W_Q$, $W_K$,
//             and $W_V$. This maps our input tokens into specific spaces optimized for querying,
//             matching, and value representation.
//           </p>
//
//           <div class="split-view">
//             <div class="math-column">
//               <div class="math-block">
//                 <h4>$Q = X cdot W_Q$</h4>
//                 <div class="matrix-flex">
//                   <ng-container
//                     *ngTemplateOutlet="matrixTpl; context: { matrix: X }"
//                   ></ng-container>
//                   <span class="operator">×</span>
//                   <ng-container
//                     *ngTemplateOutlet="matrixTpl; context: { matrix: WQ }"
//                   ></ng-container>
//                   <span class="operator">=</span>
//                   <ng-container
//                     *ngTemplateOutlet="matrixTpl; context: { matrix: Q, highlight: true }"
//                   ></ng-container>
//                 </div>
//               </div>
//               <div class="math-block mt-4">
//                 <h4>$K = X cdot W_K$</h4>
//                 <div class="matrix-flex">
//                   <ng-container
//                     *ngTemplateOutlet="matrixTpl; context: { matrix: X }"
//                   ></ng-container>
//                   <span class="operator">×</span>
//                   <ng-container
//                     *ngTemplateOutlet="matrixTpl; context: { matrix: WK }"
//                   ></ng-container>
//                   <span class="operator">=</span>
//                   <ng-container
//                     *ngTemplateOutlet="matrixTpl; context: { matrix: K, highlight: true }"
//                   ></ng-container>
//                 </div>
//               </div>
//               <div class="math-block mt-4">
//                 <h4>$V = X cdot W_V$</h4>
//                 <div class="matrix-flex">
//                   <ng-container
//                     *ngTemplateOutlet="matrixTpl; context: { matrix: X }"
//                   ></ng-container>
//                   <span class="operator">×</span>
//                   <ng-container
//                     *ngTemplateOutlet="matrixTpl; context: { matrix: WV }"
//                   ></ng-container>
//                   <span class="operator">=</span>
//                   <ng-container
//                     *ngTemplateOutlet="matrixTpl; context: { matrix: V, highlight: true }"
//                   ></ng-container>
//                 </div>
//               </div>
//             </div>
//
//             <div class="charts-column">
//               <div id="chart-x" class="plotly-chart"></div>
//               <div id="chart-q" class="plotly-chart"></div>
//               <div id="chart-k" class="plotly-chart"></div>
//               <div id="chart-v" class="plotly-chart"></div>
//             </div>
//           </div>
//         </div>
//
//         <div [hidden]="currentStep !== 2">
//           <h3>Step 2: Calculating Raw Scores ($Q cdot K^T$)</h3>
//           <p>
//             We compute the dot product of the Queries ($Q$) and Keys ($K$) to determine how much
//             attention each token should pay to every other token.
//           </p>
//
//           <div class="split-view">
//             <div class="math-block width-60">
//               <!--              <h4>$	ext{Raw Scores} = Q cdot K^T$</h4>-->
//               <div class="matrix-flex">
//                 <ng-container *ngTemplateOutlet="matrixTpl; context: { matrix: Q }"></ng-container>
//                 <span class="operator">×</span>
//                 <div>
//                   <p class="matrix-caption">Transpose $K^T$</p>
//                   <ng-container
//                     *ngTemplateOutlet="matrixTpl; context: { matrix: KT }"
//                   ></ng-container>
//                 </div>
//                 <span class="operator">=</span>
//                 <ng-container
//                   *ngTemplateOutlet="matrixTpl; context: { matrix: rawScores, highlight: true }"
//                 ></ng-container>
//               </div>
//             </div>
//             <div class="charts-column width-40">
//               <div id="chart-raw" class="plotly-chart"></div>
//             </div>
//           </div>
//         </div>
//
//         <div [hidden]="currentStep !== 3">
//           <h3>Step 3: Scaling the Scores</h3>
//           <!--          <p>To prevent extremely large values, we divide the raw scores by the square root of the key dimension ($sqrt{d_k} = sqrt{2} approx 1.414$).</p>-->
//
//           <div class="math-block">
//             <!--            <h4>$	ext{Scaled Scores} = rac{Q cdot K^T}{sqrt{d_k}}$</h4>-->
//             <div class="matrix-flex">
//               <ng-container
//                 *ngTemplateOutlet="matrixTpl; context: { matrix: rawScores }"
//               ></ng-container>
//               <span class="operator">÷ 1.414 =</span>
//               <ng-container
//                 *ngTemplateOutlet="matrixTpl; context: { matrix: scaledScores, highlight: true }"
//               ></ng-container>
//             </div>
//           </div>
//           <p class="help-text mt-4">
//             <em>Note: Scaling stabilizes training dynamics during gradient updates.</em>
//           </p>
//         </div>
//
//         <div [hidden]="currentStep !== 4">
//           <h3>Step 4: Applying Softmax (Attention Weights)</h3>
//           <p>
//             We apply the Softmax function row-by-row. This normalizes the scaled scores into
//             probabilities between 0 and 1 that sum up to exactly 1.0.
//           </p>
//
//           <div class="split-view">
//             <div class="math-block width-50">
//               <!--              <h4>$	ext{Attention} = 	ext{Softmax}left(rac{Q cdot K^T}{sqrt{d_k}}
// ight)$</h4>-->
//               <div class="matrix-flex">
//                 <ng-container
//                   *ngTemplateOutlet="
//                     matrixTpl;
//                     context: { matrix: attentionWeights, highlight: true }
//                   "
//                 ></ng-container>
//               </div>
//             </div>
//             <div class="charts-column width-50">
//               <div id="chart-attn" class="plotly-chart"></div>
//             </div>
//           </div>
//         </div>
//
//         <div [hidden]="currentStep !== 5">
//           <!--          <h3>Step 5: Output Generation ($	ext{Attention Weights} cdot V$)</h3>-->
//           <p>
//             Finally, we multiply the Softmax attention weights by the Value matrix ($V$). This sums
//             up the contextual meaning of all tokens.
//           </p>
//
//           <div class="split-view">
//             <div class="math-block width-60">
//               <!--              <h4>$	ext{Output} = 	ext{Attention} cdot V$</h4>-->
//               <div class="matrix-flex">
//                 <ng-container
//                   *ngTemplateOutlet="matrixTpl; context: { matrix: attentionWeights }"
//                 ></ng-container>
//                 <span class="operator">×</span>
//                 <ng-container *ngTemplateOutlet="matrixTpl; context: { matrix: V }"></ng-container>
//                 <span class="operator">=</span>
//                 <ng-container
//                   *ngTemplateOutlet="matrixTpl; context: { matrix: output, highlight: true }"
//                 ></ng-container>
//               </div>
//             </div>
//             <div class="charts-column width-40">
//               <div id="chart-out" class="plotly-chart"></div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//
//     <ng-template #matrixTpl let-matrix="matrix" let-highlight="highlight">
//       <div class="matrix-wrapper" [class.highlighted-matrix]="highlight">
//         <div class="matrix-title">
//           {{ matrix.name }} <small>({{ matrix.rows }}×{{ matrix.cols }})</small>
//         </div>
//         <div class="matrix-brackets">
//           <div *ngFor="let row of matrix.data" class="matrix-row">
//             <span *ngFor="let val of row" class="matrix-cell">
//               {{ val | number: '1.2-2' }}
//             </span>
//           </div>
//         </div>
//       </div>
//     </ng-template>
//   `,
//   styles: [
//     `
//       .attention-container {
//         font-family: system-ui, sans-serif;
//         padding: 2rem;
//         max-width: 1250px;
//         margin: 0 auto;
//         color: #1e293b;
//         background: #f8fafc;
//         border-radius: 12px;
//       }
//       header h2 {
//         margin-bottom: 0.25rem;
//         color: #0f172a;
//       }
//       header p {
//         color: #64748b;
//         margin-top: 0;
//       }
//
//       .steps-pager {
//         display: flex;
//         gap: 0.5rem;
//         margin: 1.5rem 0;
//         flex-wrap: wrap;
//       }
//       .steps-pager button {
//         background: #e2e8f0;
//         border: none;
//         padding: 0.6rem 1rem;
//         border-radius: 6px;
//         cursor: pointer;
//         font-weight: 500;
//       }
//       .steps-pager button.active {
//         background: #4f46e5;
//         color: #ffffff;
//       }
//
//       .controls-card {
//         background: #ffffff;
//         padding: 1.25rem;
//         border-radius: 8px;
//         border: 1px solid #e2e8f0;
//       }
//       .matrix-grid-input {
//         display: flex;
//         flex-direction: column;
//         gap: 0.5rem;
//       }
//       .matrix-row-input {
//         display: flex;
//         align-items: center;
//         gap: 0.75rem;
//       }
//       .token-label {
//         width: 70px;
//         font-weight: 600;
//         font-size: 0.85rem;
//         color: #475569;
//       }
//       .input-group input {
//         width: 60px;
//         padding: 0.35rem;
//         border: 1px solid #cbd5e1;
//         border-radius: 4px;
//         text-align: center;
//       }
//
//       .step-content {
//         background: #ffffff;
//         padding: 1.5rem;
//         border-radius: 8px;
//         border: 1px solid #e2e8f0;
//         min-height: 400px;
//       }
//       .split-view {
//         display: flex;
//         gap: 2rem;
//         align-items: flex-start;
//         flex-wrap: wrap;
//       }
//
//       .math-column {
//         flex: 1;
//         min-width: 450px;
//       }
//       .charts-column {
//         flex: 1;
//         min-width: 400px;
//         display: grid;
//         grid-template-columns: repeat(2, 1fr);
//         gap: 1rem;
//       }
//
//       .width-60 {
//         flex: 1.5;
//       }
//       .width-50 {
//         flex: 1;
//       }
//       .width-40 {
//         flex: 1;
//         display: block;
//       }
//
//       .math-block {
//         background: #fafafa;
//         padding: 1rem;
//         border-radius: 6px;
//         overflow-x: auto;
//         border: 1px solid #f1f5f9;
//       }
//       .matrix-flex {
//         display: flex;
//         align-items: center;
//         gap: 0.75rem;
//         margin-top: 1rem;
//       }
//       .operator {
//         font-size: 1.3rem;
//         font-weight: bold;
//         color: #64748b;
//       }
//
//       /* Matrix Typography Bracket Styling */
//       .matrix-title {
//         font-size: 0.8rem;
//         font-weight: bold;
//         color: #475569;
//         margin-bottom: 0.25rem;
//         text-align: center;
//       }
//       .matrix-caption {
//         font-size: 0.75rem;
//         color: #64748b;
//         margin: 0;
//         text-align: center;
//       }
//       .matrix-brackets {
//         border-left: 2px solid #1e293b;
//         border-right: 2px solid #1e293b;
//         padding: 0 0.5rem;
//         border-radius: 4px;
//         display: inline-block;
//         background: #fff;
//       }
//       .matrix-row {
//         display: flex;
//         justify-content: center;
//         gap: 0.75rem;
//         margin: 0.25rem 0;
//       }
//       .matrix-cell {
//         min-width: 50px;
//         font-family: monospace;
//         font-size: 0.9rem;
//         text-align: right;
//       }
//       .highlighted-matrix .matrix-brackets {
//         border-color: #4f46e5;
//         background: #f5f3ff;
//       }
//
//       .plotly-chart {
//         background: #ffffff;
//         border: 1px solid #f1f5f9;
//         border-radius: 6px;
//         min-height: 240px;
//       }
//       .mt-4 {
//         margin-top: 1rem;
//       }
//     `,
//   ],
// })
// export class __AttentionVisual implements OnInit, AfterViewInit {
//   currentStep = 1;
//   stepLabels = ['Projections', 'Raw Scores', 'Scaling', 'Softmax Weights', 'Weighted Output'];
//
//   X: Matrix = {
//     name: 'X (Embeddings)',
//     rows: 3,
//     cols: 2,
//     data: [
//       [1.0, 0.5],
//       [0.2, 1.8],
//       [0.9, -0.3],
//     ],
//   };
//
//   WQ: Matrix = {
//     name: 'Wq',
//     rows: 2,
//     cols: 2,
//     data: [
//       [0.5, 0.1],
//       [-0.2, 0.8],
//     ],
//   };
//   WK: Matrix = {
//     name: 'Wk',
//     rows: 2,
//     cols: 2,
//     data: [
//       [0.2, 0.9],
//       [0.4, -0.1],
//     ],
//   };
//   WV: Matrix = {
//     name: 'Wv',
//     rows: 2,
//     cols: 2,
//     data: [
//       [0.7, 0.3],
//       [0.1, 0.6],
//     ],
//   };
//
//   Q!: Matrix;
//   K!: Matrix;
//   V!: Matrix;
//   KT!: Matrix;
//   rawScores!: Matrix;
//   scaledScores!: Matrix;
//   attentionWeights!: Matrix;
//   output!: Matrix;
//
//   ngOnInit() {
//     this.calculateMath();
//   }
//
//   ngAfterViewInit() {
//     setTimeout(() => this.renderCharts(), 50);
//   }
//
//   changeStep(step: number) {
//     this.currentStep = step;
//     setTimeout(() => this.renderCharts(), 10);
//   }
//
//   recalculatePipeline() {
//     this.calculateMath();
//     this.renderCharts();
//   }
//
//   private calculateMath() {
//     this.Q = {
//       name: 'Q (Queries)',
//       rows: 3,
//       cols: 2,
//       data: this.multiply(this.X.data, this.WQ.data),
//     };
//     this.K = { name: 'K (Keys)', rows: 3, cols: 2, data: this.multiply(this.X.data, this.WK.data) };
//     this.V = {
//       name: 'V (Values)',
//       rows: 3,
//       cols: 2,
//       data: this.multiply(this.X.data, this.WV.data),
//     };
//
//     this.KT = { name: 'Kᵀ', rows: 2, cols: 3, data: this.transpose(this.K.data) };
//
//     const raw = this.multiply(this.Q.data, this.KT.data);
//     this.rawScores = { name: 'Q · Kᵀ', rows: 3, cols: 3, data: raw };
//
//     const dkSqrt = Math.sqrt(2);
//     this.scaledScores = {
//       name: 'Scaled Scores',
//       rows: 3,
//       cols: 3,
//       data: raw.map((row) => row.map((v) => v / dkSqrt)),
//     };
//
//     const softmaxData = this.scaledScores.data.map((row) => this.softmax(row));
//     this.attentionWeights = { name: 'Attention Weights', rows: 3, cols: 3, data: softmaxData };
//
//     this.output = {
//       name: 'Output Matrix',
//       rows: 3,
//       cols: 2,
//       data: this.multiply(softmaxData, this.V.data),
//     };
//   }
//
//   private renderCharts() {
//     if (this.currentStep === 1) {
//       this.drawBar('chart-x', 'Inputs (X)', ['D1', 'D2'], this.X.data);
//       this.drawBar('chart-q', 'Queries (X·Wq)', ['Q1', 'Q2'], this.Q.data);
//       this.drawBar('chart-k', 'Keys (X·Wk)', ['K1', 'K2'], this.K.data);
//       this.drawBar('chart-v', 'Values (X·Wv)', ['V1', 'V2'], this.V.data);
//     } else if (this.currentStep === 2) {
//       this.drawHeatmap('chart-raw', 'Raw Matrix Similarity Score', this.rawScores.data, false);
//     } else if (this.currentStep === 4) {
//       this.drawHeatmap(
//         'chart-attn',
//         'Softmax Probability Spread',
//         this.attentionWeights.data,
//         true,
//       );
//     } else if (this.currentStep === 5) {
//       this.drawBar('chart-out', 'Final Contextual Output', ['Out1', 'Out2'], this.output.data);
//     }
//   }
//
//   private drawBar(elementId: string, title: string, xLabels: string[], data: number[][]) {
//     const el = document.getElementById(elementId);
//     if (!el) return;
//     const traces = data.map((row, i) => ({
//       x: xLabels,
//       y: row,
//       name: 'Token ' + (i + 1),
//       type: 'bar' as const,
//     }));
//
//     Plotly.newPlot(
//       el,
//       traces,
//       {
//         title: { text: title }, // <-- Fix: Wrap the string in an object
//         barmode: 'group',
//         margin: { t: 40, b: 30, l: 30, r: 15 },
//         height: 230,
//       },
//       { displayModeBar: false },
//     );
//   }
//
//   private drawHeatmap(elementId: string, title: string, data: number[][], asPct: boolean) {
//     const el = document.getElementById(elementId);
//     if (!el) return;
//     const zData = asPct ? data.map((r) => r.map((v) => v * 100)) : data;
//     const labels = ['T1', 'T2', 'T3'];
//     const trace = {
//       z: zData,
//       x: labels.map((l) => 'Key ' + l),
//       y: labels.map((l) => 'Query ' + l),
//       type: 'heatmap' as const,
//       colorscale: 'Viridis' as const,
//       text: zData.map((r) => r.map((v) => v.toFixed(1) + (asPct ? '%' : ''))),
//       texttemplate: '%{text}',
//     };
//
//     Plotly.newPlot(
//       el,
//       [trace] as any[],
//       {
//         title: { text: title }, // <-- Fix: Wrap the string in an object
//         margin: { t: 40, b: 40, l: 60, r: 20 },
//         height: 260,
//       },
//       { displayModeBar: false },
//     );
//   }
//
//   private multiply(A: number[][], B: number[][]): number[][] {
//     const res = Array.from({ length: A.length }, () => new Array(B[0].length).fill(0));
//     for (let i = 0; i < A.length; i++) {
//       for (let j = 0; j < B[0].length; j++) {
//         for (let k = 0; k < A[0].length; k++) {
//           res[i][j] += A[i][k] * B[k][j];
//         }
//       }
//     }
//     return res;
//   }
//
//   private transpose(A: number[][]): number[][] {
//     return A[0].map((_, c) => A.map((r) => r[c]));
//   }
//
//   private softmax(vec: number[]): number[] {
//     const max = Math.max(...vec);
//     const exps = vec.map((v) => Math.exp(v - max));
//     const sum = exps.reduce((a, b) => a + b, 0);
//     return exps.map((e) => e / sum);
//   }
// }

import {  PLATFORM_ID, inject } from '@angular/core';
import {  isPlatformBrowser } from '@angular/common';

interface Matrix {
  name: string;
  data: number[][];
  rows: number;
  cols: number;
}

@Component({
  selector: 'app-attention-visual',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="attention-container">
      <header>
        <h2>🧠 Self-Attention Mechanism Step-by-Step</h2>
        <p>
          Step through the linear transformations to see both mathematical matrices and Plotly
          charts update in real time.
        </p>
      </header>

      <div class="steps-pager">
        <button
          *ngFor="let stepNum of [1, 2, 3, 4, 5]; let i = index"
          [class.active]="currentStep === stepNum"
          (click)="changeStep(stepNum)"
        >
          Step {{ stepNum }}: {{ stepLabels[i] }}
        </button>
      </div>

      <section class="controls-card">
        <h3>Interactive Inputs (Matrix $X$)</h3>
        <div class="matrix-grid-input">
          <div *ngFor="let row of X.data; let rIdx = index" class="matrix-row-input">
            <span class="token-label">Token {{ rIdx + 1 }}:</span>
            <div class="input-group" *ngFor="let val of row; let cIdx = index">
              <input
                type="number"
                step="0.1"
                [(ngModel)]="X.data[rIdx][cIdx]"
                (ngModelChange)="recalculatePipeline()"
              />
            </div>
          </div>
        </div>
      </section>
      <hr />

      <main class="step-content">
        <div [hidden]="currentStep !== 1">
          <h3>Step 1: Projecting Inputs into $Q$, $K$, $V$ Spaces</h3>
          <div class="split-view">
            <div class="math-column">
              <div class="math-block">
                <h4>$Q = X \\cdot W_Q$</h4>
                <div class="matrix-flex">
                  <ng-container
                    *ngTemplateOutlet="matrixTpl; context: { matrix: X }"
                  ></ng-container>
                  <span class="operator">×</span>
                  <ng-container
                    *ngTemplateOutlet="matrixTpl; context: { matrix: WQ }"
                  ></ng-container>
                  <span class="operator">=</span>
                  <ng-container
                    *ngTemplateOutlet="matrixTpl; context: { matrix: Q, highlight: true }"
                  ></ng-container>
                </div>
              </div>
              <div class="math-block mt-4">
                <h4>$K = X \\cdot W_K$</h4>
                <div class="matrix-flex">
                  <ng-container
                    *ngTemplateOutlet="matrixTpl; context: { matrix: X }"
                  ></ng-container>
                  <span class="operator">×</span>
                  <ng-container
                    *ngTemplateOutlet="matrixTpl; context: { matrix: WK }"
                  ></ng-container>
                  <span class="operator">=</span>
                  <ng-container
                    *ngTemplateOutlet="matrixTpl; context: { matrix: K, highlight: true }"
                  ></ng-container>
                </div>
              </div>
              <div class="math-block mt-4">
                <h4>$V = X \\cdot W_V$</h4>
                <div class="matrix-flex">
                  <ng-container
                    *ngTemplateOutlet="matrixTpl; context: { matrix: X }"
                  ></ng-container>
                  <span class="operator">×</span>
                  <ng-container
                    *ngTemplateOutlet="matrixTpl; context: { matrix: WV }"
                  ></ng-container>
                  <span class="operator">=</span>
                  <ng-container
                    *ngTemplateOutlet="matrixTpl; context: { matrix: V, highlight: true }"
                  ></ng-container>
                </div>
              </div>
            </div>
            <div class="charts-column">
              <div id="chart-x" class="plotly-chart"></div>
              <div id="chart-q" class="plotly-chart"></div>
              <div id="chart-k" class="plotly-chart"></div>
              <div id="chart-v" class="plotly-chart"></div>
            </div>
          </div>
        </div>

        <div [hidden]="currentStep !== 2">
          <h3>Step 2: Calculating Raw Scores ($Q \\cdot K^T$)</h3>
          <div class="split-view">
            <div class="math-block width-60">
              <!--              <h4>$\\text{{Raw Scores}} = Q \\cdot K^T$</h4>-->
              <div class="matrix-flex">
                <ng-container *ngTemplateOutlet="matrixTpl; context: { matrix: Q }"></ng-container>
                <span class="operator">×</span>
                <div>
                  <p class="matrix-caption">Transpose $K^T</p>
                  <ng-container
                    *ngTemplateOutlet="matrixTpl; context: { matrix: KT }"
                  ></ng-container>
                </div>
                <span class="operator">=</span>
                <ng-container
                  *ngTemplateOutlet="matrixTpl; context: { matrix: rawScores, highlight: true }"
                ></ng-container>
              </div>
            </div>
            <div class="charts-column width-40">
              <div id="chart-raw" class="plotly-chart"></div>
            </div>
          </div>
        </div>

        <div [hidden]="currentStep !== 3">
          <h3>Step 3: Scaling the Scores</h3>
          <div class="math-block">
            <!--            <h4>$\\text{{Scaled Scores}} = \\frac{{Q \\cdot K^T}}{{\\sqrt{{d_k}}}}$</h4>-->
            <div class="matrix-flex">
              <ng-container
                *ngTemplateOutlet="matrixTpl; context: { matrix: rawScores }"
              ></ng-container>
              <span class="operator">÷ 1.414 =</span>
              <ng-container
                *ngTemplateOutlet="matrixTpl; context: { matrix: scaledScores, highlight: true }"
              ></ng-container>
            </div>
          </div>
        </div>

        <div [hidden]="currentStep !== 4">
          <h3>Step 4: Applying Softmax (Attention Weights)</h3>
          <div class="split-view">
            <div class="math-block width-50">
              <!--              <h4>$\\text{{Attention}} = \\text{{Softmax}}\\left(\\frac{{Q \\cdot K^T}}{{\\sqrt{{d_k}}}}\\right)$</h4>-->
              <div class="matrix-flex">
                <ng-container
                  *ngTemplateOutlet="
                    matrixTpl;
                    context: { matrix: attentionWeights, highlight: true }
                  "
                ></ng-container>
              </div>
            </div>
            <div class="charts-column width-50">
              <div id="chart-attn" class="plotly-chart"></div>
            </div>
          </div>
        </div>

        <div [hidden]="currentStep !== 5">
          <!--          <h3>Step 5: Output Generation ($\\text{{Attention Weights}} \\cdot V$)</h3>-->
          <div class="split-view">
            <div class="math-block width-60">
              <!--              <h4>$\\text{{Output}} = \\text{{Attention}} \\cdot V$</h4>-->
              <div class="matrix-flex">
                <ng-container
                  *ngTemplateOutlet="matrixTpl; context: { matrix: attentionWeights }"
                ></ng-container>
                <span class="operator">×</span>
                <ng-container *ngTemplateOutlet="matrixTpl; context: { matrix: V }"></ng-container>
                <span class="operator">=</span>
                <ng-container
                  *ngTemplateOutlet="matrixTpl; context: { matrix: output, highlight: true }"
                ></ng-container>
              </div>
            </div>
            <div class="charts-column width-40">
              <div id="chart-out" class="plotly-chart"></div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <ng-template #matrixTpl let-matrix="matrix" let-highlight="highlight">
      <div class="matrix-wrapper" [class.highlighted-matrix]="highlight">
        <div class="matrix-title">
          {{ matrix.name }} <small>({{ matrix.rows }}×{{ matrix.cols }})</small>
        </div>
        <div class="matrix-brackets">
          <div *ngFor="let row of matrix.data" class="matrix-row">
            <span *ngFor="let val of row" class="matrix-cell">{{ val | number: '1.2-2' }}</span>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      /* Styles carry over from previous generation */
      .attention-container {
        font-family: system-ui, sans-serif;
        padding: 2rem;
        max-width: 1250px;
        margin: 0 auto;
        color: #1e293b;
        background: #f8fafc;
        border-radius: 12px;
      }
      .steps-pager {
        display: flex;
        gap: 0.5rem;
        margin: 1.5rem 0;
        flex-wrap: wrap;
      }
      .steps-pager button {
        background: #e2e8f0;
        border: none;
        padding: 0.6rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
      }
      .steps-pager button.active {
        background: #4f46e5;
        color: #ffffff;
      }
      .controls-card {
        background: #ffffff;
        padding: 1.25rem;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
      }
      .matrix-grid-input {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .matrix-row-input {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .token-label {
        width: 70px;
        font-weight: 600;
        font-size: 0.85rem;
        color: #475569;
      }
      .input-group input {
        width: 60px;
        padding: 0.35rem;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        text-align: center;
      }
      .step-content {
        background: #ffffff;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        min-height: 400px;
      }
      .split-view {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
        flex-wrap: wrap;
      }
      .math-column {
        flex: 1;
        min-width: 450px;
      }
      .charts-column {
        flex: 1;
        min-width: 400px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
      .width-60 {
        flex: 1.5;
      }
      .width-50 {
        flex: 1;
      }
      .width-40 {
        flex: 1;
        display: block;
      }
      .math-block {
        background: #fafafa;
        padding: 1rem;
        border-radius: 6px;
        overflow-x: auto;
        border: 1px solid #f1f5f9;
      }
      .matrix-flex {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 1rem;
      }
      .operator {
        font-size: 1.3rem;
        font-weight: bold;
        color: #64748b;
      }
      .matrix-title {
        font-size: 0.8rem;
        font-weight: bold;
        color: #475569;
        margin-bottom: 0.25rem;
        text-align: center;
      }
      .matrix-caption {
        font-size: 0.75rem;
        color: #64748b;
        margin: 0;
        text-align: center;
      }
      .matrix-brackets {
        border-left: 2px solid #1e293b;
        border-right: 2px solid #1e293b;
        padding: 0 0.5rem;
        border-radius: 4px;
        display: inline-block;
        background: #fff;
      }
      .matrix-row {
        display: flex;
        justify-content: center;
        gap: 0.75rem;
        margin: 0.25rem 0;
      }
      .matrix-cell {
        min-width: 50px;
        font-family: monospace;
        font-size: 0.9rem;
        text-align: right;
      }
      .highlighted-matrix .matrix-brackets {
        border-color: #4f46e5;
        background: #f5f3ff;
      }
      .plotly-chart {
        background: #ffffff;
        border: 1px solid #f1f5f9;
        border-radius: 6px;
        min-height: 240px;
      }
      .mt-4 {
        margin-top: 1rem;
      }
    `,
  ],
})
export class AttentionVisual implements OnInit, AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private plotly: any = null; // Holds runtime reference to library

  currentStep = 1;
  stepLabels = ['Projections', 'Raw Scores', 'Scaling', 'Softmax Weights', 'Weighted Output'];

  X: Matrix = {
    name: 'X (Embeddings)',
    rows: 3,
    cols: 2,
    data: [
      [1.0, 0.5],
      [0.2, 1.8],
      [0.9, -0.3],
    ],
  };

  WQ: Matrix = {
    name: 'Wq',
    rows: 2,
    cols: 2,
    data: [
      [0.5, 0.1],
      [-0.2, 0.8],
    ],
  };
  WK: Matrix = {
    name: 'Wk',
    rows: 2,
    cols: 2,
    data: [
      [0.2, 0.9],
      [0.4, -0.1],
    ],
  };
  WV: Matrix = {
    name: 'Wv',
    rows: 2,
    cols: 2,
    data: [
      [0.7, 0.3],
      [0.1, 0.6],
    ],
  };

  Q!: Matrix;
  K!: Matrix;
  V!: Matrix;
  KT!: Matrix;
  rawScores!: Matrix;
  scaledScores!: Matrix;
  attentionWeights!: Matrix;
  output!: Matrix;

  ngOnInit() {
    this.calculateMath();
  }

  ngAfterViewInit() {
    // Only fetch library and build visuals if running inside the actual browser client
    if (this.isBrowser) {
      this.loadPlotlyAndRender();
    }
  }

  async loadPlotlyAndRender() {
    try {
      // Lazy load the library down the wire to clear SSR context safely
      const module = await import('plotly.js-dist-min');
      this.plotly = module.default || module;
      this.renderCharts();
    } catch (err) {
      console.error('Failed to asynchronously initialize Plotly instance:', err);
    }
  }

  changeStep(step: number) {
    this.currentStep = step;
    if (this.isBrowser && this.plotly) {
      setTimeout(() => this.renderCharts(), 10);
    }
  }

  recalculatePipeline() {
    this.calculateMath();
    if (this.isBrowser && this.plotly) {
      this.renderCharts();
    }
  }

  private calculateMath() {
    this.Q = {
      name: 'Q (Queries)',
      rows: 3,
      cols: 2,
      data: this.multiply(this.X.data, this.WQ.data),
    };
    this.K = { name: 'K (Keys)', rows: 3, cols: 2, data: this.multiply(this.X.data, this.WK.data) };
    this.V = {
      name: 'V (Values)',
      rows: 3,
      cols: 2,
      data: this.multiply(this.X.data, this.WV.data),
    };

    this.KT = { name: 'Kᵀ', rows: 2, cols: 3, data: this.transpose(this.K.data) };

    const raw = this.multiply(this.Q.data, this.KT.data);
    this.rawScores = { name: 'Q · Kᵀ', rows: 3, cols: 3, data: raw };

    const dkSqrt = Math.sqrt(2);
    this.scaledScores = {
      name: 'Scaled Scores',
      rows: 3,
      cols: 3,
      data: raw.map((row) => row.map((v) => v / dkSqrt)),
    };

    const softmaxData = this.scaledScores.data.map((row) => this.softmax(row));
    this.attentionWeights = { name: 'Attention Weights', rows: 3, cols: 3, data: softmaxData };

    this.output = {
      name: 'Output Matrix',
      rows: 3,
      cols: 2,
      data: this.multiply(softmaxData, this.V.data),
    };
  }

  private _renderCharts() {
    if (!this.plotly) return;

    if (this.currentStep === 1) {
      this.drawBar('chart-x', 'Inputs (X)', ['D1', 'D2'], this.X.data);
      this.drawBar('chart-q', 'Queries (X·Wq)', ['Q1', 'Q2'], this.Q.data);
      this.drawBar('chart-k', 'Keys (X·Wk)', ['K1', 'K2'], this.K.data);
      this.drawBar('chart-v', 'Values (X·Wv)', ['V1', 'V2'], this.V.data);
    } else if (this.currentStep === 2) {
      this.drawHeatmap('chart-raw', 'Raw Matrix Similarity Score', this.rawScores.data, false);
    } else if (this.currentStep === 4) {
      this.drawHeatmap(
        'chart-attn',
        'Softmax Probability Spread',
        this.attentionWeights.data,
        true,
      );
    } else if (this.currentStep === 5) {
      this.drawBar('chart-out', 'Final Contextual Output', ['Out1', 'Out2'], this.output.data);
    }
  }
  private renderCharts() {
    if (!this.plotly) return;

    if (this.currentStep === 1) {
      // Maps tokens as distinct geometric coordinate positions across Embedding dimensions 1 & 2
      this.drawScatter('chart-x', 'Inputs (X Space)', ['Dim 1', 'Dim 2'], this.X.data);
      this.drawScatter('chart-q', 'Queries (Q Space)', ['Q Dim 1', 'Q Dim 2'], this.Q.data);
      this.drawScatter('chart-k', 'Keys (K Space)', ['K Dim 1', 'K Dim 2'], this.K.data);
      this.drawScatter('chart-v', 'Values (V Space)', ['V Dim 1', 'V Dim 2'], this.V.data);
    } else if (this.currentStep === 2) {
      this.drawHeatmap('chart-raw', 'Raw Matrix Similarity Score', this.rawScores.data, false);
    } else if (this.currentStep === 4) {
      this.drawHeatmap(
        'chart-attn',
        'Softmax Probability Spread',
        this.attentionWeights.data,
        true,
      );
    } else if (this.currentStep === 5) {
      this.drawScatter(
        'chart-out',
        'Final Contextual Output',
        ['Out Dim 1', 'Out Dim 2'],
        this.output.data,
      );
    }
  }

  private drawScatter(elementId: string, title: string, xLabels: string[], data: number[][]) {
    const el = document.getElementById(elementId);
    if (!el || !this.plotly) return;

    // Convert rows into coordinate points instead of vertical blocks
    const traces = data.map((row, i) => ({
      x: xLabels,
      y: row,
      name: 'Token ' + (i + 1),
      type: 'scatter' as const,
      mode: 'markers+lines' as const, // Connects points across dimensions with a structural line
      marker: { size: 12 },
      line: { dash: 'dot', width: 1.5 },
    }));

    this.plotly.newPlot(
      el,
      traces,
      {
        title: { text: title },
        hovermode: 'closest',
        xaxis: { type: 'category' }, // Keeps categorical axes cleanly mapped to ['D1', 'D2']
        margin: { t: 40, b: 30, l: 40, r: 15 },
        height: 230,
      },
      { displayModeBar: false },
    );
  }

  private drawBar(elementId: string, title: string, xLabels: string[], data: number[][]) {
    const el = document.getElementById(elementId);
    if (!el || !this.plotly) return;
    const traces = data.map((row, i) => ({
      x: xLabels,
      y: row,
      name: 'Token ' + (i + 1),
      type: 'bar' as const,
    }));
    this.plotly.newPlot(
      el,
      traces,
      {
        title: { text: title },
        barmode: 'group',
        margin: { t: 40, b: 30, l: 30, r: 15 },
        height: 230,
      },
      { displayModeBar: false },
    );
  }

  private drawHeatmap(elementId: string, title: string, data: number[][], asPct: boolean) {
    const el = document.getElementById(elementId);
    if (!el || !this.plotly) return;
    const zData = asPct ? data.map((r) => r.map((v) => v * 100)) : data;
    const labels = ['T1', 'T2', 'T3'];
    const trace = {
      z: zData,
      x: labels.map((l) => 'Key ' + l),
      y: labels.map((l) => 'Query ' + l),
      type: 'heatmap' as const,
      colorscale: 'Viridis' as const,
      text: zData.map((r) => r.map((v) => v.toFixed(1) + (asPct ? '%' : ''))),
      texttemplate: '%{text}',
    };
    this.plotly.newPlot(
      el,
      [trace] as any[],
      { title: { text: title }, margin: { t: 40, b: 40, l: 60, r: 20 }, height: 260 },
      { displayModeBar: false },
    );
  }

  private multiply(A: number[][], B: number[][]): number[][] {
    const res = Array.from({ length: A.length }, () => new Array(B[0].length).fill(0));
    for (let i = 0; i < A.length; i++) {
      for (let j = 0; j < B[0].length; j++) {
        for (let k = 0; k < A[0].length; k++) {
          res[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    return res;
  }

  private transpose(A: number[][]): number[][] {
    return A[0].map((_, c) => A.map((r) => r[c]));
  }

  private softmax(vec: number[]): number[] {
    const max = Math.max(...vec);
    const exps = vec.map((v) => Math.exp(v - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
  }
}
