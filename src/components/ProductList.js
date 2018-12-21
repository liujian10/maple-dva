import React from 'react'
import PropTypes from 'prop-types'
import { Table, Popconfirm, Button } from 'antd'

const { Group: ButtonGroup } = Button

const ProductList = ({
    products, loading, types,
    onDelete, showEditModal,
}) => {
    const typeConfig = {}
    types.forEach(type => {
        typeConfig[type.id] = type.name
    })
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: 120,
        }, {
            title: 'Type',
            dataIndex: 'type',
            width: 100,
            render: type => typeConfig[type],
        }, {
            title: 'Enable',
            dataIndex: 'enable',
            width: 100,
            render: enable => (enable ? 'enable' : 'disable'),
        }, {
            title: 'Description',
            dataIndex: 'desc',
        }, {
            title: 'Actions',
            dataIndex: 'id',
            width: 320,
            render: (id, item) => (
                <ButtonGroup>
                    <Button icon="edit" onClick={() => { showEditModal('noform', item) }}>Noform</Button>
                    <Button icon="edit" onClick={() => { showEditModal('antd', item) }}>Antd</Button>
                    <Popconfirm title={`Delete ${item.name}?`} onConfirm={() => onDelete(id)}>
                        <Button icon="delete">Delete</Button>
                    </Popconfirm>
                </ButtonGroup>
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
    products: PropTypes.array.isRequired,
    types: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired,
    showEditModal: PropTypes.func.isRequired,
}

export default ProductList
