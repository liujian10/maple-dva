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
        listProduct: (...params) => {
            dispatch(PRODUCT.LIST, ...params)
        },
        delteProduct: (...params) => {
            dispatch(PRODUCT.DELETE, ...params)
        },
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
        this.props.listProduct({}, () => {
            message.info('列表加载完成！')
        })
    }

    render() {
        const { list, $loading } = this.props
        const products = list.map((item, index) => ({
            key: index,
            ...item,
        }))
        return (
            <div className={styles.container}>
                <h2>List of Products</h2>
                <ProductList onDelete={this.handleDelete} products={products} loading={$loading[`${PRODUCT.LIST}`]} />
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
