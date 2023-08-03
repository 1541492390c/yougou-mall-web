import React, { useRef } from 'react'
import style from './style.module.scss'
import { CouponUser } from '@/interface/payment'
import { Button } from 'antd'

interface Props {
    couponUser: CouponUser
}

const CouponUserCardHooks: any = (couponUser: CouponUser): any => {
    const currentTime = useRef<number>(new Date().getTime())

    const isExpired = () => {
        return currentTime.current >= new Date(couponUser.expiredTime).getTime()
    }

    return {isExpired}
}

const CouponUserCardComponent: React.FC<Props> = ({couponUser}): JSX.Element => {
    const {isExpired} = CouponUserCardHooks(couponUser)

    return (
        <div className={style.couponUser}>
            <div className={isExpired() ? style.isExpiredCouponUserLeft : style.couponUserLeft}>
                <div className={isExpired() ? style.isExpiredUsedAmount : style.usedAmount}>
                    <span className={style.yuanIcon}>￥</span>
                    <span>{couponUser.coupon.discountAmount}</span>
                </div>
                <div>{isExpired() ? <span>已过期</span> : <Button type='primary' shape='round'>去使用</Button>}</div>
            </div>
            <div className={isExpired() ? style.isExpiredCouponUserRight : style.couponUserRight}>
                <div className={style.desc}>{couponUser.coupon.description}</div>
                <div className={style.usedTime}>可用日期: {couponUser.receiveTime.toString()} - {couponUser.expiredTime.toString()}</div>
            </div>
        </div>
    )
}

export default CouponUserCardComponent