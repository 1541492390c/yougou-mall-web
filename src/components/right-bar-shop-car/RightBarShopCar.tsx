import React, { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import noShopCarItem from '@/assets/img/right-bar/no-shop-car-item.png'
import style from './style.module.scss'

const RightShopCarHooks: any = (): any => {
    const navigate = useNavigate()
    const shopCarItemList = useState<Array<any>>([])
    const [shopCarAmount, setShopCarAmount] = useState<number>(0)

    return {navigate, shopCarItemList, shopCarAmount}
}

const RightBarShopCarComponent: React.FC = () => {
    const {navigate, shopCarItemList, shopCarAmount} = RightShopCarHooks()

    return (
        <div className={style.main}>
            <div className={style.shopCarTitle}><span>购物车</span></div>
            <div style={{height: '75%'}}>
                {(() => {
                    // if (shopCarItemList.length === 0) {
                    //     return (
                    //         <div className={style.shopCarIsEmpty}>
                    //             <img src={noShopCarItem} alt='' />
                    //             <div><span>购物车为空</span></div>
                    //         </div>
                    //     )
                    // }
                    // return (
                    //     <div className={style.shopCarItemList}>
                    //         {shopCarItemList.map((item: ShopCarItem, index: number) => {
                    //             return (
                    //                 <div key={index}>
                    //                     <ShopCarItems shopCarItem={item} />
                    //                 </div>
                    //             )
                    //         })}
                    //     </div>
                    // )
                    return (
                        <div className={style.shopCarIsEmpty}>
                            <img src={noShopCarItem} alt='' />
                            <div><span>购物车为空</span></div>
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