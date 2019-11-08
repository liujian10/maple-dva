import React from 'react'
import { Link } from 'dva/router'

import styles from './home.styl'

export default props => (
    <div className={styles.normal}>
        <h1 className={styles.title}>Yay! Welcome to dva!</h1>
        <div className={styles.welcome} />
        <ul className={styles.list}>
            <li className={styles['list-item']}><Link to="products">Products</Link></li>
            <li className={styles['list-item']}><Link to="/404">404</Link></li>
            <li className={styles['list-item']}><Link to="/no-authority">no-authority</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
            <li className={styles['list-item']}><Link to="demo">Demo</Link></li>
        </ul>
    </div>
)
