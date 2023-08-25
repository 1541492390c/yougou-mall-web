import React from 'react'
import style from './style.module.scss'
import { Brand } from '@/interface/product'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { isEmpty } from '@/utils'
import DefaultImage from '@/assets/img/common/default-image.png'

interface Props {
    brand: Brand
}

const BrandDetailCardHooks: any = (): any => {
    const navigate: NavigateFunction = useNavigate()

    return {navigate}
}

const BrandDetailCardComponent: React.FC<Props> = ({brand}): JSX.Element => {
    const {navigate} = BrandDetailCardHooks()

    return (
        <div onClick={() => navigate('/list', {state: {brandId: brand.brandId, node: brand.categoryNode}})} className={style.main}>
            <div className={style.brandImg}>
                <img src={!isEmpty(brand) && !!brand.img ? brand.img : DefaultImage} alt='' />
            </div>
            <div className={style.brandDetail}>
                <div className={style.brandName}><span>{brand.name}</span></div>
                <div><span>{brand.description}</span></div>
            </div>
        </div>
    )
}

export default BrandDetailCardComponent