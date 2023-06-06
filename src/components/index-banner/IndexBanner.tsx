import React from 'react'
import style from './style.module.scss'
import { Banner } from '@/interface'
import { Carousel } from 'antd'

interface Props {
    bannerList: Array<Banner>
}

const IndexBannerHooks: any = (): any => {

}

const IndexBannerComponent: React.FC<Props> = ({bannerList}) => {
    const transformBanner = bannerList.map((item, index) => {
        return (
            <div key={index}>
                <img loading='lazy' src={item.img} alt={item.description}
                     style={{cursor: item.link == null ? 'default' : 'pointer'}} />
            </div>
        )
    })

    return <Carousel autoplay dots dotPosition='bottom' className={style.banner}>{transformBanner}</Carousel>
}

export default IndexBannerComponent