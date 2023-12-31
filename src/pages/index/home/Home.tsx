import React, { useEffect, useRef, useState } from 'react'
import style from './style.module.scss'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { RightCircleOutlined, ThunderboltFilled } from '@ant-design/icons'
import SecKillEmpty from '@/assets/img/empty/sec-kill-empty.png'
import ProductEmpty from '@/assets/img/empty/product-empty.png'
import CouponsEmpty from '@/assets/img/empty/coupons-empty.png'
import TitleCircle from '@/assets/img/common/title-circle.png'
import IndexBanner from '@/components/page-banner/PageBanner'
import { getBannerListApi } from '@/api/platform/platform-api'
import { BannerTypeEnum } from '@/enums'
import { getProductPagesApi, getRecommendedProductListApi } from '@/api/product/product-api'
import ProductCard from '@/components/product-card/ProductCard'
import { Product } from '@/interface/product'
import { Coupon } from '@/interface/payment'
import { Banner } from '@/interface/platform'
import { getCouponPagesApi } from '@/api/payment/coupon-api'
import CouponCard from '@/components/coupon-card/CouponCard'
import HotProductCard from '@/components/hot-product-card/HotProductCard'

const HomeHooks: any = (): any => {
    const navigate: NavigateFunction = useNavigate()
    const [secKillTime] = useState<number>(0)
    const [secKillTimeout] = useState<number>(0)
    const [hotProductList, setHotProductList] = useState<Array<Product>>([])
    const [recommendProductList, setRecommendProductList] = useState<Array<Product>>([])
    const [couponList, setCouponList] = useState<Array<Coupon>>([])
    const [bannerList, setBannerList] = useState<Array<Banner>>([])
    const couponPageNum = useRef<number>(1)
    const hotProductPageNum = useRef<number>(1)
    const couponPageSize = useRef<number>(3)
    const hotProductPageSize = useRef<number>(10)

    useEffect(() => {
        // 获取轮播图列表
        getBannerListApi(BannerTypeEnum.PC, 'home').then((res) => {
            setBannerList(res.data)
        }).catch((err) => {
            console.log(err)
        })

        // 获取优惠券分页信息(首页展示3张优惠券)
        getCouponPagesApi(couponPageNum.current, couponPageSize.current).then((res) => {
            setCouponList(res.data.list)
        }).catch((err) => {
            console.log(err)
        })

        // 获取推荐商品
        getRecommendedProductListApi().then((res) => {
            setRecommendProductList(res.data)
        }).catch((err) => {
            console.log(err)
        })

        // 获取热门商品
        getProductPagesApi(hotProductPageNum.current, hotProductPageSize.current, false, false, undefined).then((res) => {
            setHotProductList(res.data.list)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    return {navigate, secKillTime, secKillTimeout, hotProductList, recommendProductList, couponList, bannerList}
}

const HomePage: React.FC = (): JSX.Element => {
    const {navigate, secKillTimeout, hotProductList, recommendProductList, couponList, bannerList} = HomeHooks()

    // 解析热门商品列表
    const transformHotProductList = hotProductList.map((item: Product, index: number): JSX.Element => {
        return (
            <div key={index}>
                <HotProductCard product={item} />
            </div>
        )
    })

    // 解析优惠券列表
    const transformCouponList = couponList.map((item: Coupon, index: number): JSX.Element => {
        return (
            <div key={index} className={style.couponItem}>
                <CouponCard coupon={item} />
            </div>
        )
    })

    // 解析推荐商品列表
    const transformRecommendedProductList = recommendProductList.map((item: Product, index: number): JSX.Element => {
        return (
            <div key={index} className={style.recommendItem}>
                <ProductCard product={item} />
            </div>
        )
    })

    // 秒杀活动
    const secKill: JSX.Element = (
        <div className={style.card}>
            <div className={style.cardTitle}>
                <div className={style.secKillTitleText}>
                    <span><ThunderboltFilled /></span>
                    <span>限时秒杀</span>
                    <span className={style.secKillCountdown}>
                        <div className={style.secKillCountdownBox}>
                            {parseInt(String(secKillTimeout / 60 / 60)) >= 10 ? parseInt(String(secKillTimeout / 60 / 60)) : '0' + parseInt(String(secKillTimeout / 60 / 60))}
                        </div>
                        <span style={{marginLeft: '5px', marginRight: '5px'}}>:</span>
                        <div className={style.secKillCountdownBox}>
                            {parseInt(String(secKillTimeout / 60 % 60)) >= 10 ? parseInt(String(secKillTimeout / 60 % 60)) : '0' + parseInt(String(secKillTimeout / 60 % 60))}
                        </div>
                        <span style={{marginLeft: '5px', marginRight: '5px'}}>:</span>
                        <div className={style.secKillCountdownBox}>
                            {parseInt(String(secKillTimeout % 60)) >= 10 ? parseInt(String(secKillTimeout % 60)) : '0' + parseInt(String(secKillTimeout % 60))}
                        </div>
                    </span>
                </div>
                <div className={style.cardTitleIcon}>
                    <div onClick={() => navigate('sec_kills')} className={style.cardTitleIconPoint}>
                        <span>更多秒杀</span>
                        <span><RightCircleOutlined /></span>
                    </div>
                </div>
            </div>
            <div>
                <div className={style.productIsEmpty}>
                    <img src={SecKillEmpty} alt='' />
                    <div><span>暂无秒杀活动</span></div>
                </div>
            </div>
        </div>
    )

    // 热门商品
    const hotProduct: JSX.Element = (
        <div className={style.hotProduct}>
            <div className={style.card}>
                <div className={style.cardTitle}>
                    <div className={style.cardTitleText}>
                        <span>爆款单品</span>
                    </div>
                    <div className={style.cardTitleIcon}>
                        <div onClick={() => navigate('list')} className={style.cardTitleIconPoint}>
                            <span>更多</span>
                            <span><RightCircleOutlined /></span>
                        </div>
                    </div>
                </div>
                <div>
                    {hotProductList.length === 0 ? (
                        <div className={style.notHotProduct}>
                            <img src={ProductEmpty} alt='' />
                            <div><span>暂无商品</span></div>
                        </div>
                    ) : (
                        <div className={style.hotProductItems}>{transformHotProductList}</div>
                    )}
                </div>
            </div>
        </div>
    )

    // 优惠券
    const coupons: JSX.Element = (
        <div className={style.coupon}>
            <div className={style.card}>
                <div className={style.cardTitle}>
                    <div onClick={() => navigate('coupons')} className={style.couponCardTitle}>
                        <span>领券中心</span>
                        <span><RightCircleOutlined style={{marginLeft: '5px', color: '#f13a3a'}} /></span>
                    </div>
                </div>
                <div>
                    {couponList.length === 0 ? (
                        <div className={style.couponsIsEmpty}>
                            <div>
                                <img src={CouponsEmpty} alt='' />
                                <div><span>暂无优惠券</span></div>
                            </div>
                        </div>
                    ) : (
                        <div className={style.couponsList}>{transformCouponList}</div>
                    )}
                </div>
            </div>
        </div>
    )

    // 热门商品与优惠券
    const hotProductAndCoupons: JSX.Element = (
        <div className={style.hotProductAndCoupons}>
            {hotProduct}
            {coupons}
        </div>
    )

    return (
        <>
            <div className={style.banner}>
                <div style={{width: '100%'}}>
                    <IndexBanner bannerList={bannerList} />
                </div>
            </div>
            <div className={style.main}>
                <div className={style.body}>
                    <div>{secKill}</div>
                    <div>{hotProductAndCoupons}</div>
                    <div className={style.recommendTitle}>
                        <div style={{marginRight: '10px'}}><img src={TitleCircle} alt='' /></div>
                        <div><span>为你推荐</span></div>
                        <div style={{marginLeft: '10px'}}><img src={TitleCircle} alt='' /></div>
                    </div>
                    {recommendProductList.length === 0 ? (
                        <div className={style.recommendProductIsEmpty}>
                            <div className={style.productIsEmpty}>
                                <img src={ProductEmpty} alt='' />
                                <div><span>暂无推荐商品</span></div>
                            </div>
                        </div>
                    ) : (
                        <div className={style.recommend}>{transformRecommendedProductList}</div>
                    )}
                </div>
            </div>
        </>
    )
}

export default HomePage