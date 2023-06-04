import React, { useState } from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import { RightCircleOutlined, ThunderboltFilled } from '@ant-design/icons'
import { Product } from '@/interface'
import NoSecKill from '@/assets/img/common/no-sec-kill.png'
import NoProduct from '@/assets/img/common/no-product.png'
import TitleBlockRight from '@/assets/img/common/title-block-right.png'
import TitleBlockLeft from '@/assets/img/common/title-block-left.png'

const HomeHooks: any = (): any => {
    const navigate = useNavigate()
    const [secKillTime, setSecKillTime] = useState<number>(0)
    const [secKillTimeout, setSecKillTimeout] = useState<number>(0)
    const [hotProductList, setHotProductList] = useState<Array<Product>>([])
    const [recommendProductList, setRecommendProductList] = useState<Array<Product>>([])

    return {navigate, secKillTime, secKillTimeout, hotProductList, recommendProductList}
}

const HomePage: React.FC = () => {
    const {navigate, secKillTimeout, hotProductList, recommendProductList} = HomeHooks()

    // 秒杀活动
    const secKill = (
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
                <div className={style.notProduct}>
                    <img src={NoSecKill} alt='' />
                    <div><span>暂无秒杀活动</span></div>
                </div>
            </div>
        </div>
    )

    // 热门商品
    const hotProduct = (
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
                    {(() => {
                        if (!hotProductList || hotProductList.length <= 0) {
                            return (
                                <div className={style.notHotProduct}>
                                    <img src={NoProduct} alt='' />
                                    <div><span>暂无商品</span></div>
                                </div>
                            )
                        }
                        // return (
                        //     <div className={style.hotProductItems}>
                        //         {hotProductList.map((item: Product, index: number) => {
                        //             return <div key={index}><HotProductCard product={item} /></div>
                        //         })}
                        //     </div>
                        // )
                    })()}
                </div>
            </div>
        </div>
    )

    const hotProductAndCoupons = (
        <div className={style.hotProductAndCoupons}>
            {hotProduct}
        </div>
    )

    return (
        <>
            <div className={style.banner}>
                <div style={{width: '100%'}}>
                    {/*<PageBanner bannerList={bannerList} />*/}
                </div>
            </div>
            <div className={style.main}>
                <div className={style.body}>
                    <div>{secKill}</div>
                    <div>{hotProductAndCoupons}</div>
                    <div className={style.recommendTitle}>
                        <div style={{marginRight: '10px'}}><img src={TitleBlockLeft} alt='' /></div>
                        <div><span>为你推荐</span></div>
                        <div style={{marginLeft: '10px'}}><img src={TitleBlockRight} alt='' /></div>
                    </div>
                    {(() => {
                        if (!hotProductList || hotProductList.length <= 0) {
                            return (
                                <div className={style.noRecommendProduct}>
                                    <div className={style.notProduct}>
                                        <img src={NoProduct} alt='' />
                                        <div><span>暂无推荐商品</span></div>
                                    </div>
                                </div>
                            )
                        } else {
                            return (
                                <div className={style.recommend}>
                                    {recommendProductList.map((item: Product, index: number) => {
                                        return (
                                            <div key={index} className={style.recommendItem}>
                                                {/*<ProductCard product={item} />*/}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        }
                    })()}
                    {/*<div className={style.recommend}>*/}

                    {/*</div>*/}
                </div>
            </div>
        </>
    )
}

export default HomePage