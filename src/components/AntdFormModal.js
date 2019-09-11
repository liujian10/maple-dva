import React from 'react'
import propTypes from 'prop-types'
import { Modal, Form, Input, Select, Switch } from 'antd'
import { isEmptyVal } from '../common/util'

const { Item: FormItem } = Form
const { Option: SelectOption } = Select
const { TextArea } = Input

const FORM_ITEM_ID = 'id'
const FORM_ITEM_NAME = 'name'
const FORM_ITEM_TYPE = 'type'
const FORM_ITEM_ENABLE = 'enable'
const FORM_ITEM_DESC = 'desc'

// 表单项布局
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
}

const AntdFormModal = ({
    form: { validateFields, getFieldDecorator, resetFields },
    visible, types, fields: { id },
    loading,
    hideModal,
    handleSubmit,
}) => {
    const isEditing = id && !isEmptyVal(id.value)

    const modalProps = {
        title: `${isEditing ? 'Edit' : 'Add'} Product`,
        visible,
        confirmLoading: loading,
        onOk: () => {
            validateFields({ force: true }, (err, values) => {
                if (!err) {
                    handleSubmit(values, () => {
                        resetFields()
                    })
                }
            })
        },
        onCancel: hideModal,
    }

    const selectOptions = types.map(({ id: typeId, name }) => (
        <SelectOption value={typeId} key={typeId}>{name}</SelectOption>
    ))

    return (
        <Modal {...modalProps}>
            <Form>
                <FormItem {...formItemLayout} label="Name" >
                    {getFieldDecorator(FORM_ITEM_NAME, {
                        rules: [
                            { required: true },
                            { max: 10 },
                        ],
                    })(<Input placeholder="Please input name" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Type" >
                    {getFieldDecorator(FORM_ITEM_TYPE, {
                        rules: [{ required: true }],
                    })(<Select placeholder="Please select type">{selectOptions}</Select>)}
                </FormItem>
                <FormItem {...formItemLayout} label="Enable" >
                    {getFieldDecorator(FORM_ITEM_ENABLE, {
                        valuePropName: 'checked',
                        rules: [{ required: true }],
                    })(<Switch checkedChildren="Yes" unCheckedChildren="No" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Description" >
                    {getFieldDecorator(FORM_ITEM_DESC, {
                        rules: [
                            { required: true },
                            { max: 100 },
                        ],
                    })(<TextArea rows={3} placeholder="Please input description" />)}
                </FormItem>
                <FormItem style={{ display: 'none' }}>
                    {getFieldDecorator(FORM_ITEM_ID)(<Input />)}
                </FormItem>
            </Form>
        </Modal>
    )
}

AntdFormModal.propTypes = {
    visible: propTypes.bool,
    loading: propTypes.bool,
    fields: propTypes.object,
    types: propTypes.array,
    hideModal: propTypes.func,
    onChange: propTypes.func,
    handleSubmit: propTypes.func,
}
AntdFormModal.defaultProps = {
    visible: false,
    loading: false,
    fields: {},
    types: [],
    hideModal: () => {},
    onChange: () => {},
    handleSubmit: () => {},
}

export default Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields)
    },
    mapPropsToFields({ fields }) {
        const formFields = {}
        Object.entries(fields).forEach(([key, value]) => {
            formFields[key] = Form.createFormField(value)
        })
        return formFields
    },
    onValuesChange() {},
})(AntdFormModal)

