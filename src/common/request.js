import { message as msg } from 'antd'
import { path2url } from './util'

const CONTENT_TYPE = {
    form: 'application/x-www-form-urlencoded',
    json: 'application/json',
}

let redirected = false

const request = (api, params = {}, headers = {}, method = 'POST') => {
    const { url, type } = path2url(api)

    let body = params
    if (type === 'form') {
        const pairs = Object.entries(params).filter(([k, v]) => v !== null && v !== undefined) // 去除值为 null、undefined 的入参
        body = pairs.length ? pairs.reduce((formdata, [k, v]) => {
            formdata.append(k, v)
            return formdata
        }, new URLSearchParams()) : null
    } else if (type === 'json') {
        body = JSON.stringify(params)
    }

    const opts = {
        method,
        body,
        credentials: 'same-origin',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': CONTENT_TYPE[type],
            ...headers,
        },
    }

    const fetchPromise = fetch(url, opts).then(resp => resp.text().then(text => [text, resp.status]))

    return fetchPromise.then(([text, status]) => {
        if (status !== 200) {
            throw status
        }
        try {
            return JSON.parse(text.replace(/,[^{,]+:null|[^{,]+:null,/g, ''))
        } catch (e) {
            throw status
        }
    }).then(({ flag, data, message }) => {
        if (flag !== 1) {
            throw message
        } else {
            return data
        }
    }).catch(err => {
        if ((err === 401 || err === 'LOGOVERTIME') && !redirected) {
            redirected = true
            // @TODO 无访问权限操作
        }
        msg.error(`${err.message || err}`)
        console.error(`request: 👉${err.message || err}👈`)
        throw err // !!!抛出异常，使 saga fail
    })
}

export const post = request

export default {
    post,
}
