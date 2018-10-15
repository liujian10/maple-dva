import React from 'react'
import PropTypes from 'prop-types'
import { Table, Popconfirm, Button } from 'antd'

const ProductList = ({ onDelete, products, loading }) => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        }, {
            title: 'Actions',
            dataIndex: 'id',
            render: (id, { name }) => (
                <Popconfirm title={`Delete ${name}?`} onConfirm={() => onDelete(id)}>
                    <Button>Delete</Button>
                </Popconfirm>
            ),
        },
    ]
    return (
        <Table
            rowKey="id"
            loading={loading}
            dataSource={products}
            columns={columns}
        />
    )
}

ProductList.defaultProps = {
    loading: false,
}

ProductList.propTypes = {
    loading: PropTypes.bool,
    onDelete: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
}

export default ProductList
