const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function (app) {
    const rewriteFn = function (path, req) {
        return path.replace('/api', '/');
    };
  
    app.use(
        '/api/',
        createProxyMiddleware({
            target : 'http://123.57.214.35:20728/',
            changeOrigin : true,
            pathRewrite : rewriteFn
        })
    );
};