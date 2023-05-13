import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Dropdown, Menu, MenuProps } from 'antd'
import { RightOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { getCategoryListApi } from '@/api/product'
import { Category } from '@/interface/product'

const NavigationHooks: any = (): any => {
    const location = useLocation()
    const navigate = useNavigate()
    const [categoryMenuOpen, setCategoryMenuOpen] = useState<boolean>(false)
    const [selectKey, setSelectKey] = useState<string>('/')
    const [selectCategoryId, setSelectCategoryId] = useState<number>()
    const [categoryList, setCategoryList] = useState<Array<Category>>([])
    const [currentChildren, setCurrentChildren] = useState<Array<Category>>([])
    const menuItems: MenuProps['items'] = [
        {label: '首页', key: '/'},
        {label: '限时特惠', key: '/discount'},
        {label: '秒杀专场', key: '/sec_kills'},
        {label: '品牌专场', key: '/brands'},
        {label: '领券中心', key: '/coupons'}
    ]

    useEffect(() => {
        setSelectKey(location.pathname)
    }, [location])

    useEffect(() => {
        getCategoryListApi().then((res) => {
            setCategoryList((pre) => {
                pre = res.data.data
                setCurrentChildren(res.data.data[0].children)
                return pre
            })
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    const handleSelect = (value: any): void => {
        setSelectKey(value.key)
        navigate(value.key)
    }

    const handleCategoryMenuOpen = (): void => {
        setCategoryMenuOpen((pre) => !pre)
        setCurrentChildren(() => !categoryList[0].children ? [] : categoryList[0].children)
        setSelectCategoryId(categoryList[0].categoryId)
    }

    return {
        selectKey,
        categoryList,
        menuItems,
        categoryMenuOpen,
        currentChildren,
        selectCategoryId,
        setSelectCategoryId,
        setCurrentChildren,
        handleSelect,
        handleCategoryMenuOpen
    }
}

const NavigationComponent: React.FC = () => {
    const {
        selectKey,
        categoryList,
        menuItems,
        categoryMenuOpen,
        currentChildren,
        setCurrentChildren,
        handleSelect,
        handleCategoryMenuOpen
    } = NavigationHooks()

    const subCategoryMenu = currentChildren.map((item: Category, index: number) => {
        return (
            <div key={index} className={style.currentCategories}>
                <div className={style.parentCategory}>
                    <div><span>{item.name}</span></div>
                    <div><RightOutlined style={{height: '100%'}} /></div>
                </div>
                <div className={style.childrenCategory}>
                    {item.children?.map((item, index) => {
                        return <NavLink key={index} to='home'
                                        state={{parentId: item.parentId, categoryId: item.categoryId}}
                                        onClick={handleCategoryMenuOpen}>{item.name}</NavLink>
                    })}
                </div>
            </div>
        )
    })

    const categoryMenu = (
        <div onMouseLeave={handleCategoryMenuOpen} className={style.category}>
            <div className={style.categoryMenu}>
                <ul>
                    {categoryList.map((item: Category, index: number) => {
                        return (
                            <li key={index}
                                onMouseEnter={() => setCurrentChildren(item.children)}
                                className={currentChildren.parentId === item.categoryId ? style.categoryMenuItemSelect : style.categoryMenuItem}
                            >
                                <div className={style.categoryMenuItemTitle}>{item.name}</div>
                            </li>
                        )
                    })}
                </ul>
            </div>
            {currentChildren.length === 0 ? <></> : <div className={style.subMenu}>{subCategoryMenu}</div>}
        </div>
    )

    return (
        <div className={style.main}>
            <div className={style.menu}>
                <Dropdown dropdownRender={() => categoryMenu} open={categoryMenuOpen}>
                    <div onMouseEnter={handleCategoryMenuOpen}
                         className={style.categoryHeader}>
                        <div className={style.categoryTitle}>
                            <span>分类</span>
                        </div>
                        <div className={style.categoryIcon}><UnorderedListOutlined /></div>
                    </div>
                </Dropdown>
                <Menu mode='horizontal' theme='dark' selectedKeys={[selectKey]} items={menuItems}
                      onSelect={handleSelect} />
            </div>
        </div>
    )
}

export default NavigationComponent