import request from '@/request'
import { AxiosResponse } from 'axios'

// 获取分类接口
const getCategoryListApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/product/category/list',
        method: 'GET'
    })
}

// 获取推荐商品列表接口
const getRecommendedProductListApi = (): Promise<AxiosResponse> => {
    return request({
        url: 'product/recommended_list',
        method: 'GET'
    })
}

// 根据商品ID获取商品接口
const getProductByProductIdApi = (id: string | undefined): Promise<AxiosResponse> => {
    return request({
        url: `/product/${id}`,
        method: 'GET'
    })
}

const getAttrListApi = (productId: string | undefined): Promise<AxiosResponse> => {
    return request({
        url: '/product/attr/list',
        method: 'GET',
        params: {product_id: productId}
    })
}

// 获取商品SKU接口
const getSkuListApi = (productId: string | undefined): Promise<AxiosResponse> => {
    return request({
        url: '/product/sku/list',
        method: 'GET',
        params: {product_id: productId}
    })
}

// 判断用户是否收藏该商品
const isFavoriteApi = (productId: string | undefined): Promise<AxiosResponse> => {
    return request({
        url: '/product/favorite/is_favorite',
        method: 'GET',
        params: {product_id: productId}
    }, true)
}

// 保存用户搜藏
const saveFavoriteApi = (productId: number | undefined): Promise<AxiosResponse> => {
    return request({
        url: '/product/favorite/save',
        method: 'POST',
        data: { productId: productId }
    }, true)
}

export {
    getCategoryListApi,
    getRecommendedProductListApi,
    getProductByProductIdApi,
    getAttrListApi,
    getSkuListApi,
    isFavoriteApi,
    saveFavoriteApi
}