import React from 'react'
import style from './style.module.scss'
import { RightCircleOutlined } from '@ant-design/icons'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { isEmpty } from '@/utils'
import CouponsEmpty from '@/assets/img/empty/coupons-empty.png'
import { useSelector } from 'react-redux'
import CouponUserCard from '@/components/coupon-user-card/CouponUserCard'
import { CouponUser } from '@/interface/payment'

const MyCouponHooks: any = (): any => {
    const navigate: NavigateFunction = useNavigate()
    const couponUserList = useSelector((state: any) => state.couponUserList)

    return {navigate, couponUserList}
}

const MyCouponPage: React.FC = (): JSX.Element => {
    const {navigate, couponUserList} = MyCouponHooks()

    // 解析用户优惠券列表
    const transformCouponUserList = couponUserList.map((item: CouponUser, index: number) => {
        return (
            <div key={index} className={style.couponUserItem}>
                <CouponUserCard couponUser={item} />
            </div>
        )
    })

    return (
        <div className={style.main}>
            <div className={style.card}>
                <div className={style.cardTitle}>
                    <span className={style.cardTitleText}>前往领券</span>
                    <span onClick={() => navigate('/coupons')} className={style.rightIcon}><RightCircleOutlined /></span>
                </div>
                {(() => {
                   if (isEmpty(couponUserList) || couponUserList.length === 0) {
                       return (
                           <div className={style.couponsIsEmpty}>
                               <img src={CouponsEmpty} alt='' />
                               <div><span>暂无优惠券</span></div>
                           </div>
                       )
                   } else {
                       return (
                           <div className={style.couponsCardList}>
                               {transformCouponUserList}
                           </div>
                       )
                   }
                })()}
            </div>
        </div>
    )
}

export default MyCouponPage