import React, { useState } from 'react'
import ServiceZhengpin from '@/assets/img/index/service-zhengpin.png'
import ServiceShandian from '@/assets/img/index/service-shandian.png'
import ServiceShouhou from '@/assets/img/index/service-shouhou.png'
import style from './style.module.scss'
import logo from '@/assets/img/yougou.png'
import { Button, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const IndexHeaderHooks: any = (): any => {
    const [keyword, setKeyword] = useState<string>('')
    const serviceList = [
        {img: ServiceZhengpin, ch: '正品保障', en: 'Genuine'},
        {img: ServiceShandian, ch: '闪电送货', en: 'Speedy'},
        {img: ServiceShouhou, ch: '安心售后', en: 'AfterSale '}
    ]

    const search = (): void => {
        console.log(keyword)
    }

    return {keyword, setKeyword, serviceList, search}
}

const IndexHeaderComponent: React.FC = (): JSX.Element => {
    const {keyword, setKeyword, serviceList, search} = IndexHeaderHooks()

    const transformServiceList: JSX.Element = (
        <div className={style.service}>
            {serviceList.map((item: any, index: number) => {
                return (
                    <div key={index} className={style.serviceCard}>
                        <div>
                            <img src={item.img} alt='' />
                        </div>
                        <div className={style.serviceCardTitle}>
                            <div><span>{item.ch}</span></div>
                            <div><span className={style.serviceEnglish}>{item.en}</span></div>
                        </div>
                    </div>
                )
            })}
        </div>
    )

    return (
        <div className={style.main}>
            <div className={style.logoAndSearch}>
                <div className={style.logo}><img src={logo} alt='' /></div>
                <div className={style.search}>
                    <div className={style.searchBar}>
                        <Input  value={keyword}
                                onChange={(event: any) => setKeyword(event.target.value)}
                                onPressEnter={search}
                                placeholder='请输入关键字' />
                        <Button icon={<SearchOutlined />} type='primary' onClick={search}>搜索</Button>
                    </div>
                </div>
                <>{transformServiceList}</>
            </div>
        </div>
    )
}

export default IndexHeaderComponent