// const pxtorem = require('postcss-pxtorem')
export default {
    //    extraPostCSSPlugins: [
    //        pxtorem({
    //            rootValue: 75,
    //            propWhiteList: [],
    //        }),
    //    ],
    extraBabelPlugins: [
        ['import', { 'libraryName': 'antd', 'libraryDirectory': 'es', 'style': 'css' }],
    ],
    hash: true,
    html: {
        'template': './public/index.ejs',
    },
    proxy: {
        '/~': {
            target: 'http://localhost:3000',
            router: req => req.url.split('/')[1].replace('~', 'http://'),
            pathRewrite: path => path.replace(/^\/~[^\/]+/, ''),
        },
        '/mock': {
            target: 'http://localhost:3000',
            onProxyReq: req => {
                req.method = 'GET'
                req.setHeader('Access-Control-Allow-Origin', true)
            },
        },
        '/api': {
            target: 'http://mapleliu.com/api',
        },
    },
    copy: [
        {
            from: 'mock',
            to: 'mock',
        },
    ],
}