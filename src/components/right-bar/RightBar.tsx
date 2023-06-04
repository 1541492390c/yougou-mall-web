import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import style from './style.module.scss'
import { Popover, Tooltip } from 'antd'
import { FormOutlined, HomeOutlined, ShoppingCartOutlined, UpOutlined, UserOutlined } from '@ant-design/icons'
import RightBarPersonal from '@/components/right-bar-personal/RightBarPersonal'
import RightBarShopCar from '@/components/right-bar-shop-car/RightBarShopCar'

interface Props {
    pathname: string
}

const RightBarHooks: any = (): any => {
    const navigate = useNavigate()
    const [personalClick, setPersonalClick] = useState<boolean>(false)
    const [personalHover, setPersonalHover] = useState<boolean>(false)
    const [shopCarClick, setShopCarClick] = useState<boolean>(false)
    const [shopCarHover, setShopCarHover] = useState<boolean>(false)

    const handleClickChange = (type: number) => (visible: boolean): void => {
        if (type === 1) {
            setPersonalClick(visible)
            setPersonalHover(false)
        }
        if (type === 2) {
            setShopCarClick(visible)
            setShopCarHover(false)
        }
    }

    const handleHoverChange = (type: number) => (visible: boolean): void => {
        if (type === 1) {
            setPersonalHover(visible)
            setPersonalClick(false)
        }
        if (type === 2) {
            setShopCarHover(visible)
            setShopCarClick(false)
        }
    }

    const backTop = (): void => {
        let scrollHeight = window.scrollY
        let timer = setInterval(() => {
            if (scrollHeight > 0) {
                scrollHeight -= 80
                window.scrollTo(0, scrollHeight)
                return
            }
            clearTimeout(timer)
        }, 10)
    }

    const backHome = (): void => {
        navigate('/')
    }

    return {
        navigate,
        personalClick,
        personalHover,
        shopCarClick,
        shopCarHover,
        handleClickChange,
        handleHoverChange,
        backTop,
        backHome
    }
}

const RightBarComponent: React.FC<Props> = ({pathname}) => {
    const {
        navigate,
        personalClick,
        personalHover,
        shopCarClick,
        shopCarHover,
        handleClickChange,
        handleHoverChange,
        backTop,
        backHome
    } = RightBarHooks()

    const personalTooltip = (
        <div style={{height: '30%'}}>
            <div className={style.iconContent}>
                <Tooltip open={personalHover}
                         onOpenChange={handleHoverChange(1)}
                         placement='left' title='个人中心' trigger='hover'>
                    <Popover open={personalClick}
                             onOpenChange={handleClickChange(1)}
                             placement='left' content={<RightBarPersonal />} trigger='click'>
                        <UserOutlined className={style.icon} />
                    </Popover>
                </Tooltip>
            </div>
        </div>
    )

    const shopCarTooltip = (
        <div style={{height: '25%'}} className={style.shopCar}>
            <Tooltip open={shopCarHover}
                     onOpenChange={handleHoverChange(2)}
                     placement='left' title='购物车' trigger='hover'>
                <Popover open={shopCarClick}
                         onOpenChange={handleClickChange(2)}
                         placement='left' content={<RightBarShopCar />} trigger='click'>
                    <div>
                        <ShoppingCartOutlined className={style.icon} />
                        <div className={style.shopCarText}>购物车</div>
                        {/*<div className={style.shopCarCount}>{number}</div>*/}
                        <div className={style.shopCarCount}>0</div>
                    </div>
                </Popover>
            </Tooltip>
        </div>
    )

    const rightBarBottom = (
        <div style={{height: '45%'}}>
            <div className={style.iconContent}>
                <div className={style.bottomIcon}>
                    {pathname !== '/' &&
                        <Tooltip placement='left' title='返回首页'>
                            <HomeOutlined onClick={backHome} className={style.icon} />
                        </Tooltip>}
                    <Tooltip placement='left' title='意见反馈'>
                        <FormOutlined onClick={() => navigate('/feedback')} className={style.icon} />
                    </Tooltip>
                    <Tooltip placement='left' title='返回顶部'>
                        <UpOutlined onClick={backTop} className={style.icon} />
                    </Tooltip>
                </div>
            </div>
        </div>
    )

    return (
        <div className={style.main}>
            {personalTooltip}
            {shopCarTooltip}
            {rightBarBottom}
        </div>
    )
}

export default RightBarComponent