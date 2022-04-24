const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function (app) {
    const rewriteFn = function (path, req) {
        return path.replace('/api', '/');
    };
  
    app.use(
        '/api/',
        createProxyMiddleware({
            target : 'http://api.sycstudio.com/',
            changeOrigin : true,
            pathRewrite : rewriteFn
        })
    );
};