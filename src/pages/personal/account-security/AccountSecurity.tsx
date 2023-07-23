import React, { useEffect, useRef, useState } from 'react'
import style from './style.module.scss'
import { getAuthAccountApi } from '@/api/auth/auth-api'
import { AuthAuthAccount } from '@/interface/auth'
import { LockOutlined, MailOutlined, MobileOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Col, Row } from 'antd'
import { NavigateFunction, useNavigate } from 'react-router-dom'

const AccountSecurityHooks: any = (): any => {
    const navigate: NavigateFunction = useNavigate()
    const [autAccount, setAuthAccount] = useState<AuthAuthAccount>()

    useEffect(() => {
        // 获取双认证授权账号信息
        getAuthAccountApi().then((res) => {
            setAuthAccount(res.data)
        })
    }, [])

    return {navigate, autAccount}
}

const AccountSecurityPage: React.FC = (): JSX.Element => {
    const {navigate, autAccount} = AccountSecurityHooks()

    return (
        <div>
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
                        <Button type='text' danger>修改用户名</Button>
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
                        <Button type='text' danger>修改绑定手机号</Button>
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
                        <Button type='text' danger style={{fontSize: '12px'}}>修改绑定邮箱</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountSecurityPage