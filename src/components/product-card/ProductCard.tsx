import React from 'react'
import style from './style.module.scss'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { Product } from '@/interface/product'
import { isEmpty } from '@/utils'
import DefaultImage from '@/assets/img/common/default-image.png'

interface Props {
    product: Product
}

const ProductCardComponent: React.FC<Props> = ({product}): JSX.Element => {
    const navigate: NavigateFunction = useNavigate()

    return (
        <div onClick={() => navigate(`/detail/${product.productId}`)} className={style.cardBody}>
            <div className={style.cover} onClick={() => console.log(product)}>
                <img src={!isEmpty(product) && !! product.cover ? product.cover : DefaultImage} alt='' />
            </div>
            <div className={style.productName}>
                <span>{product.name}</span>
            </div>
            <div>
                {(() => {
                   if (!product.price) {
                       return <span className={style.productPrice}>此商品暂无规格</span>
                   } else if (product.isDiscount) {
                       return (
                           <div>
                               <span className={style.productPrice}>{product.discountPrice.toFixed(2)}</span>
                               <span className={style.costPrice}>{product.price.toFixed(2)}</span>
                           </div>
                       )
                   } else {
                       return <span className={style.productPrice}>{product.price.toFixed(2)}</span>
                   }
                })()}
            </div>
        </div>
    )
}

export default ProductCardComponent