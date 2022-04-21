const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/api/',
        createProxyMiddleware({
            target : 'http://sycstudio.com:20729/',
            changeOrigin : true,  // 设置跨域请求
            PathRewrite : {
                '^/api' : '' // 将/api/v1 变为 ''
            }
        })
    );
};