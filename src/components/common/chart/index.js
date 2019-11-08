// data-set 可以按需引入，除此之外不要引入别的包
import React from 'react'
import PropTypes from 'prop-types'
import {
    Chart, Axis, Tooltip, Geom, Legend, Guide, Label, Coord,
} from 'bizcharts'
import DataSet from '@antv/data-set'
import { numberToFixed } from '@/common/util'
import Empty from '@/components/common/empty'

import styles from './index.styl'

const { Line } = Guide

// export const GEOM_COLOR = {
//     blue: '#4C68E9',
//     red: '#FA5190',
//     yellow: '#FFAC43',
//     green: '#B6D670',
//     deepGreen: '#44B69B',
//     indigo: '#44B69B',
// }

// export const GEOM_TYPE = {
//     interval: 'interval',
//     line: 'line',
//     lineDash: 'line',
// }

// const templates = {}
// Object.entries(GEOM_TYPE).forEach(([key, val]) => {
//     templates[key] = {}
//     Object.entries(GEOM_COLOR).forEach(([k, v]) => {
//         templates[key][k] = key === 'lineDash' ? {
//             type: val,
//             color: v,
//             shape: 'dash',
//             style: {
//                 lineDash: [6, 5],
//                 lineWidth: 1,
//             },
//         } : { type: val, color: v }
//     })
// })

// export const GEOM_TEMP = templates

export const formatChartData = (data, format = (k, v) => v) => {
    if (Array.isArray(data)) {
        return data.map(item => formatChartData(item, format))
    }
    if (typeof data === 'object' && data !== null) {
        const newData = {}
        Object.entries(data).forEach(([k, v]) => {
            if (typeof v === 'number') {
                newData[k] = Number(numberToFixed(format(k, v), 2))
            } else {
                newData[k] = v
            }
        })
        return newData
    }
    return data
}

/**
 * 获取数组 data 中 fields 对应字段值的最大值
 * @param {*} data
 * @param {*} fields 字段
 */
export const getScaleMaxFromData = (data = [], fields = []) => {
    let max = 0
    if (Array.isArray(data)) {
        data.forEach(item => {
            if (Array.isArray(fields)) {
                fields.forEach(field => {
                    if (Number(item[field]) > Number(max)) {
                        max = item[field]
                    }
                })
            }
        })
    }
    if (max < 1) {
        return 1
    } if (max < 10) {
        return 10
    }
    const arr = String(parseInt(max, 10)).split('')
    if (arr[1] >= 5) {
        return (10 ** (arr.length - 1)) * (+arr[0] + 1)
    }
    return ((10 ** (arr.length - 1)) * arr[0]) + ((10 ** (arr.length - 2)) * 5)
}

export default class AxesLegend extends React.Component {
    static propTypes = {
        data: PropTypes.array, // 数据源
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 图表宽度
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 图表高度
        scale: PropTypes.object, // 坐标轴
        legend: PropTypes.object, // 图例
        tooltip: PropTypes.object, // 提示信息
        geoms: PropTypes.array, // 几何标记对象，决定创建图表的类型
        guideLines: PropTypes.array, // 辅助线
        padding: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // 控制边距
        onClick: PropTypes.func, // 点击事件
        onTooltipChange: PropTypes.func, // 提示信息变化时间
        transform: PropTypes.oneOfType([PropTypes.object, PropTypes.array]), // 数据转换
        transpose: PropTypes.bool,
    }

    static defaultProps = {
        data: [],
        width: 'auto',
        height: 500,
        scale: {},
        legend: {},
        tooltip: {},
        geoms: [],
        guideLines: [],
        padding: 'auto',
        onClick: undefined,
        onTooltipChange: undefined,
        transform: undefined,
        transpose: false,
    }

    state ={ container: { ref: undefined, width: 'auto' } }

    // 获取容器宽度，用于生成滚动条
    containerRef = ref => {
        const width = (ref && ref.clientWidth - 20) || 'auto'
        this.setState({
            container: { ref, width },
        })
    }

    render() {
        const {
            data, width, height, padding,
            scale, legend, tooltip, geoms, guideLines, transform,
            onClick, onTooltipChange,
            transpose,
        } = this.props
        const { container } = this.state
        const chartWidth = width !== 'auto' && width < container.width ? container.width : width
        const ds = new DataSet({
            state: { start: 1, end: 20 },
        })
        const dv = ds.createView().source(data)
        if (transform) {
            if (Array.isArray(transform)) {
                transform.reduce((dvFun, transformItem) => dvFun.transform(transformItem), dv)
            } else {
                dv.transform(transform)
            }
        }
        const axis = Object.entries(scale).map(([k, { position = 'left', visible = true }]) => (
            <Axis
                key={k}
                name={k}
                visible={visible}
                position={position}
                grid={position === 'bottom' ? {} : {
                    lineStyle: {
                        stroke: '#e8e8e8', // 网格线的颜色
                        lineWidth: 1, // 网格线的宽度复制代码
                        lineDash: [0, 2, 2], // 虚线的设置, // 网格线的虚线配置，第一个参数描述虚线的实部占多少像素，第二个参数描述虚线的虚部占多少像素
                    }, // 网格线的样式配置，原有属性为 line
                }}
            />
        ))
        const geomList = [].concat(geoms, geoms.filter(({ hasPoint }) => !!hasPoint).map(geom => ({
            ...geom, type: 'point', size: geom.size ? (geom.size + 1) : 3, shape: 'circle',
        }))).map(({ label, ...geomProps }) => (
            <Geom key={`${geomProps.position}-${geomProps.type}`} {...geomProps}>{label ? <Label {...label} /> : null}</Geom>
        ))
        const guideLineList = guideLines.map(({ stroke = '#5965E8', ...line }, index) => (
            <Line
                key={index}
                top={true}
                lineStyle={{
                    stroke, // 线的颜色
                    lineDash: [0, 2, 2], // 虚线的设置
                    lineWidth: 1, // 线的宽度
                }}
                {...line}
            />
        ))
        const itemGap = window.document.documentElement.clientWidth < 1300 ? 30 : 50
        let toolTipItem
        return Array.isArray(data) && data.length > 0 ? (
            <div
                className={styles.container}
                ref={this.containerRef}
            >
                {container.ref ? (
                    <div style={{ width: chartWidth, margin: 'auto', minWidth: '100%' }}>
                        <Chart
                            animate={false}
                            width={chartWidth === 'auto' ? undefined : chartWidth}
                            height={height}
                            forceFit={true}
                            data={dv}
                            scale={scale}
                            padding={padding}
                            onPlotClick={item => {
                                if (onClick) {
                                    onClick(item, toolTipItem)
                                }
                            }}
                            onTooltipChange={item => {
                                toolTipItem = item
                                if (onTooltipChange) {
                                    onTooltipChange(item, toolTipItem)
                                }
                            }}
                        >
                            <Legend
                                itemGap={itemGap}
                                textStyle={{
                                    fill: '#333', // 文本的颜色
                                    fontSize: '14', // 文本大小
                                }}
                                {...legend}
                            />
                            {transpose && <Coord transpose={true} scale={[1, -1]} />}
                            {axis}
                            <Guide>{guideLineList}</Guide>
                            <Tooltip {...tooltip} />
                            {geomList}
                        </Chart>
                    </div>
                ) : 'loading...'}
            </div>
        ) : (
            <div className={styles.none} style={{ height }}>
                <Empty />
            </div>
        )
    }
}
