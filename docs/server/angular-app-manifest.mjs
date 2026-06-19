
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/ml-visualizer/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "preload": [
      "chunk-EMGZNQKM.js"
    ],
    "route": "/ml-visualizer"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4H7VIVEN.js",
      "chunk-LH2HK7K4.js"
    ],
    "route": "/ml-visualizer/models/linear-regression"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-F44KZYBZ.js",
      "chunk-LH2HK7K4.js"
    ],
    "route": "/ml-visualizer/models/knn-classifier"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-XTLPX3H7.js",
      "chunk-LH2HK7K4.js"
    ],
    "route": "/ml-visualizer/models/logistic-regression"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-YUC7B334.js",
      "chunk-LH2HK7K4.js"
    ],
    "route": "/ml-visualizer/models/naive-bayes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-Q3MKCCWH.js",
      "chunk-LH2HK7K4.js"
    ],
    "route": "/ml-visualizer/models/peceptron-classifier"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-6MSN3SMX.js",
      "chunk-LH2HK7K4.js"
    ],
    "route": "/ml-visualizer/models/polynomial-regression"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ZS3WVCMN.js",
      "chunk-XBV23WSR.js",
      "chunk-LH2HK7K4.js"
    ],
    "route": "/ml-visualizer/models/linear-svm"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-XBXVFRBI.js",
      "chunk-LH2HK7K4.js"
    ],
    "route": "/ml-visualizer/models/train-linear-svm"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-AKQZMA3J.js"
    ],
    "route": "/ml-visualizer/models/tiny-embedding-sim"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 715, hash: 'b076ecdf9a0bfde928739c2c59bde7bd9a6fd4e16c491f1dd045b58c0a23d726', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1117, hash: '2d631294b9858f105b7d5cf4e3daf1917ac876b54f10031527f422688fc8b8e3', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'models/polynomial-regression/index.html': {size: 6554, hash: 'ade626377bb465928db788ce0373d6bd2f1a020a8a65f6d8bd165fa8aaad8af1', text: () => import('./assets-chunks/models_polynomial-regression_index_html.mjs').then(m => m.default)},
    'index.html': {size: 24929, hash: 'e9f88a9e85a8ce1b4effcfe082bc0622e5aacddf74b55497e34dfbd2a6306fcd', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'models/peceptron-classifier/index.html': {size: 6566, hash: 'e234014876ab069962712226d73d07143e098e36c0a3fd080dfa63e7ce9129a4', text: () => import('./assets-chunks/models_peceptron-classifier_index_html.mjs').then(m => m.default)},
    'models/linear-regression/index.html': {size: 6545, hash: '4d0319b65193f411d12586b8435d14a66794071934d2e443baf037405a75a0ad', text: () => import('./assets-chunks/models_linear-regression_index_html.mjs').then(m => m.default)},
    'models/knn-classifier/index.html': {size: 6532, hash: 'd6be52c77be3bb999faae4c2dae67720ebbfe16b62db24905a83fcafba3ced24', text: () => import('./assets-chunks/models_knn-classifier_index_html.mjs').then(m => m.default)},
    'models/logistic-regression/index.html': {size: 6550, hash: 'b4fdb52a7e4d184fbbd1889929d7fe5294d6d9265460cb26a9415b35d3a8080e', text: () => import('./assets-chunks/models_logistic-regression_index_html.mjs').then(m => m.default)},
    'models/train-linear-svm/index.html': {size: 8823, hash: '1f32496e178a950e13b3fc122e8b470300c96f1b6d6ae10be3fe4dd2020eb3a4', text: () => import('./assets-chunks/models_train-linear-svm_index_html.mjs').then(m => m.default)},
    'models/naive-bayes/index.html': {size: 6548, hash: 'f2a5f597046a00ea1248b23d2be2e8367ef6b6570fa9041e039e478f45742625', text: () => import('./assets-chunks/models_naive-bayes_index_html.mjs').then(m => m.default)},
    'models/tiny-embedding-sim/index.html': {size: 13356, hash: 'd126f71cf82a7e0bcb4689aecea87da50ddf0a0322501ff6f5496784ca6a86f3', text: () => import('./assets-chunks/models_tiny-embedding-sim_index_html.mjs').then(m => m.default)},
    'styles-4QNODCWM.css': {size: 2281, hash: 'h3GAycD+WbQ', text: () => import('./assets-chunks/styles-4QNODCWM_css.mjs').then(m => m.default)}
  },
};
