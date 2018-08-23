export const isDev = process.env.NODE_ENV !== 'production'

export const isMock = isDev && true

export const API_RULES = [
    [ // 测试、正式环境
        [/^growth/, path => `http://192.168.0.121:7392/dragnet-war/api/${path}`],
        [/./, path => `api/${path}`],
    ],
    [ // 本地开发环境
        [/^growth/, path => `~192.168.0.121:7392/dragnet-war/api/${path}`],
        [/./, path => `~172.16.116.136:19062/api/${path}`],
    ],
][+isDev]
