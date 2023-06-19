import React from 'react'
import style from './style.module.scss'
import { ShopCarItem } from '@/interface'
import { NavLink } from 'react-router-dom'
import { InputNumber } from 'antd'
import event from '@/event'

interface Props {
    shopCarItem: ShopCarItem
}

const ShopCarItemsHooks: any = (): any => {

    const transformSpecs = (shopCarItem: ShopCarItem): string => {
        let arr: Array<any> = JSON.parse(shopCarItem.specs)
        let specsStr: string = ''
        for (let index in arr) {
            let object: Object = arr[index]
            specsStr += Object.keys(object)[0] + ':' + Object.values(object)[0] + ','
        }
        return specsStr.substring(0, specsStr.lastIndexOf(','))
    }

    const closeShopCarTooltip = () => {
        event.emit('closeShopCarTooltip')
    }

    return {transformSpecs, closeShopCarTooltip}
}

const ShopCarItemsComponent: React.FC<Props> = ({shopCarItem}) => {
    const {transformSpecs, closeShopCarTooltip} = ShopCarItemsHooks()

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
                    <div className={style.specs}><span>{transformSpecs(shopCarItem)}</span></div>
                    <div className={style.price}><span>￥{shopCarItem.totalAmount.toFixed(2)}</span></div>
                </div>
            </div>
            <div>
                <InputNumber value={shopCarItem.quantity} min={1} />
            </div>
            <div className={style.delete}><span>删除</span></div>
        </div>
    )
}

export default ShopCarItemsComponent