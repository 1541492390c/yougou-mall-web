import React from 'react'
import style from './style.module.scss'
import { Product } from '@/interface/product'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { FireFilled } from '@ant-design/icons'
import { isEmpty } from '@/utils'
import DefaultImage from '@/assets/img/common/default-image.png'

interface Props {
    product: Product
}

const HotProductCardHooks: any = (): any => {
    const navigate: NavigateFunction = useNavigate()

    return {navigate}
}

const HotProductCardComponent: React.FC<Props> = ({product}): JSX.Element => {
    const {navigate} = HotProductCardHooks()

    return (
        <div onClick={() => navigate(`/detail/${product.productId}`)} className={style.cardBody}>
            <div className={style.cover}>
                <img src={!isEmpty(product) && !! product.cover ? product.cover : DefaultImage} alt='' />
            </div>
            <div className={style.productName}>
                <span><FireFilled className={style.hotIcon} /></span>
                <span>{product.name}</span>
            </div>
            <div>
                {!product.price ? <span className={style.productPrice}>此商品暂无规格</span> : <span className={style.productPrice}>{product.price.toFixed(2)}</span>}
            </div>
        </div>
    )
}

export default HotProductCardComponent