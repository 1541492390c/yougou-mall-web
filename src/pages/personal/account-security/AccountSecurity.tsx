import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { getAuthAccountApi, updateAuthAccountApi } from '@/api/auth/auth-api'
import { AuthAuthAccount } from '@/interface/auth'
import { LockOutlined, MailOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Modal, Select } from 'antd'
import { NavigateFunction, useNavigate } from 'react-router-dom'

const AccountSecurityHooks: any = (): any => {
    const navigate: NavigateFunction = useNavigate()
    const [updateAuthAccountForm] = Form.useForm()
    const [messageApi, messageContextHolder] = message.useMessage()
    const [autAccount, setAuthAccount] = useState<AuthAuthAccount>()
    const [modalType, setModalType] = useState<number>(0)
    const [updateAuthAccountOpen, setUpdateAuthAccountOpen] = useState<boolean>(false)
    const [emailSuffix, setEmailSuffix] = useState<string>('@qq.com')

    useEffect(() => {
        // 获取双认证授权账号信息
        getAuthAccountApi().then((res) => {
            setAuthAccount(res.data)
        })
    }, [])

    useEffect(() => {
        switch (modalType) {
            case 1:
                updateAuthAccountForm.setFieldValue('username', autAccount?.username)
                return
            case 3:
                autAccount?.email ?
                    updateAuthAccountForm.setFieldValue('email', autAccount?.email.substring(0, autAccount?.email.lastIndexOf('@'))) :
                    updateAuthAccountForm.setFieldValue('email', '')
                return
        }
    }, [modalType])

    const validateUsername = (_: any, value: string): Promise<any> => {
        if (!value && modalType === 1) {
            return Promise.reject(new Error('请输入用户名'))
        }
        return Promise.resolve()
    }

    const validateEmail = (_: any, value: any): Promise<any> => {
        if (value && (/[\s$!\x22#%^&*()_+=.,?@]/).test(value) && modalType === 3) {
            return Promise.reject(new Error('邮箱不能包含特殊符号'))
        }
        return Promise.resolve()
    }

    // 打开对话框
    const openModal = (modalType: number): void => {
        setUpdateAuthAccountOpen(true)
        setModalType(modalType)
    }

    // 更新认证账号信息
    const updateAuthAccount = (value: { username: string, email: string, mobile: string }): void => {
        if (!!value.email) {
            value.email = value.email + emailSuffix
        }
        updateAuthAccountApi(value).then((res) => {
            if (res) {
                setUpdateAuthAccountOpen(false)
                messageApi.success({
                    content: '修改成功',
                    duration: 0.5,
                    onClose: () => {
                        window.location.reload()
                    }
                }).then()
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    return {
        navigate,
        updateAuthAccountForm,
        messageContextHolder,
        autAccount,
        modalType,
        updateAuthAccountOpen,
        setUpdateAuthAccountOpen,
        setEmailSuffix,
        validateUsername,
        validateEmail,
        openModal,
        updateAuthAccount
    }
}

const AccountSecurityPage: React.FC = (): JSX.Element => {
    const {
        navigate,
        updateAuthAccountForm,
        messageContextHolder,
        autAccount,
        modalType,
        updateAuthAccountOpen,
        setUpdateAuthAccountOpen,
        setEmailSuffix,
        validateUsername,
        validateEmail,
        openModal,
        updateAuthAccount
    } = AccountSecurityHooks()

    // 邮箱后缀
    const emailInputSuffix: JSX.Element = (
        <Select defaultValue='@qq.com' onChange={(value: string) => setEmailSuffix(value)}>
            <Select.Option value='@qq.com'>@qq.com</Select.Option>
            <Select.Option value='@gmail.com'>@gmail.com</Select.Option>
            <Select.Option value='@aliyun.com'>@aliyun.com</Select.Option>
        </Select>
    )

    // 更新认证账号信息对话框
    const updateAuthAccountModal: JSX.Element = (
        <Modal title='修改认证账号信息' centered open={updateAuthAccountOpen} footer={null} forceRender
               onCancel={() => setUpdateAuthAccountOpen(false)}>
            <Form form={updateAuthAccountForm} onFinish={updateAuthAccount}>
                {(() => {
                    if (modalType === 1) {
                        return (
                            <Form.Item label='用户名' name='username' rules={[{validator: validateUsername}]}>
                                <Input placeholder='请输入用户名' />
                            </Form.Item>
                        )
                    }
                    if (modalType === 2) {
                        return (
                            <>
                                <Form.Item label='手机号'>
                                    <Input placeholder='请输入手机号' />
                                </Form.Item>
                                <Form.Item label='验证码'>
                                    <Input placeholder='请输入验证码' />
                                </Form.Item>
                            </>
                        )
                    }
                    if (modalType === 3) {
                        return (
                            <Form.Item label='电子邮箱' name='email' rules={[{validator: validateEmail}]}>
                                <Input placeholder='请输入邮箱(选填)' addonAfter={emailInputSuffix}
                                       className={style.emailInput} />
                            </Form.Item>
                        )
                    }
                })()}
                <Form.Item className={style.modalBottom}>
                    <Button type='primary' htmlType='submit'>确认</Button>
                    <Button onClick={() => setUpdateAuthAccountOpen(false)} type='default'
                            style={{marginLeft: '5px'}}>取消</Button>
                </Form.Item>
            </Form>
        </Modal>
    )

    return (
        <>
            <div className={style.card}>
                {/*用户名*/}
                <div className={style.authItem}>
                    <div className={style.authItemTitle}>
                        <span><UserOutlined style={{marginRight: '5px'}} />用户名</span>
                    </div>
                    <div className={style.authItemContent}>
                        <span>{autAccount ? autAccount.username : '--'}</span>
                    </div>
                    <div className={style.authItemSetting}>
                        <Button onClick={() => openModal(1)} type='text' danger>修改用户名</Button>
                    </div>
                </div>
                {/*密码*/}
                <div className={style.authItem}>
                    <div className={style.authItemTitle}>
                        <span><LockOutlined style={{marginRight: '5px'}} />密码</span>
                    </div>
                    <div className={style.authItemContent}>
                        <span>已设置密码</span>
                    </div>
                    <div className={style.authItemSetting}>
                        <Button onClick={() => navigate('/update_password')} type='text' danger>修改密码</Button>
                    </div>
                </div>
                {/*手机号*/}
                <div className={style.authItem}>
                    <div className={style.authItemTitle}>
                        <span><MobileOutlined style={{marginRight: '5px'}} />手机号</span>
                    </div>
                    <div className={style.authItemContent}>
                        <span>{autAccount && autAccount.mobile ? autAccount.mobile : '--'}</span>
                    </div>
                    <div className={style.authItemSetting}>
                        <Button disabled={autAccount && autAccount.mobile} onClick={() => openModal(2)} type='text'
                                danger>
                            {autAccount && autAccount.mobile ? '已绑定手机号' : '绑定手机号'}
                        </Button>
                    </div>
                </div>
                {/*邮箱*/}
                <div className={style.authItem}>
                    <div className={style.authItemTitle}>
                        <span><MailOutlined style={{marginRight: '5px'}} />邮箱</span>
                    </div>
                    <div className={style.authItemContent}>
                        <span>{autAccount && autAccount.email ? autAccount.email : '--'}</span>
                    </div>
                    <div className={style.authItemSetting}>
                        <Button onClick={() => openModal(3)} type='text' danger>
                            {autAccount && autAccount.email ? '修改邮箱' : '绑定邮箱'}
                        </Button>
                    </div>
                </div>
            </div>
            {/*更新认证账号对话框*/}
            {updateAuthAccountModal}
            {/*全局消息提醒*/}
            {messageContextHolder}
        </>
    )
}

export default AccountSecurityPage