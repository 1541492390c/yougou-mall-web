import React, { useRef, useState } from 'react'
import style from './style.module.scss'
import { Button, Form, Input, message, Result, Steps } from 'antd'
import { CaretDownOutlined, CheckOutlined, FormOutlined, MobileOutlined } from '@ant-design/icons'
import { sendSmsApi, validateMobileApi } from '@/api/extra/sms-api'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { StepProps } from 'antd/es/steps'
import { updatePasswordApi } from '@/api/auth/auth-api'
import { NavigateFunction, useNavigate } from 'react-router-dom'

const UpdatePasswordHooks: any = (): any => {
    const navigate: NavigateFunction = useNavigate()
    const [validateMobileForm] = Form.useForm()
    const [updatePasswordForm] = Form.useForm()
    const [sendCodeButtonActive, setSendCodeButtonActive] = useState<boolean>(false)
    const [sendCodeButtonText, setSendCodeButtonText] = useState<string>('发送验证码')
    const [messageApi, messageContextHolder] = message.useMessage()
    const [mobile, setMobile] = useState<string>('')
    const [currentStep, setCurrentStep] = useState<number>(0)
    const stepItems = useRef<Array<StepProps>>([
        {title: '手机验证', icon: <MobileOutlined style={{fontSize: '25px'}} />},
        {title: '修改密码', icon: <FormOutlined style={{fontSize: '25px'}} />},
        {title: '完成修改', icon: <CheckOutlined style={{fontSize: '25px'}} />}
    ])

    const validateMobile = (_: any, value: string) => {
        if (!value) {
            return Promise.reject(new Error('请输入手机号'))
        }
        if (value.length !== 11) {
            return Promise.reject(new Error('请输入正确的手机号'))
        }
        return Promise.resolve()
    }

    const validateCode = (_: any, value: string) => {
        if (!value) {
            return Promise.reject(new Error('请输入验证码'))
        }
        if (value.length !== 6) {
            return Promise.reject(new Error('请输入正确的验证码'))
        }
        return Promise.resolve()
    }

    const validateNewPassword = (_: any, value: any) => {
        if (!value) {
            return Promise.reject(new Error('请输入新密码'))
        }
        if (value.length < 6) {
            return Promise.reject(new Error('新密码不得小于6个字符'))
        }
        return Promise.resolve()
    }

    const validateNewPassword2 = (_: any, value: any) => {
        if (!value) {
            return Promise.reject(new Error('请再次确认新密码'))
        }
        if (value.length < 6) {
            return Promise.reject(new Error('新密码不得小于6个字符'))
        }
        if (value !== updatePasswordForm.getFieldValue('newPassword')) {
            return Promise.reject(new Error('两次密码不一致'))
        }
        return Promise.resolve()
    }

    // 发送手机验证码
    const sendCode = (): void => {
        if (!validateMobileForm.getFieldValue('mobile')) {
            validateMobileForm.validateFields(['mobile']).then()
        } else {
            sendSmsApi(validateMobileForm.getFieldValue('mobile')).then((res) => {
                if (res) {
                    messageApi.success('发送成功').then()
                    setSendCodeButtonActive(true)
                    let timeout: number = 60
                    let timer = setInterval(() => {
                        if (timeout > 0) {
                            timeout--
                            setSendCodeButtonText(timeout + '秒后重新发送')
                        } else {
                            setSendCodeButtonActive(false)
                            setSendCodeButtonText('发送验证码')
                            clearInterval(timer)
                            timeout = 60
                        }
                    }, 1000)
                }
            })
        }
    }

    // 验证手机号
    const validate = (value: { mobile: string, code: string }): void => {
        validateMobileApi(value.mobile, value.code).then((res) => {
            if (res) {
                messageApi.success('验证成功').then()
                setMobile(value.mobile)
                setCurrentStep(1)
            }
        })
    }

    // 修改密码
    const updatePassword = (value: {newPassword: string}) => {
        let data: any = {
            mobile: mobile,
            newPassword: value.newPassword
        }
        updatePasswordApi(data).then((res) => {
            if (res) {
                messageApi.success('修改成功').then()
                setCurrentStep(2)
                localStorage.removeItem('token')
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    return {
        navigate,
        validateMobileForm,
        updatePasswordForm,
        sendCodeButtonActive,
        sendCodeButtonText,
        messageContextHolder,
        currentStep,
        stepItems,
        validateMobile,
        validateCode,
        validateNewPassword,
        validateNewPassword2,
        sendCode,
        validate,
        updatePassword
    }
}

const UpdatePasswordPage: React.FC = (): JSX.Element => {
    const {
        navigate,
        validateMobileForm,
        updatePasswordForm,
        sendCodeButtonActive,
        sendCodeButtonText,
        messageContextHolder,
        currentStep,
        stepItems,
        validateMobile,
        validateCode,
        validateNewPassword,
        validateNewPassword2,
        sendCode,
        validate,
        updatePassword
    } = UpdatePasswordHooks()

    // 验证手机号
    const validateMobileStep: JSX.Element = (
        <Form onFinish={validate} form={validateMobileForm}>
            <Form.Item name='mobile' rules={[{validator: validateMobile}]}>
                <Input addonBefore={
                    <div className={style.mobileBefore}>
                        <span>+86</span>
                        <span style={{marginLeft: '2px'}}><CaretDownOutlined /></span>
                    </div>
                } placeholder='请输入手机号' />
            </Form.Item>
            <Form.Item name='code' rules={[{validator: validateCode}]}>
                <Input addonAfter={<Button type='primary' onClick={sendCode}
                                           disabled={sendCodeButtonActive}>{sendCodeButtonText}</Button>}
                       placeholder='请输入验证码'
                       className={style.codeInput} />
            </Form.Item>
            <Form.Item>
                <Button type='primary' htmlType='submit' className={style.updatePasswordButton}>下一步</Button>
            </Form.Item>
        </Form>
    )

    // 修改密码
    const updatePasswordStep: JSX.Element = (
        <Form onFinish={updatePassword} form={updatePasswordForm}>
            <Form.Item name='newPassword' rules={[{validator: validateNewPassword}]}>
                <Input.Password placeholder='请输入新密码' className={style.updatePasswordInput} />
            </Form.Item>
            <Form.Item name='newPassword2' rules={[{validator: validateNewPassword2}]}>
                <Input.Password placeholder='请再次确认新密码' className={style.updatePasswordInput} />
            </Form.Item>
            <Form.Item>
                <Button type='primary' htmlType='submit' className={style.updatePasswordButton}>确认修改</Button>
            </Form.Item>
        </Form>
    )

    // 注册成功
    const updateSuccess: JSX.Element = (
        <Result status='success' title='注册成功,请前往登录或返回首页' extra={[
            <Button type='primary' onClick={() => navigate('/login')}>前往登录</Button>,
            <Button type='default' onClick={() => navigate('/')}>返回首页</Button>
        ]} />
    )

    return (
        <>
            <Header />
            <div className={style.main}>
                <div className={style.updatePassword}>
                    <Steps current={currentStep} items={stepItems.current} />
                    <div className={style.updatePasswordForm}>
                        {currentStep === 0 && validateMobileStep}
                        {currentStep === 1 && updatePasswordStep}
                        {currentStep === 2 && updateSuccess}
                    </div>
                </div>
            </div>
            <Footer />
            {/*全局消息提醒*/}
            {messageContextHolder}
        </>
    )
}

export default UpdatePasswordPage