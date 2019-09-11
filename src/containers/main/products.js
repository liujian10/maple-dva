import React from 'react'
import propTypes from 'prop-types'
import { Button, message } from 'antd'
import PRODUCT, { namespace } from '@/models/products/actions'
import container from '@/common/container'
import ProductList from '@/components/ProductList'
import AntdFormModal from '@/components/AntdFormModal'
import NoformModal from '@/components/NoformModal'

import styles from './products.styl'

@container(
    false,
    namespace,
)
export default class Products extends React.Component {
    static propTypes = {
        list: propTypes.array,
        types: propTypes.array,
        submitLoading: propTypes.bool,
        $loading: propTypes.object,
    }

    static defaultProps = {
        list: [],
        types: [],
        $loading: {},
        submitLoading: false,
    }

    state = {
        noformVisible: false,
        antdFormVisible: false,
        noformItem: {},
        antdFormItem: {},
    }

    componentDidMount() {
        console.log('componentDidMount')
        this.props.dispatch(PRODUCT.TYPES)
        this.props.dispatch(PRODUCT.LIST).then(([res, e]) => {
            if (res) {
                message.success('列表加载完成！')
            } else {
                message.error(e.message || e)
            }
        })
    }

    handleDelete = id => {
        this.props.dispatch(PRODUCT.DELETE, { id })
    }

    handleSubmit = (values, callback) => {
        this.props.dispatch(PRODUCT.SET_STATE, {
            submitLoading: true,
        })
        setTimeout(() => {
            this.props.dispatch(PRODUCT.UPDATE, values).then(() => {
                this.hideEditModal()
                message.success('保存成功！')
                callback()
            })
        }, 1000)
    }

    showEditModal = (type, item = {}) => {
        const newState = {}
        if (type === 'antd') {
            const antdFormItem = { }
            Object.entries(item).forEach(([key, value]) => {
                antdFormItem[key] = { value: key === 'enable' ? !!value : value }
            })
            newState.antdFormItem = antdFormItem
            newState.antdFormVisible = true
        } else {
            newState.noformItem = { ...item, enable: !!item.enable }
            newState.noformVisible = true
        }
        this.setState(newState)
    }

    hideEditModal = () => {
        this.setState({
            antdFormVisible: false,
            noformVisible: false,
            antdFormItem: {},
            noformItem: {},
        })
    }

    changedFields = fields => {
        this.setState(({ antdFormItem }) => ({
            antdFormItem: { ...antdFormItem, ...fields },
        }))
    }

    render() {
        const {
            list, types, $loading, submitLoading,
        } = this.props

        const {
            antdFormVisible, noformVisible, antdFormItem, noformItem,
        } = this.state

        const antdModalProps = {
            fields: antdFormItem,
            types,
            visible: antdFormVisible,
            loading: submitLoading,
            onChange: this.changedFields,
            hideModal: this.hideEditModal,
            handleSubmit: this.handleSubmit,
        }
        const noformModalProps = {
            fields: noformItem,
            types,
            visible: noformVisible,
            onChange: this.changedFields,
            hideModal: this.hideEditModal,
            handleSubmit: this.handleSubmit,
        }
        const listProps = {
            products: list,
            types,
            showEditModal: this.showEditModal,
            loading: $loading[`${PRODUCT.LIST}`],
            onDelete: this.handleDelete,
        }
        return (
            <div className={styles.container}>
                <h2>List of Products</h2>
                <div className={styles.tool}>
                    <Button icon="plus" onClick={() => this.showEditModal('no-form')}>Noform</Button>
                    <Button icon="plus" onClick={() => this.showEditModal('antd')} style={{ marginLeft: 10 }}>Antd Form</Button>
                </div>
                <ProductList {...listProps} />
                <AntdFormModal {...antdModalProps} />
                <NoformModal {...noformModalProps} />
            </div>
        )
    }
}
