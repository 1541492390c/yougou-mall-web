import React from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import style from './style.module.scss'
import logo from '@/assets/img/yougou.png'

const HeaderComponent: React.FC = (): JSX.Element => {
    const navigate: NavigateFunction = useNavigate()

    return (
        <div className={style.pageHeader}>
            <div className={style.headerContent}>
                <div className={style.logo}>
                    <img src={logo} alt='' />
                </div>
                <div className={style.backHome}>
                    <Button icon={<HomeOutlined />} type='primary' shape='round' onClick={() => navigate('/')}>返回首页</Button>
                </div>
            </div>
        </div>
    )
}

export default HeaderComponent