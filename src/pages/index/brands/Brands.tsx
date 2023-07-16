import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { getBannerListApi } from '@/api/platform/platform-api'
import { BannerTypeEnum } from '@/enums'
import PageBanner from '@/components/page-banner/PageBanner'
import { Banner } from '@/interface/other'

const BrandsHooks: any = (): any => {
    const [bannerList, setBannerList] = useState<Array<Banner>>([])

    useEffect(() => {
        // 获取轮播图列表
        getBannerListApi(BannerTypeEnum.PC, 'brands').then((res) => {
            setBannerList(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    return {bannerList}
}

const BrandsPage: React.FC = (): JSX.Element => {
    const {bannerList} = BrandsHooks()

    return (
        <div className={style.main}>
            <div className={style.banner}>
                <div className={style.smallBanner}>
                    <PageBanner bannerList={bannerList} />
                </div>
            </div>
        </div>
    )
}

export default BrandsPage