import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-backprop-graph',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './backprop-graph.component.html',
  styleUrl: './backprop-graph.component.css',
})
export class BackpropGraphComponent {

  x1 = 0.1;
  x2 = 0.5;
  w10 = 0.7;
  w11 = 0.6;
  w12 = 0.5;
  w13 = 0.4;
  wh11 = 0.02;
  wh12 = 0.6;
  wh21 = 0.2;
  wh22 = 0.1;
  w1 = 0.02;
  w2 = 0.02;
  exp = 1.0;

  // Exact Forward Pass Calculations
  h11 = 0.32; // 0.1*0.7 + 0.5*0.5
  h12 = 0.26; // 0.1*0.6 + 0.5*0.4
  h21 = 0.0584; // 0.32*0.02 + 0.26*0.2
  h22 = 0.218; // 0.32*0.6 + 0.26*0.1
  pred = 0.0055; // 0.02*0.0584 + 0.02*0.218 (Corrected Evaluation)

  // Interactive Backpropagation Steps
  // 0: Forward Only, 1: Output Loss Node, 2: Layer 2 Weights, 3: Layer 1 Nodes, 4: Layer 1 Weights Full Map
  currentStep = 0;

  // Exact Backward Pass Derived Properties
  get dL_dpred() {
    return this.pred - this.exp;
  } // -0.9945

  // Layer 2 Gradients
  get dL_dw1() {
    return this.dL_dpred * this.h21;
  }
  get dL_dw2() {
    return this.dL_dpred * this.h22;
  }
  get dL_dwh11() {
    return this.dL_dpred * this.w1 * this.h11;
  }
  get dL_dwh21() {
    return this.dL_dpred * this.w1 * this.h12;
  }
  get dL_dwh12() {
    return this.dL_dpred * this.w2 * this.h11;
  }
  get dL_dwh22() {
    return this.dL_dpred * this.w2 * this.h12;
  }

  // Layer 1 Node Accumulations (Multivariate split-sum paths)
  get dL_dh11() {
    return this.dL_dpred * this.w1 * this.wh11 + this.dL_dpred * this.w2 * this.wh12;
  }
  get dL_dh12() {
    return this.dL_dpred * this.w1 * this.wh21 + this.dL_dpred * this.w2 * this.wh22;
  }

  // Layer 1 Input Weight Gradients
  get dL_dw10() {
    return this.dL_dh11 * this.x1;
  }
  get dL_dw12() {
    return this.dL_dh11 * this.x2;
  }
  get dL_dw11() {
    return this.dL_dh12 * this.x1;
  }
  get dL_dw13() {
    return this.dL_dh12 * this.x2;
  }
}
