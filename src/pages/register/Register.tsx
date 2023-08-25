import React, { useRef, useState } from 'react'
import style from './style.module.scss'
import { Button, Form, Input, message, Result, Select, Steps } from 'antd'
import {
    CaretDownOutlined,
    CheckOutlined,
    FormOutlined,
    LockOutlined,
    MailOutlined,
    MobileOutlined,
    SmileOutlined,
    UserOutlined
} from '@ant-design/icons'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { registerApi } from '@/api/user/user-api'
import { StepProps } from 'antd/es/steps'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { sendSmsApi, validateMobileApi } from '@/api/extra/sms-api'

const RegisterHooks: any = (): any => {
    const navigate: NavigateFunction = useNavigate()
    const [registerForm] = Form.useForm()
    const [validateMobileForm] = Form.useForm()
    const [messageApi, messageContextHolder] = message.useMessage()
    const [sendCodeButtonActive, setSendCodeButtonActive] = useState<boolean>(false)
    const [sendCodeButtonText, setSendCodeButtonText] = useState<string>('发送验证码')
    const [mobile, setMobile] = useState<string>('')
    const [currentStep, setCurrentStep] = useState<number>(2)
    const [emailSuffix, setEmailSuffix] = useState<string>('@qq.com')
    const stepItems = useRef<Array<StepProps>>([
        {title: '手机验证', icon: <MobileOutlined style={{fontSize: '25px'}} />},
        {title: '填写信息', icon: <FormOutlined style={{fontSize: '25px'}} />},
        {title: '完成注册', icon: <CheckOutlined style={{fontSize: '25px'}} />}
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

    const validateUsername = (_: any, value: string): Promise<any> => {
        if (!value) {
            return Promise.reject(new Error('请输入用户名'))
        }
        return Promise.resolve()
    }

    const validateNickname = (_: any, value: string): Promise<any> => {
        if (!value) {
            return Promise.reject(new Error('请输入昵称'))
        }
        return Promise.resolve()
    }

    const validatePassword = (_: any, value: string): Promise<any> => {
        if (!value) {
            return Promise.reject(new Error('请输入密码'))
        }
        if (value.length < 6) {
            return Promise.reject(new Error('密码长度不小于6个字符'))
        }
        return Promise.resolve()
    }

    const validatePassword2 = (_: any, value: string): Promise<any> => {
        if (!value) {
            return Promise.reject(new Error('请再次确认密码'))
        }
        if (value.length < 6) {
            return Promise.reject(new Error('密码长度不小于6个字符'))
        }
        if (value !== registerForm.getFieldValue('password')) {
            return Promise.reject(new Error('两次密码不一致'))
        }
        return Promise.resolve()
    }

    const validateEmail = (_: any, value: any): Promise<any> => {
        if (value && (/[\s$!\x22#%^&*()_+=.,?@]/).test(value)) {
            return Promise.reject(new Error('邮箱不能包含特殊符号'))
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
            if (res.data) {
                messageApi.success('验证成功').then()
                setMobile(value.mobile)
                setCurrentStep(1)
            }
        })
    }

    // 注册
    const register = (value: { username: string, password: string, email: string }): void => {
        if (!!value.email) {
            value.email = value.email + emailSuffix
        }
        let data: any = {
            username: value.username,
            password: value.password,
            email: value.email,
            mobile: mobile
        }
        registerApi(data)
            .then(() => {
                setCurrentStep(2)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return {
        navigate,
        currentStep,
        validateMobileForm,
        registerForm,
        sendCodeButtonActive,
        sendCodeButtonText,
        stepItems,
        messageContextHolder,
        setEmailSuffix,
        validateMobile,
        validateCode,
        validateUsername,
        validateNickname,
        validatePassword,
        validatePassword2,
        validateEmail,
        sendCode,
        validate,
        register
    }
}

const RegisterPage: React.FC = () => {
    const {
        navigate,
        currentStep,
        registerForm,
        validateMobileForm,
        sendCodeButtonActive,
        sendCodeButtonText,
        stepItems,
        messageContextHolder,
        setEmailSuffix,
        validateMobile,
        validateCode,
        validateUsername,
        validateNickname,
        validatePassword,
        validatePassword2,
        validateEmail,
        sendCode,
        validate,
        register
    } = RegisterHooks()

    // 邮箱后缀
    const emailInputSuffix: JSX.Element = (
        <Select defaultValue='@qq.com' onChange={(value: string) => setEmailSuffix(value)}>
            <Select.Option value='@qq.com'>@qq.com</Select.Option>
            <Select.Option value='@gmail.com'>@gmail.com</Select.Option>
            <Select.Option value='@aliyun.com'>@aliyun.com</Select.Option>
        </Select>
    )

    // 验证手机号
    const validateMobileStep: JSX.Element = (
        <Form form={validateMobileForm} onFinish={validate}>
            <Form.Item name='mobile' rules={[{validator: validateMobile}]}>
                <Input addonBefore={
                    <div className={style.phoneBefore}>
                        <span>+86</span>
                        <span style={{marginLeft: '2px'}}><CaretDownOutlined /></span>
                    </div>
                } placeholder='请输入手机号' className={style.codeInput} />
            </Form.Item>
            <Form.Item name='code' rules={[{validator: validateCode}]}>
                <Input addonAfter={
                    <Button disabled={sendCodeButtonActive} onClick={sendCode}
                            type='primary'>{sendCodeButtonText}</Button>}
                       placeholder='请输入验证码' className={style.codeInput} />
            </Form.Item>
            <Form.Item>
                <Button type='primary' htmlType='submit' className={style.registerButton}>下一步</Button>
            </Form.Item>
        </Form>
    )

    // 填写用户信息
    const registerInfo: JSX.Element = (
        <Form form={registerForm} onFinish={register}>
            <Form.Item name='username' rules={[{validator: validateUsername}]}>
                <Input placeholder='请输入用户名' prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item name='nickname' rules={[{validator: validateNickname}]}>
                <Input placeholder='请输入昵称' prefix={<SmileOutlined />} />
            </Form.Item>
            <Form.Item name='password' rules={[{validator: validatePassword}]}>
                <Input.Password placeholder='请输入密码' prefix={<LockOutlined />} />
            </Form.Item>
            <Form.Item name='password2' rules={[{validator: validatePassword2}]}>
                <Input.Password placeholder='请输入密码' prefix={<LockOutlined />} />
            </Form.Item>
            <Form.Item name='email' rules={[{validator: validateEmail}]}>
                <Input placeholder='请输入邮箱(选填)' prefix={<MailOutlined />} addonAfter={emailInputSuffix}
                       className={style.emailInput} />
            </Form.Item>
            <Form.Item>
                <Button type='primary' htmlType='submit' className={style.registerButton}>确认注册</Button>
            </Form.Item>
        </Form>
    )

    // 注册成功
    const registerSuccess: JSX.Element = (
        <Result status='success' title='注册成功,请前往登录或返回首页' extra={[
            <Button type='primary' onClick={() => navigate('/login')}>前往登录</Button>,
            <Button type='default' onClick={() => navigate('/')}>返回首页</Button>
        ]} />
    )

    return (
        <>
            <Header />
            <div className={style.main}>
                <div className={style.register}>
                    <Steps current={currentStep} items={stepItems.current} />
                    <div className={style.registerForm}>
                        {currentStep === 0 && validateMobileStep}
                        {currentStep === 1 && registerInfo}
                        {currentStep === 2 && registerSuccess}
                    </div>
                </div>
            </div>
            <Footer />
            {/*全局消息提醒*/}
            {messageContextHolder}
        </>
    )
}

export default RegisterPage