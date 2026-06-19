
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/ml-visualizer/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/ml-visualizer"
  },
  {
    "renderMode": 2,
    "route": "/ml-visualizer/ml-sandbox"
  },
  {
    "renderMode": 2,
    "route": "/ml-visualizer/embed-sim"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 502, hash: '6b7c9509a36918a7a998881ff224577681e41099ad2e3c7cca797513c8ee93cf', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1015, hash: '1f340022ed64152e04c640537947049e5d52092962937a7ec2c634a6362b4e39', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'ml-sandbox/index.html': {size: 8473, hash: '1c2a7f35da9aef85bae111d798c1edf534969cbc8aa4822a1997c4aeedb28a2d', text: () => import('./assets-chunks/ml-sandbox_index_html.mjs').then(m => m.default)},
    'index.html': {size: 19625, hash: '4081231b174f85df48e2bff869f909a7cf750f77a2a8c866b683c5bb695de508', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'embed-sim/index.html': {size: 12968, hash: '8cba4b1379fdc1b3c4705ce636748bc5a327d75d33de66eaee339c9f5e02780c', text: () => import('./assets-chunks/embed-sim_index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
