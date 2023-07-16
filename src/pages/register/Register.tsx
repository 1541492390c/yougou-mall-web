import React, { useRef, useState } from 'react'
import style from './style.module.scss'
import { Button, Form, Input, Result, Select, Steps } from 'antd'
import {
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

const RegisterHooks: any = (): any => {
    const navigate: NavigateFunction = useNavigate()
    const [currentStep, setCurrentStep] = useState<number>(1)
    const [emailSuffix, setEmailSuffix] = useState<string>('@qq.com')
    const [registerForm] = Form.useForm()
    const stepItems = useRef<Array<StepProps>>([
        {title: '手机验证', icon: <MobileOutlined style={{fontSize: '25px'}} />},
        {title: '填写信息', icon: <FormOutlined style={{fontSize: '25px'}} />},
        {title: '完成注册', icon: <CheckOutlined style={{fontSize: '25px'}} />}
    ])

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

    // 注册
    const register = (values: { username: string, password: string, email: string }): void => {
        if (!!values.email) {
            values.email =  values.email + emailSuffix
        }
        registerApi(values)
            .then(() => {
                setCurrentStep(pre => ++pre)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return {
        navigate,
        currentStep,
        registerForm,
        stepItems,
        setEmailSuffix,
        validateUsername,
        validateNickname,
        validatePassword,
        validatePassword2,
        validateEmail,
        register,
    }
}

const RegisterPage: React.FC = () => {
    const {
        navigate,
        currentStep,
        registerForm,
        stepItems,
        setEmailSuffix,
        validateUsername,
        validateNickname,
        validatePassword,
        validatePassword2,
        validateEmail,
        register,
    } = RegisterHooks()

    // 邮箱后缀
    const emailInputSuffix: JSX.Element = (
        <Select defaultValue='@qq.com' onChange={(value: string) => setEmailSuffix(value)}>
            <Select.Option value='@qq.com'>@qq.com</Select.Option>
            <Select.Option value='@gmail.com'>@gmail.com</Select.Option>
            <Select.Option value='@aliyun.com'>@aliyun.com</Select.Option>
        </Select>
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
                        {/*{step === 0 && stepOne}*/}
                        {currentStep === 1 && registerInfo}
                        {currentStep === 2 && registerSuccess}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default RegisterPage