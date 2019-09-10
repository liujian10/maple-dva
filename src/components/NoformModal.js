import React from 'react'
import propTypes from 'prop-types'
import { Modal } from 'antd'
import Form, { FormItem, FormCore } from 'noform'
import { Input, Select, Switch, Button } from 'noform/lib/wrapper/antd'
import { isEmpty } from '../common/util'

const { TextArea } = Input

const FORM_ITEM_ID = 'id'
const FORM_ITEM_NAME = 'name'
const FORM_ITEM_TYPE = 'type'
const FORM_ITEM_ENABLE = 'enable'
const FORM_ITEM_DESC = 'desc'

const validateConfig = {
    [FORM_ITEM_NAME]: { type: 'string', require: true, max: 10 },
    [FORM_ITEM_TYPE]: { type: 'number', require: true },
    [FORM_ITEM_ENABLE]: { type: 'boolean', require: true },
    [FORM_ITEM_DESC]: { type: 'string', require: true, max: 100 },
}

export default class NoformModal extends React.Component {
    static propTypes = {
        visible: propTypes.bool,
        fields: propTypes.object,
        types: propTypes.array,
        hideModal: propTypes.func,
        onChange: propTypes.func,
        handleSubmit: propTypes.func,
    }
    static defaultProps = {
        visible: false,
        fields: {},
        types: [],
        hideModal: () => {},
        onChange: () => {},
        handleSubmit: () => {},
    }

    constructor(props, context) {
        super(props, context)
        this.core = new FormCore({
            validateConfig,
            autoValidate: true,
        })
    }

    state={}

    UNSAFE_componentWillReceiveProps(nextProps, nextState) {
        const { fields: curFields } = this.props
        const { fields: nextFields } = nextProps
        if (JSON.stringify(curFields) !== JSON.stringify(nextFields)) {
            this.core.setValues(nextFields)
        }
    }

    setStatus = status => {
        this.core.setGlobalStatus(status)
    }

    render() {
        const {
            visible, types, fields: { id },
            hideModal,
            handleSubmit,
        } = this.props
        const isEditing = id && !isEmpty(id)

        const modalProps = {
            title: `${isEditing ? 'Edit' : 'Add'} Product`,
            visible,
            onOk: () => {
                this.core.validate(err => {
                    if (!err) {
                        const values = this.core.getValues()
                        handleSubmit(values, () => {
                            this.core.reset()
                        })
                    }
                })
            },
            onCancel: () => {
                this.core.reset()
                hideModal()
            },
        }

        const selectOptions = types.map(({ id: typeId, name }) => ({ label: name, value: typeId }))

        return (
            <Modal {...modalProps}>
                <Form core={this.core} layout={{ label: 6, control: 16 }}>
                    <FormItem name={FORM_ITEM_NAME} label="Name" >
                        <Input placeholder="Please input name" />
                    </FormItem>
                    <FormItem name={FORM_ITEM_TYPE} label="Type" >
                        <Select placeholder="Please select type" options={selectOptions} />
                    </FormItem>
                    <FormItem name={FORM_ITEM_ENABLE} label="Enable" >
                        <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </FormItem>
                    <FormItem name={FORM_ITEM_DESC} label="Description" >
                        <TextArea rows={3} placeholder="Please input description" />
                    </FormItem>
                    <FormItem name={FORM_ITEM_ID} style={{ display: 'none' }}>
                        <Input />
                    </FormItem>
                    <FormItem label="Global status">
                        <div >
                            <Button style={{ marginRight: 12 }} onClick={this.setStatus.bind(this, 'edit')}>Edit</Button>
                            <Button style={{ marginRight: 12 }} onClick={this.setStatus.bind(this, 'preview')}>Preview</Button>
                            <Button style={{ marginRight: 12 }} onClick={this.setStatus.bind(this, 'disabled')}>Disabled</Button>
                        </div>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}
