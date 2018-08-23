import _ from 'lodash'
import { isMock, API_RULES } from './config'

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
