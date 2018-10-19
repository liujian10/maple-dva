const path = require('path');

module.exports = (webpackConfig, env) => {
    webpackConfig.module.rules.forEach(rule => {
        const { loader = '', test } = rule
        if (loader.indexOf('url-loader') !== -1) {
            rule.exclude.push(/\.(yml|styl)$/i)
        }
        if (`${test}`.includes('less')) {
            rule.exclude = {
                or: [/node_modules/, /global/]
            }
        }
    })

    webpackConfig.module.rules.unshift({
        test: /\.yml$/i,
        use: ['json-loader', 'yaml-loader'],
    })

    webpackConfig.module.rules.unshift({
        test: /\.styl$/,
        loaders: ['style-loader', 'css-loader?modules=true&localIdentName=[path][name]__[local]--[hash:base64:4]', 'stylus-loader'],
        exclude: {
            or: [/node_modules/, /global/]
        }
    })

    webpackConfig.module.rules.unshift({
        test: /\.styl$/,
        loaders: ['style-loader', 'css-loader', 'stylus-loader'],
        include: [path.join(__dirname, './src/styles/global')]
    })

    webpackConfig.module.rules.unshift({
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader'],
        include: [path.join(__dirname, './src/styles/global')]
    })

    return webpackConfig
}