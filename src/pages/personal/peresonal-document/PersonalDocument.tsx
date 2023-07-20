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
        <div>
            <div className={style.card}>
                <div className={style.title}>
                    <span>简介</span>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}

export default PersonalDocumentPage