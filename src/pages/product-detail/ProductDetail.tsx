import React, { useEffect, useRef, useState } from 'react'
import style from './style.module.scss'
import { useParams } from 'react-router-dom'
import { getAttrListApi, getProductByProductIdApi, getSkuListApi } from '@/api/product-api'
import { Attr, AttrValue, Product, Sku, SkuSpecs } from '@/interface'
import { HeartOutlined, LeftOutlined, RightOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Button, InputNumber } from 'antd'

const ProductDetailHooks: any = (): any => {
    const params = useParams()
    const imgPageSize = useRef<number>(4)
    const [number, setNumber] = useState<number>(1)
    const [product, setProduct] = useState<Product>()
    const [currentSku, setCurrentSku] = useState<Sku>()
    const [currentSkuSpecs, setCurrentSkuSpecs] = useState<Array<SkuSpecs>>([])
    const [skuList, setSkuList] = useState<Array<Sku>>([])
    const [attrList, setAttrList] = useState<Array<Attr>>([])
    const [imgList, setImgList] = useState<Array<string>>([])
    const [attrValueMap, setAttrValueMap] = useState<Map<string, string>>(new Map())
    const [imgPage, setImgPage] = useState<number>(1)
    const [currentImg, setCurrentImg] = useState<string>('')

    useEffect(() => {
        // 获取商品信息
        getProductByProductIdApi(params.id).then((res) => {
            document.title = res.data.name
            setProduct(res.data)
            if (!!res.data.imgList) {
                setImgList(JSON.parse(res.data.imgList))
                setCurrentImg(JSON.parse(res.data.imgList)[0])
            }
        }).catch((err) => {
            console.log(err)
        })

        // 获取sku列表
        getSkuListApi(params.id).then((res) => {
            if (!!res.data) {
                setSkuList(res.data)
                setCurrentSku(res.data[0])
                setCurrentSkuSpecs(res.data[0].skuSpecs)
            }
        }).catch((err) => {
            console.log(err)
        })

        // 获取商品属性列表
        getAttrListApi(params.id).then((res) => {
            if (!!res.data) {
                setAttrList(res.data)
                res.data.forEach((item: Attr) => {
                    if (!attrValueMap.has(item.name)) {
                        attrValueMap.set(item.name, item.attrValueList[0].name)
                    }
                })
            }
        }).catch((err) => {
            console.log(err)
        })

        return () => {
            document.title = '优购商城'
        }
    }, [params.id])

    const isCurrentAttrValue = (attrName: string, attrValue: string) => {
        return attrValueMap.get(attrName) === attrValue
    }

    const selectAttrValue = (attrName: string, attrValue: string) => {
        let specs: Array<SkuSpecs> = []
        Object.assign(specs, currentSku?.skuSpecs)

        for (let index in specs) {
            if (specs[index].attrName === attrName) {
                specs[index] = {attrName: attrName, attrValueName: attrValue}
            }
        }

        for (let index in skuList) {
            if (JSON.stringify(skuList[index].skuSpecs) === JSON.stringify(specs)) {
                setCurrentSku(skuList[index])
            }
        }
        //设置选择的属性值
        setAttrValueMap((pre) => {
            return pre.set(attrName, attrValue)
        })
    }

    const imgPageChange = (value: number) => {
        if ((value - 1) >= 0 && ((value - 1) * imgPageSize.current) < imgList.length) {
            setImgPage(value)
            setCurrentImg(imgList[(value - 1) * imgPageSize.current])
        }
    }

    const startPage = (): number => {
        return (imgPage - 1) * imgPageSize.current
    }

    const endPage = (): number => {
        return imgPage * imgPageSize.current
    }

    return {
        number,
        product,
        currentSku,
        skuList,
        attrList,
        imgList,
        imgPage,
        imgPageSize,
        currentImg,
        isCurrentAttrValue,
        selectAttrValue,
        setCurrentImg,
        imgPageChange,
        startPage,
        endPage
    }
}

const ProductDetailPages: React.FC = () => {
    const {
        number,
        product,
        currentSku,
        skuList,
        attrList,
        imgList,
        imgPage,
        imgPageSize,
        currentImg,
        isCurrentAttrValue,
        selectAttrValue,
        setCurrentImg,
        imgPageChange,
        startPage,
        endPage
    } = ProductDetailHooks()

    const transformAttrValueList = (attrName: string, attrValueList: Array<AttrValue>) => attrValueList.map((item: AttrValue, index: number) => {
        // if (attrValueDisable(attrName, item.name)) {
        //     return (
        //         <div key={index} className={style.attrBoxDisable}>
        //             <span>{item.name}</span>
        //         </div>
        //     )
        // } else {
        //     return (
        //         <div key={index}
        //              onClick={() => selectAttrValue(attrName, item.name)}
        //              className={isCurrentAttrValue(attrName, item.name) ? style.attrBoxSelect : style.attrBox}>
        //             <span>{item.name}</span>
        //         </div>
        //     )
        // }
        return (
            <div key={index}
                 onClick={() => selectAttrValue(attrName, item.name)}
                 className={isCurrentAttrValue(attrName, item.name) ? style.attrBoxSelect : style.attrBox}>
                <span>{item.name}</span>
            </div>
        )
    })

    const transformAttrList = attrList.map((item: Attr, index: number) => {
        return (
            <div key={index} className={style.attrList}>
                <div className={style.text}><span>{item.name}</span></div>
                <div className={style.attrValueList}>{transformAttrValueList(item.name, item.attrValueList)}</div>
            </div>
        )
    })

    const transformImgList = imgList?.slice(startPage(), endPage()).map((item: string, index: number) => {
        return (
            <div key={index}
                 className={currentImg === item ? style.listImgSelect : style.listImg}>
                <img onMouseEnter={() => setCurrentImg(item)} src={item} alt='' />
            </div>
        )
    })

    // 商品图片
    const productImgList = (
        <div className={style.productImg}>
            <div>
                <img src={currentImg} alt='' />
            </div>
            <div className={style.productImgList}>
                <div style={{marginRight: '10px'}}>
                    <div onClick={() => imgPageChange(imgPage - 1)}
                         className={imgPage === 1 ? style.arrowDisable : style.arrow}>
                        <LeftOutlined />
                    </div>
                </div>
                <div className={style.list}>
                    {transformImgList}
                </div>
                <div style={{marginLeft: '10px'}}>
                    {(imgPage * imgPageSize.current >= imgList?.length || !imgList) ?
                        <div className={style.arrowDisable}><RightOutlined /></div> :
                        <div onClick={() => imgPageChange(imgPage + 1)} className={style.arrow}>
                            <RightOutlined /></div>}
                </div>
            </div>
        </div>
    )

    // 商品信息
    const productInfo = (
        <div className={style.productInfo}>
            <div className={style.productNameAndRate}>
                <div style={{width: '90%'}}>
                    <span>{product?.name}</span>
                </div>
                <div className={style.rate}>
                    <span>0%</span>
                </div>
            </div>
            <div className={style.productDescAndPrise}>
                <div style={{width: '90%'}}>
                    <span>{currentSku?.skuDesc}</span>
                </div>
                <div className={style.prise}>
                    <span>好评率</span>
                </div>
            </div>
            <div className={style.productPrice}>
                <div className={style.text}>
                    <span>价格</span>
                </div>
                {(() => {
                    if (!currentSku) {
                        return <div style={{color: '#f13a3a'}}>当前商品规格暂无价格</div>
                    } else {
                        return <div className={style.price}>{currentSku?.price.toFixed(2)}</div>
                    }
                })()}
            </div>
            <>
                {(() => {
                    if (!skuList || skuList.length === 0) {
                        return (
                            <div className={style.noSku}>
                                <div><span>此商品暂未填写规格, 请查看其他商品</span></div>
                            </div>
                        )
                    } else {
                        return (
                            <>
                                <div>{transformAttrList}</div>
                                <div className={style.number}>
                                    <div className={style.text}><span>数量</span></div>
                                    <div>
                                        <InputNumber value={number}
                                                     min={1}
                                                     max={currentSku?.skuStock >= 1 ? currentSku?.skuStock : 1}
                                                     className={style.numberInput} />
                                    </div>
                                    <div className={style.stockText}>
                                        <span>库存:</span>
                                        <span
                                            className={style.stockNumber}>{currentSku?.skuStock}件</span>
                                    </div>
                                </div>
                                <div className={style.buttonList}>
                                    <Button icon={<ShoppingCartOutlined />} disabled={currentSku?.skuStock === 0}
                                            type='primary'>加入购物车</Button>
                                    <Button icon={<HeartOutlined />}
                                            className={style.collectionButton}>{'收藏商品'}</Button>
                                </div>
                            </>
                        )

                    }
                })()}
            </>
        </div>
    )

    return (
        <div className={style.main}>
            <div className={style.detail}>
                <div className={style.flex}>
                    <div className={style.content}>
                        {productImgList}
                        {productInfo}
                    </div>
                </div>
                <div className={style.flex}>
                    <div className={style.detailDown}>
                        <div className={style.comment}>
                            <div className={style.commentTitle}>
                                <div className={style.commentBox}>
                                    <span>商品评价</span>
                                </div>
                            </div>
                            <div className={style.productRate}>
                                <div className={style.rateBox}>

                                </div>
                            </div>
                            <div className={style.commentItem}>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPages