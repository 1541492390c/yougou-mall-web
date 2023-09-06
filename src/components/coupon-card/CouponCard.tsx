import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Coupon, CouponUser } from '@/interface/payment'
import { useDispatch, useSelector } from 'react-redux'
import { message, Progress, Tag } from 'antd'
import { receiveCouponApi } from '@/api/payment/coupon-api'
import { Dispatch } from '@reduxjs/toolkit'
import { setCouponUserList } from '@/store/slice'

interface Props {
    coupon: Coupon
}

const CouponCardHooks: any = (coupon: Coupon): any => {
    const dispatch: Dispatch = useDispatch()
    const couponUserList: Array<CouponUser> = useSelector((state: any) => state.couponUserList)
    const [isReceive, setIsReceive] = useState<boolean>(false)
    const [messageApi, messageContextHolder] = message.useMessage()

    useEffect(() => {
        // 是否已经领取该优惠券
        for (let index in couponUserList) {
            if (couponUserList[index].couponId === coupon.couponId) {
                setIsReceive(true)
            }
        }
    }, [couponUserList])

    // 该优惠券是否已经领取完
    const isEmpty = (): boolean => {
        return coupon.quota === coupon.takeCount
    }

    // 百分比
    const percent = () => {
        return Math.ceil(coupon.takeCount / coupon.quota * 100)
    }

    // 领取优惠券
    const receive = (): void => {
        receiveCouponApi(coupon.couponId).then((res) => {
            if (res) {
                console.log(res.data)
                messageApi.success('领取成功').then()
                let couponUserListTemp: Array<CouponUser> = [...couponUserList]
                couponUserListTemp.push(res.data)
                dispatch(setCouponUserList(couponUserListTemp))
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    return {messageContextHolder, isReceive, isEmpty, percent, receive}
}

const CouponCardComponent: React.FC<Props> = ({coupon}): JSX.Element => {
    const {messageContextHolder, isReceive, isEmpty, percent, receive} = CouponCardHooks(coupon)

    // 优惠券左边部分
    const couponLeft: JSX.Element = (
        <div onClick={receive} className={isEmpty() ? style.isEmptyCouponLeft : style.couponLeft}>
            {(() => {
                if (isEmpty()) {
                    return <span className={style.receiveText}><span>已抢光</span></span>
                } else if (!isEmpty() && isReceive) {
                    return <span className={style.receiveText}><span>已领取</span></span>
                } else {
                    return <span className={style.receiveText}><span>立即领取</span></span>
                }
            })()}
        </div>
    )

    // 优惠券右边部分
    const couponRight: JSX.Element = (
        <div className={style.couponRight}>
            <div className={style.amountAndDescription}>
                <div style={{width: '25%'}}>
                    <span className={style.yuanIcon}>￥</span>
                    <span className={style.withAmount}>{coupon.discountAmount}</span>
                </div>
                <div className={style.flex}>
                    <div><Tag
                        className={isEmpty() ? style.isEmptyUsedAmount : style.usedAmount}>满{coupon.usedAmount}元可用</Tag>
                    </div>
                    <div className={style.desc}><span>{coupon.description}</span></div>
                </div>
            </div>
            <div style={{width: '80%'}}>
                <Progress status='active'
                          percent={percent()} strokeColor={percent() === 100 ? 'gray' : '#f13a3a'}
                          format={percent => percent === 100 ? '已抢光' : `已抢${percent}%`}
                          rootClassName={style.percent} />
            </div>
        </div>
    )

    return (
        <div className={isEmpty() ? style.isEmpty : style.coupon}>
            {/*优惠券左边部分*/}
            {couponLeft}
            {/*优惠券右边部分*/}
            {couponRight}
            {/*全局消息提醒*/}
            {messageContextHolder}
        </div>
    )
}

export default CouponCardComponent