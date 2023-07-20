import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import Header from '@/components/header/Header'
import { Location, NavigateFunction, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Footer from '@/components/footer/Footer'
import { Menu, MenuProps } from 'antd'
import { ContainerOutlined, StarOutlined, UserOutlined, WalletOutlined, WhatsAppOutlined } from '@ant-design/icons'
import AvatarEmpty from '@/assets/img/empty/avatar-empty.png'
import { User } from '@/interface/user'
import { useSelector } from 'react-redux'

const PersonalHooks: any = (): any => {
    const location: Location = useLocation()
    const navigate: NavigateFunction = useNavigate()
    const userinfo: User = useSelector((state: any) => state.userinfo)
    const [selectKey, setSelectKey] = useState<string>('')
    const menuItems: MenuProps['items'] = [
        {label: '个人资料', key: '', icon: <UserOutlined />},
        {label: '我的订单', key: 'my_order', icon: <ContainerOutlined />},
        {label: '我的收藏', key: 'favorite', icon: <StarOutlined />},
        {label: '我的优惠券', key: 'my_coupon', icon: <WalletOutlined />},
        {label: '收货人信息', key: 'addr', icon: <WhatsAppOutlined />}
    ]

    useEffect(() => {
        document.title = '优购商城,个人中心'
        if (location.pathname !== '/personal') {
            let pathname: string = location.pathname
            setSelectKey(pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length))
        }
        return () => {
            document.title = '优购商城'
        }
    }, [location])

    const handleSelect = (value: any) => {
        setSelectKey(value.key)
        navigate(value.key)
    }

    return {userinfo, menuItems, selectKey, handleSelect}
}

const PersonalPage: React.FC = (): JSX.Element => {
    const {userinfo, menuItems, selectKey, handleSelect} = PersonalHooks()

    // 个人简介
    const personalDocumentCard: JSX.Element = (
        <div className={style.personalDocumentCard}>
            <img src={!!userinfo.avatar ? userinfo.avatar : AvatarEmpty} alt='' />
            <div className={style.myInfo}>
                <div className={style.username}>
                    <span>{userinfo.username}</span>
                </div>
            </div>
        </div>
    )

    // 导航栏
    const leftMenu: JSX.Element = (
        <div className={style.menu}>
            <div className={style.personalTitle}>
                <span>个人中心</span>
            </div>
            <Menu defaultSelectedKeys={['']} selectedKeys={[selectKey]} items={menuItems}
                  onSelect={handleSelect} />
        </div>
    )

    return (
        <>
            <Header />
            <div className={style.flex}>
                <div className={style.main}>
                    <div className={style.body}>
                        <div className={style.personalDocument}>
                            {/*个人资料*/}
                            {personalDocumentCard}
                        </div>
                        <div className={style.menuAndOutlet}>
                            {/*导航栏*/}
                            {leftMenu}
                            <div className={style.outlet}>
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default PersonalPage