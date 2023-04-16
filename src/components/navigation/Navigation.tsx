import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Menu, MenuProps } from 'antd'
import { UnorderedListOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'

const NavigationHooks: any = (): any => {
    const location = useLocation()
    const navigate = useNavigate()
    const [selectKey, setSelectKey] = useState<string>('/')
    const menuItems: MenuProps['items'] = [
        { label: '首页', key: '/' },
        { label: '限时特惠', key: '/discount' },
        { label: '秒杀专场', key: '/sec_kills' },
        { label: '品牌专场', key: '/brands' },
        { label: '领券中心', key: '/coupons' }
    ]

    useEffect(() => {
        setSelectKey(location.pathname)
    }, [location])

    const handleSelect = (value: any) => {
        setSelectKey(value.key)
        navigate(value.key)
    }

    return {selectKey, menuItems, handleSelect}
}

const NavigationComponent: React.FC = () => {
    const {selectKey, menuItems, handleSelect} = NavigationHooks()

    return (
        <div className={style.main}>
            <div className={style.menu}>
                <div className={style.categoryHeader}>
                    <div className={style.categoryTitle}>
                        <span>分类</span>
                    </div>
                    <div className={style.categoryIcon}><UnorderedListOutlined /></div>
                </div>
                <Menu mode='horizontal' theme='dark' selectedKeys={[selectKey]} items={menuItems} onSelect={handleSelect} />
            </div>
        </div>
    )
}

export default NavigationComponent