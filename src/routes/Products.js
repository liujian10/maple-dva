import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'dva'
import actions from '../constants/actions'
import ProductList from '../components/ProductList'

const { products: { DELETE, LIST } } = actions

class Products extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        this.fetchProducts()
    }

    handleDelete = id => {
        this.props.dispatch({
            type: DELETE.API,
            payload: id,
        })
    }

    fetchProducts = () => {
        this.props.dispatch({
            type: LIST.API,
        })
    }

    render() {
        const { list = [] } = this.props
        const products = list.map((item, index) => ({
            key: index,
            ...item,
        }))
        return (
            <div>
                <h2>List of Products</h2>
                <ProductList onDelete={this.handleDelete} products={products} />
            </div>
        )
    }
}

Products.defaultProps = {
    list: [],
}

Products.propTypes = {
    list: propTypes.array,
}

// export default Products;
export default connect(({ products = {} }) => products)(Products)
