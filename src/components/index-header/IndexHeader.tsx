import React, { useEffect, useRef, useState } from 'react'
import ServiceZhengpin from '@/assets/img/index/service-zhengpin.png'
import ServiceShandian from '@/assets/img/index/service-shandian.png'
import ServiceShouhou from '@/assets/img/index/service-shouhou.png'
import style from './style.module.scss'
import logo from '@/assets/img/yougou.png'
import { Button, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Location, NavigateFunction, useLocation, useNavigate } from 'react-router-dom'

const IndexHeaderHooks: any = (): any => {
    const navigate: NavigateFunction = useNavigate()
    const location: Location = useLocation()
    const [keyword, setKeyword] = useState<string>('')
    const serviceList = useRef<any>([
        {img: ServiceZhengpin, ch: '正品保障', en: 'Genuine'},
        {img: ServiceShandian, ch: '闪电送货', en: 'Speedy'},
        {img: ServiceShouhou, ch: '安心售后', en: 'AfterSale '}
    ])

    useEffect(() => {
        if (location.pathname != '/list') {
            setKeyword('')
        }
    }, [location])

    const search = (): void => {
        navigate('/list', {state: {keyword: keyword}})
    }

    return {keyword, setKeyword, serviceList, search}
}

const IndexHeaderComponent: React.FC = (): JSX.Element => {
    const {keyword, setKeyword, serviceList, search} = IndexHeaderHooks()

    // 解析服务列表
    const transformServiceList: JSX.Element = (
        <div className={style.service}>
            {serviceList.current.map((item: any, index: number) => {
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
                {/*服务列表*/}
                {transformServiceList}
            </div>
        </div>
    )
}

export default IndexHeaderComponent