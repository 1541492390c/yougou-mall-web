import React from 'react'
import style from './style.module.scss'
import { NavLink } from 'react-router-dom'
import { InputNumber } from 'antd'
import event from '@/event'
import { useDispatch, useSelector } from 'react-redux'
import { setShopCar } from '@/store/slice'
import Cookies from 'js-cookie'
import { Dispatch } from '@reduxjs/toolkit'
import { ShopCarItem } from 'src/interface/extension'

interface Props {
    shopCarItem: ShopCarItem
}

const ShopCarItemsHooks: any = (): any => {
    const dispatch: Dispatch = useDispatch()
    const shopCar: Array<ShopCarItem> = useSelector((state: any) => state.shopCar)

    // 解析规格
    const transformSpecs = (specs: string): string => {
        let arr: Array<any> = JSON.parse(specs)
        let specsStr: string = ''
        for (let index in arr) {
            let object: Object = arr[index]
            specsStr += Object.values(object)[0] + ' ,'
        }
        return specsStr.substring(0, specsStr.lastIndexOf(','))
    }

    // 更新购物车项数量
    const updateShopCarItem = (skuId: number, value: number): void => {
        let shopCarTemp: Array<ShopCarItem> = new Array<ShopCarItem>()
        Object.assign(shopCarTemp, shopCar)
        shopCarTemp.forEach((item: ShopCarItem, index: number) => {
            if (item.skuId === skuId) {
                let shopCarItem: ShopCarItem = Object.assign({}, item)
                shopCarItem.quantity = value
                shopCarItem.totalAmount = shopCarItem.quantity * shopCarItem.price
                shopCarTemp[index] = shopCarItem
            }
        })
        Cookies.set('shop_car', JSON.stringify(shopCarTemp), {expires: 24 * 60 * 60})
        dispatch(setShopCar(shopCarTemp))
    }

    // 删除购物车项
    const deleteShopCarItem = (skuId: number): void => {
        let shopCarTemp: Array<ShopCarItem> = new Array<ShopCarItem>()
        Object.assign(shopCarTemp, shopCar)
        shopCarTemp.forEach((item: ShopCarItem, index: number) => {
            if (item.skuId === skuId) {
                shopCarTemp.splice(index, 1)
            }
        })
        Cookies.set('shop_car', JSON.stringify(shopCarTemp), {expires: 24 * 60 * 60})
        dispatch(setShopCar(shopCarTemp))
    }

    const closeShopCarTooltip = (): void => {
        event.emit('closeShopCarTooltip')
    }

    return {transformSpecs, updateShopCarItem, deleteShopCarItem, closeShopCarTooltip}
}

const ShopCarItemsComponent: React.FC<Props> = ({shopCarItem}): JSX.Element => {
    const {transformSpecs, updateShopCarItem, deleteShopCarItem, closeShopCarTooltip} = ShopCarItemsHooks()

    return (
        <div className={style.shopCarItem}>
            <div>
                <img src={shopCarItem.img} alt='' className={style.shopCarItemImg} />
            </div>
            <div>
                <div className={style.shopCarItemName}>
                    <NavLink to={`/detail/${shopCarItem.productId}`} onClick={closeShopCarTooltip}>{shopCarItem.productName}</NavLink>
                </div>
                <div className={style.specsAndPrice}>
                    <div className={style.specs}><span>{transformSpecs(shopCarItem.specs)}</span></div>
                    <div className={style.price}><span>￥{shopCarItem.totalAmount.toFixed(2)}</span></div>
                </div>
            </div>
            <div>
                <InputNumber value={shopCarItem.quantity} min={1} max={shopCarItem.maxStock} onStep={(value: number) => updateShopCarItem(shopCarItem.skuId, value)} />
            </div>
            <div onClick={() => deleteShopCarItem(shopCarItem.skuId)} className={style.delete}><span>删除</span></div>
        </div>
    )
}

export default ShopCarItemsComponent