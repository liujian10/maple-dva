import React from 'react'
import propTypes from 'prop-types'
import { message } from 'antd'
import PRODUCT, { namespace } from '../models/products/actions'
import container from '../common/container'
import ProductList from '../components/ProductList'
import styles from './Products.styl'

@container(
    false,
    namespace,
    dispatch => ({
        listProduct: (...params) => dispatch(PRODUCT.LIST, ...params),
        delteProduct: (...params) => dispatch(PRODUCT.DELETE, ...params),
    }),
)
export default class Products extends React.Component {
    state = {}

    componentDidMount() {
        this.fetchProducts()
    }

    handleDelete = id => {
        this.props.delteProduct({ id })
    }

    fetchProducts = () => {
        this.props.listProduct().then(([res, payload, e]) => {
            console.log('data:', res)
            console.log('payload:', payload)
            if (res) {
                message.info('列表加载完成！')
            } else {
                message.info(e.message || e)
            }
        })
    }

    render() {
        const { list, $loading } = this.props
        return (
            <div className={styles.container}>
                <h2>List of Products</h2>
                <ProductList
                    products={list}
                    loading={$loading[`${PRODUCT.LIST}`]}
                    onDelete={this.handleDelete}
                />
            </div>
        )
    }
}

Products.defaultProps = {
    list: [],
    $loading: {},
    listProduct: () => {},
    delteProduct: () => {},
}

Products.propTypes = {
    list: propTypes.array,
    $loading: propTypes.object,
    listProduct: propTypes.func,
    delteProduct: propTypes.func,
}
