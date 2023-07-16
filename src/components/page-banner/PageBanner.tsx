import React from 'react'
import style from './style.module.scss'
import { Carousel } from 'antd'
import { isEmpty } from '@/utils'
import BannerEmpty from '@/assets/img/empty/banner-empty.png'
import { Banner } from '@/interface/other'

interface Props {
    bannerList: Array<Banner>
}

const PageBannerComponent: React.FC<Props> = ({bannerList}): JSX.Element => {
    const transformBanner: Array<JSX.Element> = bannerList.map((item, index) => {
        return (
            <div key={index}>
                <img src={item.img} alt={item.description}
                     style={{cursor: isEmpty(item.link) ? 'default' : 'pointer'}} />
            </div>
        )
    })

    return (
        <Carousel autoplay dots dotPosition='bottom' className={style.banner}>
            {bannerList.length === 0 ? <img src={BannerEmpty} alt='' /> : transformBanner}
        </Carousel>
    )
}

export default PageBannerComponent