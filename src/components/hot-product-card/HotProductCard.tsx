import React from 'react'
import style from './style.module.scss'
import { Product } from '@/interface/product'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { FireFilled } from '@ant-design/icons'

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
                <img src={product.cover} alt='' />
            </div>
            <div className={style.productName}>
                <span><FireFilled className={style.hotIcon} /></span>
                <span>{product.name}</span>
            </div>
            <div>
                {(() => {
                    if (!product.price) {
                        return <span className={style.productPrice}>此商品暂无规格</span>
                    } else {
                        return <span className={style.productPrice}>{product.price.toFixed(2)}</span>
                    }
                })()}
            </div>
        </div>
    )
}

export default HotProductCardComponent