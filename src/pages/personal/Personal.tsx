import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import Header from '@/components/header/Header'
import { Location, NavigateFunction, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Footer from '@/components/footer/Footer'
import { Button, Menu, MenuProps } from 'antd'
import {
    ContainerOutlined,
    FormOutlined,
    KeyOutlined,
    ScheduleOutlined,
    SmileOutlined,
    StarOutlined,
    WalletOutlined,
    WhatsAppOutlined,
    WomanOutlined
} from '@ant-design/icons'
import AvatarEmpty from '@/assets/img/empty/avatar-empty.png'
import { User } from '@/interface/user'
import { useSelector } from 'react-redux'

const PersonalHooks: any = (): any => {
    const location: Location = useLocation()
    const navigate: NavigateFunction = useNavigate()
    const userinfo: User = useSelector((state: any) => state.userinfo)
    const [selectKey, setSelectKey] = useState<string>('')
    const menuItems: MenuProps['items'] = [
        {label: '账号安全', key: '', icon: <KeyOutlined />},
        {label: '我的订单', key: 'my_order', icon: <ContainerOutlined />},
        {label: '我的收藏', key: 'favorite', icon: <StarOutlined />},
        {label: '我的反馈', key: 'my_feedback', icon: <ContainerOutlined />},
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

    const transformGender = (value: number): string => {
        switch (value) {
            case 0:
                return '未填写'
            case 1:
                return '男'
            case 2:
                return '女'
            default:
                return '未填写'
        }
    }

    const handleSelect = (value: any) => {
        setSelectKey(value.key)
        navigate(value.key)
    }

    return {userinfo, menuItems, selectKey, transformGender, handleSelect}
}

const PersonalPage: React.FC = (): JSX.Element => {
    const {userinfo, menuItems, selectKey, transformGender, handleSelect} = PersonalHooks()

    // 个人简介
    const personalDocumentCard: JSX.Element = (
        <div className={style.personalDocumentCard}>
            <img src={!!userinfo.avatar ? userinfo.avatar : AvatarEmpty} alt='' />
            <div className={style.myInfo}>
                <div className={style.username}>
                    <span><SmileOutlined style={{marginRight: '5px'}} /></span>
                    <span>昵称: {userinfo.nickname}</span>
                    <span className={style.editButton}>
                        <Button icon={<FormOutlined />} type='primary' size='small'>修改资料</Button>
                    </span>
                </div>
                <div className={style.birthdayAndGender}>
                    <span><ScheduleOutlined style={{marginRight: '5px'}} /></span>
                    <span>生日: {userinfo.birthday ? userinfo.birthday : '未填写'}</span>
                </div>
                <div className={style.birthdayAndGender}>
                    <span><WomanOutlined style={{marginRight: '5px'}} /></span>
                    <span>性别: {transformGender(userinfo.gender)}</span>
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