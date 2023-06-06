import React from 'react'
import style from './style.module.scss'
import { Product } from '@/interface'
import { useNavigate } from 'react-router-dom'

interface Props {
    product: Product
}

const ProductCardComponent: React.FC<Props> = ({product}) => {
    const navigate = useNavigate()

    return (
        <div onClick={() => navigate(`/detail/${product.productId}`)} className={style.cardBody}>
            <div className={style.cover} onClick={() => console.log(product)}>
                <img src={product.cover} alt='' />
            </div>
            <div className={style.productName}>
                <span>{product.name}</span>
            </div>
            <div>
                {!product.price ? <span className={style.productPrice}>此商品暂无规格</span> : <span className={style.productPrice}>{product.price.toFixed(2)}</span>}
            </div>
        </div>
    )
}

export default ProductCardComponent