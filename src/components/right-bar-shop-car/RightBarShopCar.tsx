import React from 'react'
import style from './style.module.scss'
import { Button, Modal } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ShopCarItemEmpty from '@/assets/img/empty/shop-car-item-empty.png'
import { ShopCarItem } from '@/interface'
import ShopCarItems from '@/components/shop-car-items/ShopCarItems'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import event from '@/event'
import { setShopCar } from '@/store'

const RightShopCarHooks: any = (): any => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [modal, contextHolder] = Modal.useModal()
    const shopCar: Array<ShopCarItem>  = useSelector((state: any) => state.shopCar)

    // 计算购物车总价
    const shopCarAmount = (): number => {
        let amount = 0
        shopCar.forEach((item: ShopCarItem) => {
            amount += item.totalAmount
        })
        return amount
    }

    // 清空购物车
    const clearShopCar = (): void => {
        event.emit('closeShopCarTooltip')
        modal.confirm({
            title: '清空购物车',
            content: '此操作将清空购物车,是否继续?',
            okType: 'danger',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                Cookies.remove('shop_car')
                dispatch(setShopCar([]))
                //setShopCarAmount(0)
            }
        })
    }

    return {navigate, shopCar, contextHolder, shopCarAmount, clearShopCar}
}

const RightBarShopCarComponent: React.FC = (): JSX.Element => {
    const {navigate, shopCar, contextHolder, shopCarAmount, clearShopCar} = RightShopCarHooks()

    return (
        <div className={style.main}>
            <div className={style.shopCarTitle}><span>购物车</span></div>
            <div style={{height: '75%'}}>
                {(() => {
                    if (!shopCar || shopCar.length === 0) {
                        return (
                            <div className={style.shopCarIsEmpty}>
                                <img src={ShopCarItemEmpty} alt='' />
                                <div><span>购物车为空</span></div>
                            </div>
                        )
                    } else {
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
                    }
                })()}
            </div>
            <div className={style.shopCarBottom}>
                <div>
                    {(() => {
                        if (shopCarAmount() !== 0) {
                            return (
                                <div>
                                    <div className={style.amountText}>
                                        <span>总计:</span>
                                        <span className={style.amount}>{shopCarAmount().toFixed(2)}</span>
                                    </div>
                                    <div>
                                <span onClick={clearShopCar} className={style.clear}>
                                    <span><DeleteOutlined /></span>
                                    <span>清空购物车</span>
                                </span>
                                        <span>
                                    <Button onClick={() => navigate('settlement')} type='primary' style={{width: '85px'}}>结算</Button>
                                </span>
                                    </div>
                                </div>
                            )
                        }
                    })()}
                </div>
            </div>

            {contextHolder}
        </div>
    )
}

export default RightBarShopCarComponent