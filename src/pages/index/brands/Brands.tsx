import React, { useEffect, useRef, useState } from 'react'
import style from './style.module.scss'
import { getBannerListApi } from '@/api/platform/platform-api'
import { BannerTypeEnum } from '@/enums'
import PageBanner from '@/components/page-banner/PageBanner'
import { Banner } from '@/interface/platform'
import TitleCircle from '@/assets/img/common/title-circle.png'
import BrandsEmpty from '@/assets/img/empty/brand-empty.png'
import { getBrandPagesApi } from '@/api/product/brand-api'
import { Brand } from '@/interface/product'
import BrandDetailCard from '@/components/brand-detail-card/BrandDetailCard'
import { Pagination } from 'antd'

const BrandsHooks: any = (): any => {
    const [bannerList, setBannerList] = useState<Array<Banner>>([])
    const [brandList, setBrandList] = useState<Array<Brand>>([])
    const [brandTotal, setBrandTotal] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const currentSize = useRef<number>(10)

    useEffect(() => {
        // 获取轮播图列表
        getBannerListApi(BannerTypeEnum.PC, 'brands').then((res) => {
            setBannerList(res.data)
        }).catch((err) => {
            console.log(err)
        })

        // 获取品牌分页信息
        getBrandPagesApi(currentPage, currentSize.current).then((res) => {
            setBrandList(res.data.list)
            setBrandTotal(res.data.total)
        })
    }, [currentPage])

    return {bannerList, brandList, brandTotal, currentPage, currentSize, setCurrentPage}
}

const BrandsPage: React.FC = (): JSX.Element => {
    const {bannerList, brandList, brandTotal, currentPage, currentSize, setCurrentPage} = BrandsHooks()

    // 解析品牌列表
    const transformBradList: JSX.Element = brandList.map((item: Brand, index: number): JSX.Element => {
        return (
            <div key={index} className={style.brandItem}>
                <BrandDetailCard brand={item} />
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
                    <div className={style.brandTitle}>
                        <div style={{marginRight: '10px'}}><img src={TitleCircle} alt='' /></div>
                        <div><span>品牌中心</span></div>
                        <div style={{marginLeft: '10px'}}><img src={TitleCircle} alt='' /></div>
                    </div>
                    {brandList.length === 0 ? (
                        <div className={style.brandsListIsEmpty}>
                            <div className={style.brandsIsEmpty}>
                                <img src={BrandsEmpty} alt='' />
                                <div><span>暂无品牌</span></div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={style.brands}>
                                {transformBradList}
                            </div>
                            <div className={style.pagination}>
                                <Pagination total={brandTotal} current={currentPage} pageSize={currentSize.current}
                                            onChange={(value: number) => setCurrentPage(value)} showSizeChanger={false} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BrandsPage