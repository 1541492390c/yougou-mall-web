import React, { useEffect, useState } from 'react'
import { NavigateFunction, NavLink, useNavigate } from 'react-router-dom'
import style from './style.module.scss'
import { Button, Form, Input, message } from 'antd'
import { LockOutlined, UserOutlined, VerifiedOutlined } from '@ant-design/icons'
import { loginApi } from '@/api/auth/auth-api'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { baseUrl } from '@/request'
import { useDispatch } from 'react-redux'
import { setIsLogin } from '@/store'
import { Dispatch } from '@reduxjs/toolkit'

const LoginHooks: any = (): any => {
    const navigate: NavigateFunction = useNavigate()
    const dispatch: Dispatch = useDispatch()
    const captchaUrl: string = baseUrl + '/biz/captcha/image'
    const [random, setRandom] = useState(Math.random())
    const [messageApi, messageContextHolder] = message.useMessage()
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)

    useEffect(() => {
        document.title = '优购商城,登录'
        if (!!localStorage.getItem('token')) {
            navigate('/')
        }
        return () => {
            document.title = '优购商城'
        }
    }, [navigate])

    const validateUsername = (_: any, value: string): Promise<any> => {
        if (!value) {
            return Promise.reject(new Error('请输入账号'))
        }
        return Promise.resolve()
    }

    const validatePassword = (_: any, value: string): Promise<any> => {
        if (!value) {
            return Promise.reject(new Error('请输入密码'))
        }
        if (value.length < 6) {
            return Promise.reject(new Error('密码长度不能小于6个字符'))
        }
        return Promise.resolve()
    }

    const validateCode = (_: any, value: string) => {
        if (!value) {
            return Promise.reject(new Error('请输入验证码'))
        }
        if (value.length !== 4) {
            return Promise.reject(new Error('请输入正确的验证码'))
        }
        return Promise.resolve()
    }

    const login = (values: { username: string, password: string, code: string }): void => {
        setButtonDisabled(true)
        loginApi(values.username, values.password, values.code)
            .then((res => {
                localStorage.setItem('token', res.data.accessToken)
                messageApi.success({
                    content: '登录成功',
                    duration: 0.5,
                    onClose: () => {
                        dispatch(setIsLogin(true))
                        navigate('/')
                    }
                }).then()
            }))
            .catch((err) => {
                setButtonDisabled(false)
                console.log(err)
            })
    }

    return {
        captchaUrl,
        random,
        buttonDisabled,
        messageContextHolder,
        setRandom,
        validateUsername,
        validatePassword,
        validateCode,
        login
    }
}

const LoginPage: React.FC = (): JSX.Element => {
    const {
        captchaUrl,
        random,
        buttonDisabled,
        messageContextHolder,
        setRandom,
        validateUsername,
        validatePassword,
        validateCode,
        login
    } = LoginHooks()

    const loginForm: JSX.Element = (
        <Form onFinish={login}>
            <Form.Item name='username' rules={[{validator: validateUsername}]}>
                <Input placeholder='请输入账号' prefix={<UserOutlined />} className={style.loginInput} />
            </Form.Item>
            <Form.Item name='password' rules={[{validator: validatePassword}]}>
                <Input.Password placeholder='请输入密码' prefix={<LockOutlined />} className={style.loginInput} />
            </Form.Item>
            <Form.Item name='code' rules={[{validator: validateCode}]}>
                <Input placeholder='请输入验证码'
                       prefix={<VerifiedOutlined style={{marginLeft: '11px'}} />}
                       addonAfter={<img src={captchaUrl + '?random=' + random} onClick={() => setRandom(Math.random())}
                                        style={{height: '35px'}} alt='' />}
                       className={style.codeInput} />
            </Form.Item>
            <Form.Item>
                <Button type='primary' htmlType='submit' disabled={buttonDisabled}
                        className={style.loginButton}>登录</Button>
            </Form.Item>
        </Form>
    )

    return (
        <>
            <Header />
            <div className={style.main}>
                <div className={style.loginBackground}>
                    <div className={style.login}>
                        <div className={style.loginCard}>
                            <div>
                                <h1>欢迎登录优购商城</h1>
                            </div>
                            <div className={style.loginForm}>
                                <div style={{width: '300px'}}>{loginForm}</div>
                            </div>
                            <div className={style.toRegisterAndChangePassword}>
                                <div className={style.toRegister}>
                                    <NavLink to='/register'>免费注册</NavLink>
                                </div>
                                <div className={style.toChangePassword}>
                                    <NavLink to='/update_password'>修改密码</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            {/*全局消息提醒*/}
            {messageContextHolder}
        </>
    )
}

export default LoginPage