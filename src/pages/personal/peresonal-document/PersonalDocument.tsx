import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { useSelector } from 'react-redux'
import { Button, Form, Input, Select } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { isEmpty } from '@/utils'

const PersonalDocumentHooks: any = (): any => {
    const [form] = Form.useForm()
    const [emailSuffix, setEmailSuffix] = useState<string>('@qq.com')
    const userinfo = useSelector((state: any) => state.userinfo)

    useEffect(() => {
        form.setFieldsValue({
            gender: userinfo.gender,
            username: userinfo.username,
        })
        // 邮箱不为空时设置邮箱
        if (!isEmpty(userinfo.email)) {
            form.setFieldValue('email', userinfo.email.substring(0, userinfo.email.lastIndexOf('@')))
        }
    }, [userinfo])

    const updateUserinfo = () => {
    }

    return {form, userinfo, setEmailSuffix, updateUserinfo}
}

const PersonalDocumentPage: React.FC = (): JSX.Element => {
    const {form, userinfo, setEmailSuffix, updateUserinfo} = PersonalDocumentHooks()

    // 邮箱后缀选项
    const emailInputSuffix: JSX.Element = (
        <Select defaultValue='@qq.com' onChange={(value: string) => setEmailSuffix(value)}>
            <Select.Option value='@qq.com'>@qq.com</Select.Option>
            <Select.Option value='@gmail.com'>@gmail.com</Select.Option>
            <Select.Option value='@aliyun.com'>@aliyun.com</Select.Option>
        </Select>
    )

    return (
        <div className={style.info}>
            <div>
                <div className={style.avatar}>
                    <img src={userinfo.avatar} alt='' />
                </div>
                <div className={style.form}>
                    <Form form={form} onFinish={updateUserinfo} labelCol={{span: '4'}}>
                        <Form.Item label='手机号' name='phone'>
                            <span>{userinfo?.phone}</span>
                        </Form.Item>
                        <Form.Item label='用户名' name='username'>
                            <Input placeholder='请输入用户名' />
                        </Form.Item>
                        <Form.Item label='邮箱' name='email'>
                            <Input placeholder='请输入邮箱(选填)' addonAfter={emailInputSuffix} />
                        </Form.Item>
                        <Form.Item>
                            <div className={style.updateButton}>
                                <Button type='primary' htmlType='submit' icon={<EditOutlined />}>修改资料</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default PersonalDocumentPage