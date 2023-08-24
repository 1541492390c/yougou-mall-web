import React, { useState } from 'react'
import style from './style.module.scss'
import { Brand } from '@/interface/product'

interface Props {
    brand: Brand
}

const BrandCardHooks: any = (): any => {
    const [showImg, setShowImg] = useState<boolean>(true)

    const handleShow = (value: boolean) => {
        setShowImg(value)
    }

    return {showImg, handleShow}
}

const BrandCardComponent: React.FC<Props> = ({brand}): JSX.Element => {
    const {showImg, handleShow} = BrandCardHooks()
    
    return (
        <div onMouseOver={() => handleShow(false)}
             onMouseOut={() => handleShow(true)}
             className={style.cardBody}>
            {showImg && <div><img src={brand.img} alt='' /></div>}
            {!showImg && <div className={style.brandName}><span>{brand.name}</span></div>}
        </div>
    )
}

export default BrandCardComponent