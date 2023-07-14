import React, { useState } from 'react'
import style from './style.module.scss'
import { Banner } from '@/interface'
import PageBanner from '@/components/page-banner/PageBanner'

const DiscountHooks: any = (): any => {
    const [bannerList, setBannerList] = useState<Array<Banner>>([])

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