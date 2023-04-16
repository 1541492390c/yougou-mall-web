import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { ExportOutlined, LockOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { imgBaseUrl } from '@/request'
import style from './style.module.scss'
import { isEmpty } from '@/utils'

const RightBarPersonalHooks: any = (): any => {
    const navigate = useNavigate()
    const userinfo = useSelector((state: any) => state.userinfo)
    const avatarUrl = imgBaseUrl + '/avatar/'

    return {navigate, userinfo, avatarUrl}
}

const RightBarPersonalComponent: React.FC = () => {
    const {navigate, userinfo, avatarUrl} = RightBarPersonalHooks()

    return (
        <div className={style.main}>
            <div className={style.personalTitle}><span>个人中心</span></div>
            <div className={style.avatar}>
                {isEmpty(userinfo) ? <img src={avatarUrl + 'default.png'} alt='' /> : <img src={avatarUrl + userinfo.avatar} alt='' />}
            </div>
            <div className={style.username}>
                {(() => {
                    if (isEmpty(userinfo)) {
                        return <NavLink to='/login'>立即登录</NavLink>
                    }
                    return (
                        <NavLink to='/personal'>
                            <div style={{textAlign: 'center'}}>{userinfo.nickname}</div>
                            <div style={{fontSize: '13px'}}>{userinfo.account}</div>
                        </NavLink>
                    )
                })()}
            </div>
            <div>
                {(() => {
                    if (isEmpty(userinfo)) {
                        return (
                            <div className={style.unLoginBottom}>
                                <div className={style.forgePassword}><NavLink to='/change_password'>忘记密码?</NavLink></div>
                                <div className={style.toRegister}><NavLink to='/register'>免费注册</NavLink></div>
                            </div>
                        )
                    }
                    return (
                        <div className={style.isLoginBottom}>
                            <div><Button icon={<LockOutlined />}
                                         type='primary'
                                         onClick={() => navigate('/update_password')}>修改密码</Button></div>
                            <div><Button icon={<ExportOutlined />} type='primary'>退出登录</Button></div>
                        </div>
                    )
                })()}
            </div>
        </div>
    )
}

export default RightBarPersonalComponent