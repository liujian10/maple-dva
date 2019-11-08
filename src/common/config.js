export const isDev = process.env.NODE_ENV !== 'production'

export const isMock = isDev && true

export const MOMENT_FMT_DATE = 'YYYY-MM-DD'
export const MOMENT_FMT_DATE_MMDD = 'MM-DD'
export const MOMENT_FMT_TIME = 'HH:mm:ss'
export const MOMENT_FMT_HMS = 'HH:mm'
export const MOMENT_FMT_YMD_HMS = 'YYYY-MM-DD HH:mm:ss'

export const MOMENT_FORMAT = {
    date: 'YYYY-MM-DD',
    dateMD: 'YYYY-MM-DD',
    time: 'HH:mm:ss',
    timeHM: 'HH:mm',
    dateTime: 'YYYY-MM-DD HH:mm:ss',
}

export const URLS = {
    login: '/login',
    logout: '/logout',
    home: '/main',
}

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
