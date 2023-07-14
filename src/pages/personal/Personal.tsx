import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import Header from '@/components/header/Header'
import { Location, NavigateFunction, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Footer from '@/components/footer/Footer'
import { Menu, MenuProps } from 'antd'
import { ContainerOutlined, HeartOutlined, UserOutlined, WalletOutlined, WhatsAppOutlined } from '@ant-design/icons'

const PersonalHooks: any = (): any => {
    const location: Location = useLocation()
    const navigate: NavigateFunction = useNavigate()
    const [selectKey, setSelectKey] = useState<string>('')
    const menuItems: MenuProps['items'] = [
        {label: '个人资料', key: '', icon: <UserOutlined />},
        {label: '我的订单', key: 'order', icon: <ContainerOutlined />},
        {label: '我的收藏', key: 'favorite', icon: <HeartOutlined />},
        {label: '我的优惠券', key: 'coupons', icon: <WalletOutlined />},
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

    return {menuItems, selectKey, handleSelect}
}

const PersonalPage: React.FC = (): JSX.Element => {
    const {menuItems, selectKey, handleSelect} = PersonalHooks()

    return (
        <>
            <Header />
            <div className={style.flex}>
                <div className={style.main}>
                    <div className={style.personalBody}>
                        <div className={style.menu}>
                            <div className={style.personalTitle}>
                                <span>个人中心</span>
                            </div>
                            <Menu defaultSelectedKeys={['']} selectedKeys={[selectKey]} items={menuItems}
                                  onSelect={handleSelect} />
                        </div>
                        <div className={style.outlet}>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default PersonalPage