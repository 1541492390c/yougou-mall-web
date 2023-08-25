import React from 'react'
import { NavigateFunction, NavLink, useNavigate } from 'react-router-dom'
import { Button, message, Modal } from 'antd'
import { ExportOutlined, LockOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import style from './style.module.scss'
import { isEmpty } from '@/utils'
import AvatarEmpty from '@/assets/img/empty/avatar-empty.png'
import { logoutApi } from '@/api/auth/auth-api'
import { setIsLogin, setUserinfo } from '@/store/slice'
import { Dispatch } from '@reduxjs/toolkit'
import { User } from '@/interface/user'

const RightBarPersonalHooks: any = (): any => {
    const navigate: NavigateFunction = useNavigate()
    const dispatch: Dispatch = useDispatch()
    const [modal, contextHolder] = Modal.useModal()
    const userinfo: User = useSelector((state: any) => state.userinfo)

    // 退出登录
    const logout = () => {
        modal.confirm({
            title: '退出登录',
            content: '此操作将退出登录,是否继续?',
            okType: 'danger',
            onOk: () => {
                logoutApi().then((res) => {
                    if (res) {
                        message.success('退出登录成功').then()
                        localStorage.removeItem('token')
                        dispatch(setIsLogin(false))
                        dispatch(setUserinfo({}))
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        })
    }

    return {navigate, userinfo, contextHolder, logout}
}

const RightBarPersonalComponent: React.FC = (): JSX.Element => {
    const {navigate, userinfo, contextHolder, logout} = RightBarPersonalHooks()

    return (
        <div className={style.main}>
            <div className={style.personalTitle}><span>个人中心</span></div>
            <div className={style.avatar}>
                <img src={!isEmpty(userinfo) && !!userinfo.avatar ? userinfo.avatar : AvatarEmpty} alt='' />
            </div>
            <div className={style.username}>
                {(() => {
                    if (isEmpty(userinfo)) {
                        return <NavLink to='/login'>立即登录</NavLink>
                    }
                    return (
                        <NavLink to='/personal'>
                            <div style={{textAlign: 'center'}}>{userinfo.nickname}</div>
                        </NavLink>
                    )
                })()}
            </div>
            <div>
                {(() => {
                    if (isEmpty(userinfo)) {
                        return (
                            <div className={style.unLoginBottom}>
                                <div className={style.forgePassword}><NavLink to='/update_password'>忘记密码?</NavLink></div>
                                <div className={style.toRegister}><NavLink to='/register'>免费注册</NavLink></div>
                            </div>
                        )
                    }
                    return (
                        <div className={style.isLoginBottom}>
                            <div><Button icon={<LockOutlined />}
                                         type='primary'
                                         onClick={() => navigate('/update_password')}>修改密码</Button></div>
                            <div><Button onClick={logout} icon={<ExportOutlined />} type='primary'>退出登录</Button></div>
                        </div>
                    )
                })()}
            </div>
            {contextHolder}
        </div>
    )
}

export default RightBarPersonalComponent