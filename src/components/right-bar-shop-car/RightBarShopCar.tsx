import React, { useEffect, useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ShopCarItemEmpty from '@/assets/img/empty/shop-car-item-empty.png'
import style from './style.module.scss'
import { ShopCarItem } from '@/interface'
import Cookies from 'js-cookie'
import ShopCarItems from '@/components/shop-car-items/ShopCarItems'
import event from '@/event'

const RightShopCarHooks: any = (): any => {
    const navigate = useNavigate()
    const [shopCar, setShopCar] = useState<Array<ShopCarItem>>([])
    const [shopCarAmount, setShopCarAmount] = useState<number>(1)

    useEffect(() => {
        let shopCarStr: string | undefined = Cookies.get('shop_car')
        if (!!shopCarStr) {
            let shopCar: Array<ShopCarItem> = JSON.parse(shopCarStr)
            setShopCar(shopCar)
        }
    }, [])

    event.on('shopCarUpdate', () => {
        let shopCarStr: string | undefined = Cookies.get('shop_car')
        if (!!shopCarStr) {
            setShopCar(JSON.parse(shopCarStr))
        }
    })

    return {navigate, shopCar, shopCarAmount}
}

const RightBarShopCarComponent: React.FC = () => {
    const {navigate, shopCar, shopCarAmount} = RightShopCarHooks()

    return (
        <div className={style.main}>
            <div className={style.shopCarTitle}><span>购物车</span></div>
            <div style={{height: '75%'}}>
                {(() => {
                    if (shopCar.length === 0) {
                        return (
                            <div className={style.shopCarIsEmpty}>
                                <img src={ShopCarItemEmpty} alt='' />
                                <div><span>购物车为空</span></div>
                            </div>
                        )
                    }
                    return (
                        <div className={style.shopCarItemList}>
                            {shopCar.map((item: ShopCarItem, index: number) => {
                                return (
                                    <div key={index}>
                                        <ShopCarItems shopCarItem={item} />
                                    </div>
                                )
                            })}
                        </div>
                    )
                })()}
            </div>
            <div className={style.shopCarBottom}>
                <div>
                    {shopCarAmount !== 0 &&
                        <div>
                            <div className={style.amountText}>
                                <span>总计:</span>
                                <span className={style.amount}>{shopCarAmount.toFixed(2)}</span>
                            </div>
                            <div>
                                <span className={style.clear}>
                                    <span><DeleteOutlined /></span>
                                    <span>清空购物车</span>
                                </span>
                                <span>
                                    <Button onClick={() => navigate('settlement')} type='primary' style={{width: '85px'}}>结算</Button>
                                </span>
                            </div>
                        </div>}
                </div>
            </div>
        </div>
    )
}

export default RightBarShopCarComponent