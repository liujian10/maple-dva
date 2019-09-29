import React from 'react'
import {
    Card, Icon, Input, Button, Form,
} from 'antd'
import container from '@/common/container'
import { URLS } from '@/common/config'
import ACTION, { namespace } from '@/models/app/actions'

import styles from './login.styl'

const { Password } = Input

@container(true, namespace)
class Login extends React.Component {
    state = {}

    handleSubmit = e => {
        e.preventDefault()
        const { form: { validateFields }, history, dispatch } = this.props
        validateFields((err, values) => {
            if (!err) {
                dispatch(ACTION.LOGIN, values).then(() => {
                    history.push(URLS.home)
                })
            }
        })
    }

    render() {
        const {
            form: { getFieldDecorator },
            $loading: { [ACTION.LOGIN]: loading },
        } = this.props
        return (
            <Card hoverable={true} style={{ borderRadius: 4, border: 'none' }}>
                <div className={styles.main}>
                    <div className={styles.logo}>
                        <Icon type="coffee" />
                        Demo
                    </div>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Password
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block={true} loading={loading}>
                                登陆
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Card>
        )
    }
}

export default Login
