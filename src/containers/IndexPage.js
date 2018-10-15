import React from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import styles from './IndexPage.css'

function IndexPage() {
    return (
        <div className={styles.normal}>
            <h1 className={styles.title}>Yay! Welcome to dva!</h1>
            <div className={styles.welcome} />
            <ul className={styles.list}>
                <li className={styles['list-item']}><Link to="products">Products</Link></li>
                <li className={styles['list-item']}><Link to="no-form">NoForm</Link></li>
                <li className={styles['list-item']}><Link to="antd-form">Antd Form</Link></li>
            </ul>
        </div>
    )
}

IndexPage.propTypes = {}

export default connect()(IndexPage)
