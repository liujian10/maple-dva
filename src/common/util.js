import { useState as us } from 'react'
import _ from 'lodash'
import { isMock, API_RULES } from './config'

/**
 * 封装state hook使用逻辑
 * @param {*} obj
 */
export const useState = obj => {
    const { values, sets } = Object.entries(obj).reduce((res, [k, v]) => {
        const [value, set] = us(v)
        res.values[k] = value
        res.sets[k] = set
        return res
    }, { values: {}, sets: {} })

    return {
        ...values,
        setState: states => Object.entries(states).forEach(([k, v]) => {
            if (sets[k]) {
                sets[k](v)
            }
        }),
    }
}

/**
 * 动态引入文件夹下多个文件
 * @context {Context} Webpack Require Context
 * @normalize {Function} 把context的key转换为想要的格式,返回falsy值则表示忽略该文件
 * @return {Object} 包含多个文件的引用的对象
 */
export const requireAll = (
    context,
    normalize = v => v.replace(/\.\/([\w./]+)\.\w+$/, '$1').replace(/\//g, '.'),
) => context.keys().reduce((obj, key) => {
    const normalizedKey = normalize(key)
    return _.has(obj, normalizedKey) ? obj : _.set(obj, normalizedKey, context(key).default || context(key))
}, {})

export const compose = (...fns) => fns.reverse().reduce((prevFn, nextFn) => value => nextFn(prevFn(value)))

/**
 * 把 url.yml 里的路径，根据接口映射规则转换成完整请求路径
 * @param {String} p
 */
export const path2url = (p = '') => {
    const [path, type = 'form'] = p.split('|').reverse()
    let url = null
    if (isMock) {
        url = `mock/${path}.json`
    } else {
        const [, transform] = API_RULES.filter(([regex, nil]) => regex.test(path))[0]
        url = `${transform(path)}`
    }
    return { url, type }
}

/**
 * 将 action 转换成带参数的 action
 * @param {*} actionSet
 * @param {*} prefix
 */
export const mapAction = (actionSet, prefix = []) => {
    _.mapValues(actionSet, (v, k, obj) => {
        const action = prefix.concat(k)
        if (typeof v === 'object') {
            mapAction(v, action)
        } else {
            const fn = () => { }
            fn.toString = () => action.join('/')
            fn.KEY = k
            fn.VAL = v
            fn.URL = v ? path2url(v).url : ''
            fn.OK = action.concat('OK').join('_')
            fn.NOK = action.concat('NOK').join('_')
            // eslint-disable-next-line no-param-reassign
            obj[k] = fn
        }
    })
}

export const reducerHandler = reducers => _.mapKeys(reducers, (v, k) => k.replace(/.+\//, ''))

/**
 * 判断值是否为空[undefined|null|'']
 * @param {} value
 */
export const isEmptyVal = value => value === undefined || value === null || value === ''

/**
 * 判断是否为非空数组
 * @param {*} arr
 */
export const hasChildInArr = arr => Array.isArray(arr) && arr.length > 0

/**
 * 获取小数点位数
 * @eg '2.1' => 1
 * @param {*} value
 */
export const getPointNumOfVal = value => {
    const pointIndex = String(value).indexOf('.') + 1
    return pointIndex > 0 ? String(value).length - pointIndex : 0
}

/**
 * 数字小数位处理
 * @eg 2.1 => '2.1'; (2.123, 2) => '2.12'
 * @param {*} value
 * @param {*} num 保留小数位数 默认2位
 * @param {*} keepPoint 如果小数位数小于num，是否保留原小数位 默认保持
 */
export const numberToFixed = (value, num = 2, keepPoint = true) => {
    if (keepPoint) {
        const pi = getPointNumOfVal(value) > 2 ? 2 : getPointNumOfVal(value)
        return pi ? parseFloat(value).toFixed(pi) : parseInt(value, 10)
    }
    return parseFloat(value).toFixed(num)
}

/**
 * 数字本地化处理
 * @ge 1234 => 1,234
 * @param {*} value
 */
export const numberToLocaleString = value => String(value).replace(/\d+/, n => n.replace(/(\d)(?=(\d{3})+$)/g, $1 => `${$1},`))
