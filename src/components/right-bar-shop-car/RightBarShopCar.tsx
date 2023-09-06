import React from 'react'
import style from './style.module.scss'
import { Button, message, Modal } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import ShopCarItemEmpty from '@/assets/img/empty/shop-car-item-empty.png'
import ShopCarItems from '@/components/shop-car-items/ShopCarItems'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import event from '@/event'
import { setShopCar } from '@/store/slice'
import { Dispatch } from '@reduxjs/toolkit'
import { ShopCarItem } from 'src/interface/extension'

const RightShopCarHooks: any = (): any => {
    const navigate: NavigateFunction = useNavigate()
    const dispatch: Dispatch = useDispatch()
    const shopCar: Array<ShopCarItem> = useSelector((state: any) => state.shopCar)
    const [modal, modalContextHolder] = Modal.useModal()
    const [messageApi, messageContextHolder] = message.useMessage()

    // 计算购物车总价
    const shopCarAmount = (): number => {
        let amount: number = 0
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
            onOk: () => {
                messageApi.success('购物车已清空').then()
                Cookies.remove('shop_car')
                dispatch(setShopCar([]))
            }
        })
    }

    return {navigate, shopCar, modalContextHolder, messageContextHolder, shopCarAmount, clearShopCar}
}

const RightBarShopCarComponent: React.FC = (): JSX.Element => {
    const {
        navigate,
        shopCar,
        modalContextHolder,
        messageContextHolder,
        shopCarAmount,
        clearShopCar
    } = RightShopCarHooks()

    // 解析购物车
    const transformShopCar = shopCar.map((item: ShopCarItem, index: number): JSX.Element => {
        return (<div key={index}>
                <ShopCarItems shopCarItem={item} />
            </div>
        )
    })

    return (
        <div className={style.main}>
            <div className={style.shopCarTitle}><span>购物车</span></div>
            <div style={{height: '75%'}}>
                {!shopCar || shopCar.length === 0 ? (
                    <div className={style.shopCarIsEmpty}>
                        <img src={ShopCarItemEmpty} alt='' />
                        <div><span>购物车为空</span></div>
                    </div>
                ) : (
                    <div className={style.shopCarItemList}>{transformShopCar}</div>
                )}
            </div>
            <div className={style.shopCarBottom}>
                <div>
                    {shopCarAmount() !== 0 && (
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
                    )}
                </div>
            </div>
            {/*对话框*/}
            {modalContextHolder}
            {/*全局消息提醒*/}
            {messageContextHolder}
        </div>
    )
}

export default RightBarShopCarComponent