import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { getBannerListApi } from '@/api/platform/platform-api'
import { BannerTypeEnum } from '@/enums'
import PageBanner from '@/components/page-banner/PageBanner'
import { Banner } from '@/interface/platform'
import TitleCircle from '@/assets/img/common/title-circle.png'
import BrandsEmpty from '@/assets/img/empty/brand-empty.png'

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
            <div className={style.flex}>
                <div className={style.body}>
                    <div className={style.brandTitle}>
                        <div style={{marginRight: '10px'}}><img src={TitleCircle} alt='' /></div>
                        <div><span>品牌中心</span></div>
                        <div style={{marginLeft: '10px'}}><img src={TitleCircle} alt='' /></div>
                    </div>
                    <div className={style.brandsListIsEmpty}>
                        <div className={style.brandsIsEmpty}>
                            <img src={BrandsEmpty} alt='' />
                            <div><span>暂无品牌</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BrandsPage