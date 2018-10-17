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
        listProduct: payload => dispatch(PRODUCT.LIST, payload),
        delteProduct: payload => dispatch(PRODUCT.DELETE, payload),
    }),
)
export default class Products extends React.Component {
    state = {}

    componentDidMount() {
        this.props.listProduct().then(([res, e]) => {
            if (res) {
                console.log('data:', res)
                message.success('列表加载完成！')
            } else {
                console.log('err:', e)
                message.error(e.message || e)
            }
        })
    }

    handleDelete = id => {
        this.props.delteProduct({ id })
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
