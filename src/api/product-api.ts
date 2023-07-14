import request from '@/request'
import { AxiosResponse } from 'axios'
import favorite from '@/pages/personal/favorite/Favorite'

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

// 获取属性列表
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

// 获取收藏分页信息
const getFavoritePagesApi = (pageNum: number = 1, pageSize: number = 10): Promise<AxiosResponse> => {
    return request({
        url: '/product/favorite/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize
        }
    }, true)
}

// 删除收藏
const deleteFavoriteApi = (favoriteId: number | undefined): Promise<AxiosResponse> => {
    return request({
        url: '/product/favorite/delete',
        method: 'DELETE',
        params: {favorite_id: favoriteId}
    }, true)
}

export {
    getCategoryListApi,
    getRecommendedProductListApi,
    getProductByProductIdApi,
    getAttrListApi,
    getSkuListApi,
    isFavoriteApi,
    saveFavoriteApi,
    getFavoritePagesApi,
    deleteFavoriteApi
}