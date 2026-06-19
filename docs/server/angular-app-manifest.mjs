
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/ml-visualizer/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/ml-visualizer"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 502, hash: '340085c0cae46b6320473c5c92081b1a918ad971d893dc028a4d4d250699fc03', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1015, hash: 'f2bd074a3e127608733cdf48284fca8c30431e6fd279f9c869c9721c0c56b17e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 8353, hash: '121a2f87c52aa0b9e1502fceeca0810bc08be86a968595a965d004fe2f071883', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
