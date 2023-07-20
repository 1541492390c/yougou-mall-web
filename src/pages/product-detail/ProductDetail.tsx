import React, { useEffect, useRef, useState } from 'react'
import style from './style.module.scss'
import CommentEmpty from '@/assets/img/empty/comment-empty.png'
import Cookies from 'js-cookie'
import { NavigateFunction, Params, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAttrListApi, getProductByProductIdApi, getSkuListApi } from '@/api/product/product-api'
import { isFavoriteApi, saveFavoriteApi } from '@/api/product/favorite-api'
import { LeftOutlined, RightOutlined, ShoppingCartOutlined, StarOutlined } from '@ant-design/icons'
import { Button, InputNumber, message, Rate } from 'antd'
import { isEmpty } from '@/utils'
import { setShopCar } from '@/store/slice'
import { getCommentRateStatistics } from '@/api/user/user-api'
import { Dispatch } from '@reduxjs/toolkit'
import { AttrValue, Attr, Product, Sku, SkuSpecs } from '@/interface/product'
import { ShopCarItem } from '@/interface/other'
import { RateStatistics } from '@/interface/user'

const ProductDetailHooks: any = (): any => {
    const params: Readonly<Params> = useParams()
    const navigate: NavigateFunction = useNavigate()
    const dispatch: Dispatch = useDispatch()
    const isLogin: boolean = useSelector((state: any) => state.isLogin)
    const imgPageSize = useRef<number>(4)
    const rateStars = useRef<Array<number>>([5, 4, 3, 2, 1])
    const [messageApi, messageContextHolder] = message.useMessage()
    const [quantity, setQuantity] = useState<number>(1)
    const [product, setProduct] = useState<Product>()
    const [currentSku, setCurrentSku] = useState<Sku>()
    const [rateStatistics, setRateStatistics] = useState<RateStatistics>()
    const [skuList, setSkuList] = useState<Array<Sku>>([])
    const [attrList, setAttrList] = useState<Array<Attr>>([])
    const [imgList, setImgList] = useState<Array<string>>([])
    const [attrValueMap, setAttrValueMap] = useState<Map<string, string>>(new Map())
    const [imgPage, setImgPage] = useState<number>(1)
    const [currentImg, setCurrentImg] = useState<string>('')
    const [isFavorite, setIsFavorite] = useState<boolean>(false)

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

        // 如果已登录,则判断用户是否已收藏该商品
        if (isLogin) {
            isFavoriteApi(params.id).then((res) => {
                if (res) {
                    setIsFavorite(res.data)
                }
            }).catch((err) => {
                console.log(err)
            })
        }

        // 获取评价统计信息
        getCommentRateStatistics(params.id).then((res) => {
            console.log(res.data)
            setRateStatistics(res.data)
        }).catch((err) => {
            console.log(err)
        })

        return () => {
            document.title = '优购商城'
        }
    }, [params.id])

    // 判断是否当前选中属性值
    const isCurrentAttrValue = (attrName: string, attrValue: string): boolean => {
        return attrValueMap.get(attrName) === attrValue
    }

    // 选择属性值
    const selectAttrValue = (attrName: string, attrValue: string): void => {
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

    // 将当前SKU的规格转为购物车的格式
    const currentSkuSpecsStringify = (): string => {
        let specs: Array<Object> = new Array<Object>()
        // 拼接规格
        if (!!currentSku?.skuSpecs) {
            for (let index in currentSku?.skuSpecs) {
                let object = Object.create({})
                object[currentSku.skuSpecs[index].attrName] = currentSku.skuSpecs[index].attrValueName
                specs.push(object)
            }
        }
        return JSON.stringify(specs)
    }

    // 添加购物车
    const addShopCar = (): void => {
        let specs: string = currentSkuSpecsStringify()
        //获取购物车cookie
        let shopCarStr: string | undefined = Cookies.get('shop_car')
        let shopCar: Array<ShopCarItem> = new Array<ShopCarItem>()
        if (!!currentSku) {
            // 没有购物车cookie则创建一个,有效期24小时
            if (!shopCarStr) {
                let shopCarItem: ShopCarItem = {
                    productId: product?.productId,
                    skuId: currentSku?.skuId,
                    quantity: quantity,
                    totalAmount: quantity * currentSku?.price,
                    price: currentSku?.price,
                    productName: product?.name,
                    specs: specs,
                    img: product?.cover
                }
                shopCar.push(shopCarItem)
            } else {
                shopCar = JSON.parse(shopCarStr)
                let skuIdList: Array<number> = shopCar.map((item: ShopCarItem) => {
                    return item.skuId
                })
                // 如果已将该规格商品加入购物车,则在此基础上修改
                if (skuIdList.includes(currentSku.skuId)) {
                    shopCar.forEach((item: ShopCarItem) => {
                        if (item.skuId === currentSku.skuId) {
                            item.quantity = item.quantity + quantity
                            item.totalAmount = item.totalAmount + quantity * currentSku.price
                        }
                    })
                } else {
                    let shopCarItem: ShopCarItem = {
                        productId: product?.productId,
                        skuId: currentSku?.skuId,
                        quantity: quantity,
                        totalAmount: quantity * currentSku?.price,
                        price: currentSku?.price,
                        productName: product?.name,
                        specs: specs,
                        img: product?.cover
                    }
                    shopCar.push(shopCarItem)
                }
            }
            Cookies.set('shop_car', JSON.stringify(shopCar), {expires: 24 * 60 * 60})
            dispatch(setShopCar(shopCar))
            messageApi.success('添加购物车成功').then()
        }
    }

    // 收藏当前商品
    const saveFavorite = (): void => {
        if (!isLogin) {
            navigate('/login')
        } else {
            saveFavoriteApi(product?.productId).then((res) => {
                if (res) {
                    messageApi.success('收藏成功').then()
                    setIsFavorite(true)
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    const imgPageChange = (value: number): void => {
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
        rateStars,
        quantity,
        product,
        currentSku,
        rateStatistics,
        skuList,
        attrList,
        imgList,
        imgPage,
        imgPageSize,
        currentImg,
        isFavorite,
        messageContextHolder,
        setQuantity,
        setCurrentImg,
        isCurrentAttrValue,
        selectAttrValue,
        addShopCar,
        saveFavorite,
        imgPageChange,
        startPage,
        endPage
    }
}

const ProductDetailPages: React.FC = (): JSX.Element => {
    const {
        rateStars,
        quantity,
        product,
        currentSku,
        rateStatistics,
        skuList,
        attrList,
        imgList,
        imgPage,
        imgPageSize,
        currentImg,
        isFavorite,
        messageContextHolder,
        setQuantity,
        setCurrentImg,
        isCurrentAttrValue,
        selectAttrValue,
        addShopCar,
        saveFavorite,
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
                    {(() => {
                        if (imgPage * imgPageSize.current >= imgList?.length || !imgList) {
                            return <div className={style.arrowDisable}><RightOutlined /></div>
                        } else {
                            return <div onClick={() => imgPageChange(imgPage + 1)} className={style.arrow}>
                                <RightOutlined /></div>
                        }
                    })()}
                    {/*{(imgPage * imgPageSize.current >= imgList?.length || !imgList) ?*/}
                    {/*    <div className={style.arrowDisable}><RightOutlined /></div> :*/}
                    {/*    <div onClick={() => imgPageChange(imgPage + 1)} className={style.arrow}>*/}
                    {/*        <RightOutlined /></div>}*/}
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
                    <span>{currentSku?.description}</span>
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
                    } else if (currentSku?.isDiscount) {
                        return (
                            <div className={style.price}>
                                <div>{currentSku?.discountPrice.toFixed(2)}</div>
                                <div className={style.costPrice}>{currentSku?.price.toFixed(2)}</div>
                            </div>
                        )
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
                                        <InputNumber value={quantity}
                                                     min={1}
                                                     max={currentSku?.skuStock >= 1 ? currentSku?.skuStock : 1}
                                                     onStep={(value: number) => setQuantity(value)}
                                                     className={style.numberInput} />
                                    </div>
                                    <div className={style.stockText}>
                                        <span>库存:</span>
                                        <span
                                            className={style.stockNumber}>{currentSku?.skuStock}件</span>
                                    </div>
                                </div>
                                <div className={style.buttonList}>
                                    <Button icon={<ShoppingCartOutlined />}
                                            disabled={isEmpty(currentSku) || currentSku?.skuStock === 0}
                                            onClick={addShopCar}
                                            type='primary'>加入购物车</Button>
                                    <Button icon={<StarOutlined />}
                                            disabled={isFavorite}
                                            onClick={saveFavorite}
                                            className={style.favoriteButton}>{isFavorite ? '您已收藏该商品' : '收藏商品'}</Button>
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
                                    {(() => {
                                        if (!!rateStatistics && !rateStatistics.average) {
                                            return (
                                                <>
                                                    <div className={style.rateText}>
                                                        <span>0.0</span>
                                                    </div>
                                                    <div>
                                                        <span>暂无评分</span>
                                                    </div>
                                                </>
                                            )
                                        } else {
                                            return <Rate value={rateStatistics?.average} disabled allowHalf
                                                         className={style.rateStar} />
                                        }
                                    })()}
                                </div>
                                <div className={style.rateCount}>
                                    {rateStars.current.map((item: number) => {
                                        return (
                                            <div key={item}>
                                                <span>{item.toFixed(1)}</span>
                                                <Rate defaultValue={item} disabled className={style.rateCountStar} />
                                                <span>({!rateStatistics ? 0 : rateStatistics.fiveCount})</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className={style.commentItem}>
                                <div className={style.noComment}>
                                    <img src={CommentEmpty} alt='' />
                                    <div><span>暂无商品评论</span></div>
                                </div>
                            </div>
                        </div>
                        <div className={style.guessLike}>
                            <div className={style.guessLikeTitle}>
                                <span>猜你喜欢</span>
                            </div>
                            <div className={style.noGuessLike}>
                                <span>暂无商品</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*全局消息提醒*/}
            {messageContextHolder}
        </div>
    )
}

export default ProductDetailPages