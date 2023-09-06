import React, { useEffect, useRef, useState } from 'react'
import style from './style.module.scss'
import PageBanner from '@/components/page-banner/PageBanner'
import { getBannerListApi } from '@/api/platform/platform-api'
import { BannerTypeEnum } from '@/enums'
import { Banner } from '@/interface/platform'
import TitleCircle from '@/assets/img/common/title-circle.png'
import { Product } from '@/interface/product'
import { getProductPagesApi } from '@/api/product/product-api'
import ProductEmpty from '@/assets/img/empty/product-empty.png'
import { Pagination } from 'antd'
import ProductCard from '@/components/product-card/ProductCard'

const DiscountHooks: any = (): any => {
    const [bannerList, setBannerList] = useState<Array<Banner>>([])
    const [discountProductList, setDiscountProductList] = useState<Array<Product>>([])
    const [discountProductTotal, setDiscountProductTotal] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const currentSize = useRef<number>(20)

    useEffect(() => {
        // 获取轮播图列表
        getBannerListApi(BannerTypeEnum.PC, 'discount').then((res) => {
            setBannerList(res.data)
        }).catch((err) => {
            console.log(err)
        })

        // 获取折扣商品列表
        getProductPagesApi(currentPage, currentSize.current, true, false, undefined).then((res) => {
            setDiscountProductList(res.data.list)
            setDiscountProductTotal(res.data.total)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    return {bannerList, discountProductList, discountProductTotal, currentPage, currentSize, setCurrentPage}
}

const DiscountPage: React.FC = (): JSX.Element => {
    const {
        bannerList,
        discountProductList,
        discountProductTotal,
        currentPage,
        currentSize,
        setCurrentPage
    } = DiscountHooks()

    // 解析折扣商品列表
    const transformDiscountProductList = discountProductList.map((item: Product, index: number): JSX.Element => {
        return (
            <div key={index} className={style.discountItem}>
                <ProductCard product={item} />
            </div>
        )
    })

    return (
        <div className={style.main}>
            <div className={style.banner}>
                <div className={style.smallBanner}>
                    <PageBanner bannerList={bannerList} />
                </div>
            </div>
            <div className={style.flex}>
                <div className={style.body}>
                    <div className={style.discountTitle}>
                        <div style={{marginRight: '10px'}}><img src={TitleCircle} alt='' /></div>
                        <div><span>限时特惠</span></div>
                        <div style={{marginLeft: '10px'}}><img src={TitleCircle} alt='' /></div>
                    </div>
                    {discountProductList.length === 0 ? (
                        <div className={style.productListIsEmpty}>
                            <div className={style.productIsEmpty}>
                                <img src={ProductEmpty} alt='' />
                                <div><span>暂无商品</span></div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={style.discount}>{transformDiscountProductList}</div>
                            <div className={style.pagination}>
                                {discountProductTotal !== 0 &&
                                    <Pagination total={discountProductTotal} current={currentPage} pageSize={currentSize.current}
                                                onChange={(value: number) => setCurrentPage(value)} showSizeChanger={false} />}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DiscountPage