import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { getBannerListApi } from '@/api/platform/platform-api'
import { BannerTypeEnum } from '@/enums'
import PageBanner from '@/components/page-banner/PageBanner'
import { Banner } from '@/interface/platform'
import TitleCircle from '@/assets/img/common/title-circle.png'
import SecKillEmpty from '@/assets/img/empty/sec-kill-empty.png'
import { getSecKillListApi } from '@/api/product/sec-kill-api'
import { SecKill } from '@/interface/product'
import { isEmpty } from '@/utils'

const SecKillsHooks: any = (): any => {
    const [bannerList, setBannerList] = useState<Array<Banner>>([])
    const [secKillList, setSecKillList] = useState<Array<SecKill>>([])
    const [currentSecKill, setCurrentSecKill] = useState<SecKill>()

    useEffect(() => {
        // 获取轮播图列表
        getBannerListApi(BannerTypeEnum.PC, 'sec_kills').then((res) => {
            setBannerList(res.data)
        }).catch((err) => {
            console.log(err)
        })

        // 获取秒杀场次列表
        getSecKillListApi().then((res) => {
            if (!isEmpty(res.data) && res.data.length !== 0) {
                setSecKillList(res.data)
                setCurrentSecKill(res.data[0])
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    return {bannerList, secKillList, currentSecKill, setCurrentSecKill}
}

const SecKillPage: React.FC = (): JSX.Element => {
    const {bannerList, secKillList, currentSecKill, setCurrentSecKill} = SecKillsHooks()

    // 解析秒杀活动列表
    const transformSecKillList = secKillList.map((item: SecKill, index: number): JSX.Element => {
        return (
            <div key={index} onClick={() => setCurrentSecKill(item)}
                 className={currentSecKill?.secKillId === item.secKillId ? style.secKillBox : style.secKillBoxUnSelect}>
                <span>{item.startTime} - {item.endTime}</span>
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
                    <div className={style.secKillTitle}>
                        <div style={{marginRight: '10px'}}><img src={TitleCircle} alt='' /></div>
                        <div><span>秒杀专场</span></div>
                        <div style={{marginLeft: '10px'}}><img src={TitleCircle} alt='' /></div>
                    </div>
                    <div className={style.secKillCard}>
                        <div className={style.secKillCardTitle}>
                            {transformSecKillList}
                        </div>
                        <div className={style.secKillEmpty}>
                            <img src={SecKillEmpty} alt='' />
                            <div><span>暂无秒杀活动</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SecKillPage