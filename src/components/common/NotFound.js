import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import NotFoundSvg from '@/images/page/not-found.svg'

import styles from './NotFound.styl'

export default () => (
    <div className={styles.content}>
        <img src={NotFoundSvg} alt="" />
        <div>
            <h1>404</h1>
            <h3>页面不存在</h3>
            <Link to="/"><Button type="primary">返回主页</Button></Link>
        </div>
    </div>
)
