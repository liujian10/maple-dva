module.exports = (webpackConfig, env) => {
        webpackConfig.module.rules.forEach(rule => {
            const { loader = '' } = rule
            if (loader.indexOf('url-loader') !== -1) {
                rule.exclude.push(/\.yml$/i)
            }
        })

        webpackConfig.module.rules.unshift({
            test: /\.yml$/i,
            use: ['json-loader', 'yaml-loader'],
        })

    return webpackConfig
}