const path = require('path')
const themeConfig = require('./antd-theme.js')
// const pxtorem = require('postcss-pxtorem')

export default {
    //    extraPostCSSPlugins: [
    //        pxtorem({
    //            rootValue: 75,
    //            propWhiteList: [],
    //        }),
    //    ],
    // env: {
    //     development: {
    //         extraBabelPlugins: ["dva-hmr"]
    //     }
    // },
    theme: themeConfig,
    alias: {
        '@': path.resolve(__dirname, './src/'),
    },
    extraBabelPlugins: [
        ['import', { 'libraryName': 'antd', 'libraryDirectory': 'es', 'style': 'css' }],
        ['wrapper', {}],
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