import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { getBannerListApi } from '@/api/platform/platform-api'
import { BannerTypeEnum } from '@/enums'
import PageBanner from '@/components/page-banner/PageBanner'
import TitleCircle from '@/assets/img/common/title-circle.png'
import CouponsEmpty from '@/assets/img/empty/coupons-empty.png'
import { getCouponPagesApi } from '@/api/payment/coupon-api'
import { Coupon } from '@/interface/payment'
import { isEmpty } from '@/utils'
import CouponCard from '@/components/coupon-card/CouponCard'
import { Pagination } from 'antd'
import { Banner } from '@/interface/platform'

const CouponsHooks: any = (): any => {
    const [bannerList, setBannerList] = useState<Array<Banner>>([])
    const [couponList, setCouponList] = useState<Array<Coupon>>([])
    const [couponTotal, setCouponTotal] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)

    useEffect(() => {
        // 获取轮播图列表
        getBannerListApi(BannerTypeEnum.PC, 'coupons').then((res) => {
            setBannerList(res.data)
        }).catch((err) => {
            console.log(err)
        })

        // 获取优惠券列表
        getCouponPagesApi(currentPage, 20).then((res) => {
            setCouponList(res.data.list)
            setCouponTotal(res.data.total)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    return {bannerList, couponTotal, couponList, setCurrentPage}
}

const CouponsPage: React.FC = (): JSX.Element => {
    const {bannerList, couponTotal, couponList, setCurrentPage} = CouponsHooks()

    return (
        <div className={style.main}>
            <div className={style.banner}>
                <div className={style.smallBanner}>
                    <PageBanner bannerList={bannerList} />
                </div>
            </div>
            <div className={style.flex}>
                <div className={style.body}>
                    <div className={style.couponsTitle}>
                        <div style={{marginRight: '10px'}}><img src={TitleCircle} alt='' /></div>
                        <div><span>领券中心</span></div>
                        <div style={{marginLeft: '10px'}}><img src={TitleCircle} alt='' /></div>
                    </div>
                    {(() => {
                        if (isEmpty(couponList) || couponList.length === 0) {
                            return (
                                <div className={style.couponsListIsEmpty}>
                                    <div className={style.couponsIsEmpty}>
                                        <img src={CouponsEmpty} alt='' />
                                        <div><span>暂无优惠券</span></div>
                                    </div>
                                </div>
                            )
                        } else {
                            return (
                                <>
                                    <div className={style.coupons}>
                                        {couponList.map((item: Coupon, index: number) => {
                                            return (
                                                <div key={index} className={style.couponItem}>
                                                    <CouponCard coupon={item} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className={style.pagination}>
                                        {couponTotal !== 0 &&
                                            <Pagination pageSize={20} total={couponTotal}
                                                        onChange={(value: number) => setCurrentPage(value)}
                                                        showSizeChanger={false} />}
                                    </div>
                                </>
                            )
                        }
                    })()}
                </div>
            </div>
        </div>
    )
}

export default CouponsPage