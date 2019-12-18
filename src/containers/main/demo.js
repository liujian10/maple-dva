import React, { useEffect } from 'react'
import moment from 'moment'
import { Carousel } from 'antd'
import { useStates } from '@/common/util'
import { MOMENT_FORMAT } from '@/common/config'
import Chart, { formatChartData, getScaleMaxFromData } from '@/components/common/chart'

import styles from './index.styl'

export const getRandomChartData = (length = 20, key) => {
    const data = []
    for (let i = 0; i < length; i += 1) {
        data.push(formatChartData({
            // key: i,
            name: moment().subtract('s', i).format(MOMENT_FORMAT.time),
            item1: (100 * Math.random()) + (10 * Math.random()) + (10 * Math.random()),
            item2: (100 * Math.random()) + (10 * Math.random()) + (10 * Math.random()),
            item3: (10 * Math.random()) + (10 * Math.random()),
            item4: 40,
            item5: 50,
            item6: 60,
        }))
    }
    return data.reverse()
}

const data = getRandomChartData(24)

export default () => {
    const state = useStates({ data })
    const max = getScaleMaxFromData(data, ['item1', 'item2', 'item3'])

    useEffect(() => {
        const timer = setInterval(() => {
            const [, ...newData] = state.data
            state.setState({ data: [...newData, ...getRandomChartData(1)] })
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, null)

    const lineLegend = {
        data: state.data,
        height: 300,
        scale: {
            item1: {
                type: 'linear',
                formatter: value => `${value.toFixed(2)} h`,
                min: 0,
                max,
                alias: '平均测试时间',
            },
            name: {
                position: 'bottom',
            },
        },
        geoms: [
            {
                type: 'line',
                position: 'name*item1',
                size: 3,
                color: '#FA5190',
                shape: 'smooth',
                hasPoint: true,
            },
        ],
        guideLines: [{
            start: ['min', 50],
            end: ['max', 50],
            text: {
                content: '50 h',
                position: 'end',
                style: {
                    textAlign: 'start',
                    fontSize: 12,
                    lineHeight: 12,
                    color: '#5965E8',
                },
            },
        }],
        onClick: (...params) => {
            console.log(params)
        },
    }

    return (
        <div className={styles.demo}>
            <Carousel dotPosition="left" dots={false} autoplay={true} autoplaySpeed={2000}>
                <div><h3>1</h3></div>
                <div><h3>2</h3></div>
                <div><h3>3</h3></div>
                <div><h3>4</h3></div>
            </Carousel>
            <Chart {...lineLegend} />
        </div>
    )
}
