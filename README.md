# Machine Learning Classroom

[Live here](https://philipszdavido.github.io/ml-visualizer/)

An interactive, step-by-step visual sandbox built with **Angular** and **Plotly.js**. This application is designed specifically as an educational tool to help students intuitively bridge the gap between abstract machine learning algorithms, live coordinate geometry, and dynamic algebraic equations.

Instead of hiding training inside automated high-speed loops, this sandbox utilizes a **manual execution engine**. Every click of the step button processes exactly one data point, letting students see the immediate, frame-by-frame impact of individual data points on lines, curves, margins, and probabilities.

---

## Features & Learning Paradigms

This application hosts six distinct classic algorithms split across three primary learning domains:

### 1. Continuous Regression

* **Linear Regression:** Visualizes Mean Squared Error (MSE) optimization. Watch the slope ($w_1$) and intercept ($b$) twist a straight line to fit a feature trend.
* **Polynomial Regression:** Demonstrates non-linear feature space expansions. Shows how a quadratic coefficient ($w_2$) curves a model to capture parabolic data trends.

### 2. Parametric Linear Classification

* **Perceptron Classifier:** The foundational binary neural node. Explicitly illustrates the Perceptron Learning Rule, where parameters shift *only* when the golden focus star marks a misclassified point.
* **Logistic Regression:** Explains probabilistic log-odds using the Sigmoid activation function ($\sigma$). Watch a smooth gradient probability field slide into place.

### 3. Non-Parametric & Generative Learning

* **Naive Bayes:** Demonstrates Gaussian conditional density tracking. Instead of traditional boundaries, it visually computes class conditional centroids and variance spheres around data.
* **K-Nearest Neighbors (KNN):** Illustrates instance-based "lazy" inference. Shows that no weights are optimized; instead, classifications are determined dynamically by checking local neighborhood clusters.

---

## Tech Stack & Architecture

* **Framework:** Angular (v17+ architecture utilizing non-standalone modular structures)
* **Visual Graphic Engine:** Plotly.js (Optimized via dynamic client-side injections to guarantee full Server-Side Rendering compatibility)
* **State Control:** Strict data bindings via `FormsModule` for real-time hyperparameter tweaks.

---

## Installation & Quick Start

### Prerequisites

Make sure you have the [Node.js runtime environment](https://nodejs.org/) and the [Angular CLI](https://angular.dev/tools/cli) installed globally on your machine.

### Setup Instructions

1. **Clone the workspace repository:**
```bash
git clone https://github.com/philipszdavido/ml-visualizer.git
cd ml-visualizer

```


2. **Install the required dependencies:**
```bash
npm install

```


3. **Compile and serve the application locally:**
```bash
ng serve

```


4. **Open your browser:**
   Navigate to `http://localhost:4200` to launch the interactive workspace dashboard.

---

## How to Use This for Teaching (Lesson Plan Ideas)

This application is optimized for screen-sharing during lectures or for hands-on lab sessions. Here is a recommended teaching workflow:

### Step 1: The Initial Zero State

Load any algorithm (e.g., *Perceptron*). Point out that on initialization, the dataset loads but **no model lines are drawn**, and the weights are empty ($0x_1 + 0x_2 - 0 = 0$). This highlights that the model knows absolutely nothing prior to training.

### Step 2: Tracking the Focus Star

Draw attention to the **Golden Star Marker** on the chart. Explain that this represents the current feature sample vector loaded into the processor memory cache, waiting to be evaluated.

### Step 3: Triggering a Micro-Update

Click **"Step Forward"**.

* If the focus point is already correctly classified, show the students that the weights barely change (or don't change at all).
* If the point is misclassified, watch the line physically twitch or pivot toward the point. Have students track the **Parametric Weights Vector table** to see the numbers change in real-time alongside the geometry.

### Step 4: Observing Convergence

As you continuously click the step button, have students watch the **Loss Trend Value graph** at the bottom. Point out how the loss spikes when the model makes mistakes, but gradually trends downward as the line or curve stabilizes.

---

## License

This educational sandbox project is open-source and available under the **MIT License**. Feel free to fork, adapt, and expand it for your classrooms!
