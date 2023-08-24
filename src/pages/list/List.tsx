import React, { useEffect, useRef, useState } from 'react'
import style from './style.module.scss'
import { CaretDownFilled, RightOutlined } from '@ant-design/icons'
import SearchEmpty from '@/assets/img/empty/search-empty.png'
import { Location, useLocation } from 'react-router-dom'
import { getCategoryByNodeApi, getCategoryListApi } from '@/api/product/category-api'
import { isEmpty } from '@/utils'
import { Pagination, Tag } from 'antd'
import ProductCard from '@/components/product-card/ProductCard'
import { Brand, Category, Product } from '@/interface/product'
import { keywordSearchApi } from '@/api/search/search-api'
import BrandCard from '@/components/brand-card/BrandCard'
import { getBrandListApi } from '@/api/product/brand-api'

const ListHooks: any = (): any => {
    const location: Location = useLocation()
    const [topCategory, setTopCategory] = useState<Category>()
    const [secondCategory, setSecondCategory] = useState<Category>()
    const [currentCategory, setCurrentCategory] = useState<Category>()
    const [currentBrand, setCurrentBrand] = useState<Brand>()
    const [categoryList, setCategoryList] = useState<Array<Category>>([])
    const [brandList, setBrandList] = useState<Array<Brand>>([])
    const [productList, setProductList] = useState<Array<Product>>([])
    const [productTotal, setProductTotal] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [currentSort, setCurrentSort] = useState<string>('product_id')
    const sortOptions = useRef<any>([
        {key: 'product_id', label: '综合'},
        {key: 'recommended', label: '推荐'},
        {key: 'is_discount', label: '折扣'},
        {key: 'price', label: '价格'}
    ])

    // 监听分类节点
    useEffect(() => {
        // 根据传入分类节点获取分类
        if (!isEmpty(location.state) && !isEmpty(location.state.node)) {
            getCategoryByNodeApi(location.state.node).then((res) => {
                // 顶层分类
                setTopCategory(res.data)
                // 二级分类
                setSecondCategory(res.data.children[0])
                // 三级分类
                setCurrentCategory(res.data.children[0].children[0])

                // 获取父分类
                if (!isEmpty(res.data.children[0].children[0])) {
                    getCategoryListApi(res.data.children[0].children[0].parentId).then((res) => {
                        setCategoryList(res.data)
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            }).catch((err) => {
                console.log(err)
            })

            // 获取品牌列表
            getBrandListApi(location.state.node).then((res) => {
                setBrandList(res.data)
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [location.state?.node])

    // 监听关键词、品牌、排序字段的变化
    useEffect(() => {
        let node: string = currentCategory?.node ? currentCategory?.node : location.state.node
        // 根据传入的关键词搜索对应的商品、品牌、分类
        keywordSearchApi(location.state.keyword, currentSort, node, location.state.brandId, currentPage).then((res) => {
            // 设置品牌列表
            setBrandList(res.data.brandList)
            // 清除原商品列表
            setProductList([])
            setProductTotal(0)
            // 设置商品分页
            if (!isEmpty(res.data.productPage)) {
                setProductTotal(res.data.productPage.total)
                setProductList(res.data.productPage.list)
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [location.state.keyword, currentSort, currentCategory])

    // 监听当前品牌变化
    useEffect(() => {

    }, [currentBrand])

    return {
        topCategory,
        secondCategory,
        currentCategory,
        categoryList,
        brandList,
        productList,
        productTotal,
        sortOptions,
        currentSort,
        setCurrentPage,
        setCurrentCategory,
        setCurrentBrand,
        setCurrentSort
    }
}

const ListPage: React.FC = (): JSX.Element => {
    const {
        topCategory,
        secondCategory,
        currentCategory,
        categoryList,
        brandList,
        productList,
        productTotal,
        sortOptions,
        currentSort,
        setCurrentPage,
        setCurrentCategory,
        setCurrentBrand,
        setCurrentSort
    } = ListHooks()

    // 品牌栏
    const brandsScreen: JSX.Element = (
        <div className={style.screen}>
            <div className={style.screenBar}>
                <div className={style.screenBarTitle}>
                    <span>品牌</span>
                </div>
                {(() => {
                    if (isEmpty(brandList)) {
                        return <span className={style.empty}>暂无相关品牌</span>
                    } else {
                        return (
                            <div className={style.screenBarContent}>
                                {brandList.map((item: Brand, index: number) => {
                                    return (
                                        <div key={index}
                                             onClick={() => setCurrentBrand(item)}
                                             className={style.brand}>
                                            <BrandCard brand={item} />
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    }
                })()}
            </div>
        </div>
    )

    // 分类栏
    const categoryScreen: JSX.Element = (
        <div className={style.screen}>
            <div className={style.screenBar}>
                <div className={style.screenBarTitle}>
                    <span>分类</span>
                </div>
                {(() => {
                    if (isEmpty(currentCategory)) {
                        return <span className={style.empty}>暂无相关分类</span>
                    } else {
                        return (
                            <div className={style.category}>
                                {categoryList.map((item: Category, index: number) => {
                                    return (
                                        <div key={index}
                                             onClick={() => setCurrentCategory(item)}
                                             className={currentCategory?.categoryId === item.categoryId ? style.currentCategoryItem : style.categoryItem}>
                                            <span>{item.name}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    }
                })()}
            </div>
        </div>
    )

    // 商品列表
    const products: JSX.Element = (
        <>
            {(() => {
                if (isEmpty(productList)) {
                    return (
                        <div className={style.productIsEmpty}>
                            <img src={SearchEmpty} alt='' />
                            <div><span>暂无相关商品</span></div>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <div className={style.productItems}>
                                {productList.map((item: Product, index: number) => {
                                    return (
                                        <div key={index} className={style.productItem}>
                                            <ProductCard product={item} />
                                        </div>
                                    )
                                })}
                            </div>
                            <div className={style.pagination}>
                                {productTotal !== 0 &&
                                    <Pagination pageSize={20} total={productTotal}
                                                onChange={(value: number) => setCurrentPage(value)}
                                                showSizeChanger={false} />}
                            </div>
                        </div>
                    )
                }
            })()}
        </>
    )

    // 商品排序
    const productSort: JSX.Element = (
        <div className={style.productArea}>
            <div className={style.sortCard}>
                <div className={style.sortCardTitle}>
                    {sortOptions.current.map((item: any, index: number) => {
                        return (
                            <div key={index}
                                 onClick={() => setCurrentSort(item.key)}
                                 className={currentSort === item.key ? style.sortBoxSelect : style.sortBox}>
                                <span><CaretDownFilled /></span>
                                <span>{item.label}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )

    return (
        <div className={style.flex}>
            <div className={style.main}>
                <div className={style.tags}>
                    <div className={style.parentCategory}>
                        <div><span>{topCategory ? topCategory.name : '全部'}</span></div>
                        <div><RightOutlined /></div>
                    </div>
                    {/*二级分类标签*/}
                    {!isEmpty(secondCategory) ? <Tag className={style.tag}>{secondCategory.name}</Tag> : <></>}
                    {/*三级分类标签*/}
                    {!isEmpty(currentCategory) ? <Tag className={style.tag}>{currentCategory.name}</Tag> : <></>}
                </div>
                {/*品牌栏*/}
                {brandsScreen}
                {/*商品栏*/}
                {categoryScreen}
                {/*商品排序*/}
                {productSort}
                {/*{商品列表}*/}
                {products}
            </div>
        </div>
    )
}

export default ListPage