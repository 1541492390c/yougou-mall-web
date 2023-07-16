import React, { useEffect, useRef, useState } from 'react'
import style from './style.module.scss'
import { CaretDownFilled, RightOutlined } from '@ant-design/icons'
import SearchEmpty from '@/assets/img/empty/search-empty.png'
import { Location, useLocation } from 'react-router-dom'
import { getCategoryByNodeApi, getCategoryListApi } from '@/api/product/category-api'
import { isEmpty } from '@/utils'
import { Pagination, Tag } from 'antd'
import { getProductPagesApi } from '@/api/product/product-api'
import ProductCard from '@/components/product-card/ProductCard'
import { Category, Product } from '@/interface/product'

const ListHooks: any = (): any => {
    const location: Location = useLocation()
    const [topCategory, setTopCategory] = useState<Category>()
    const [secondCategory, setSecondCategory] = useState<Category>()
    const [currentCategory, setCurrentCategory] = useState<Category>()
    const [categoryList, setCategoryList] = useState<Array<Category>>([])
    const [productList, setProductList] = useState<Array<Product>>([])
    const [productTotal, setProductTotal] = useState<number>(0)
    const [currentSort, setCurrentSort] = useState<string>('product_id')
    const sortOptions = useRef<any>([
        {key: 'product_id', label: '综合'},
        {key: 'hot', label: '热度'},
        {key: 'rate_count', label: '评论数'},
        {key: 'price', label: '价格'}
    ])

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
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [location.state.node])

    useEffect(() => {
        // 获取子分类列表
        if (!isEmpty(location.state) && !isEmpty(location.state.parentId)) {
            getCategoryListApi(location.state.parentId).then((res) => {
                setCategoryList(res.data)
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [location.state.parentId])

    useEffect(() => {
        if (!isEmpty(currentCategory)) {
            getProductPagesApi(1, 10, currentCategory?.node).then((res) => {
                setProductTotal(res.data.total)
                setProductList(res.data.list)
            })
        }
    }, [currentCategory])

    return {
        topCategory,
        secondCategory,
        currentCategory,
        categoryList,
        productList,
        productTotal,
        sortOptions,
        currentSort,
        setCurrentCategory,
        setCurrentSort
    }
}

const ListPage: React.FC = (): JSX.Element => {
    const {
        topCategory,
        secondCategory,
        currentCategory,
        categoryList,
        productList,
        productTotal,
        sortOptions,
        currentSort,
        setCurrentCategory,
        setCurrentSort
    } = ListHooks()

    // 品牌栏
    const brandsScreen: JSX.Element = (
        <div className={style.screen}>
            <div className={style.screenBar}>
                <div className={style.screenBarTitle}>
                    <span>品牌</span>
                </div>
                <span className={style.empty}>暂无相关品牌</span>
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
                               {productTotal !== 0 && <Pagination pageSize={20} total={productTotal} showSizeChanger={false} />}
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