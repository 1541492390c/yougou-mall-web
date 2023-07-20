import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import PageBanner from '@/components/page-banner/PageBanner'
import { getBannerListApi } from '@/api/platform/platform-api'
import { BannerTypeEnum } from '@/enums'
import { Banner } from '@/interface/platform'

const DiscountHooks: any = (): any => {
    const [bannerList, setBannerList] = useState<Array<Banner>>([])

    useEffect(() => {
        // 获取轮播图列表
        getBannerListApi(BannerTypeEnum.PC, 'discount').then((res) => {
            setBannerList(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    return {bannerList}
}

const DiscountPage: React.FC = (): JSX.Element => {
    const {bannerList} = DiscountHooks()

    return (
        <div>
            <div className={style.banner}>
                <div className={style.smallBanner}>
                    <PageBanner bannerList={bannerList} />
                </div>
            </div>
        </div>
    )
}

export default DiscountPage