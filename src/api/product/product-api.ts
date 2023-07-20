import request from '@/request'
import { AxiosResponse } from 'axios'

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

// 获取商品分页信息接口
const getProductPagesApi = (pageNum: number = 1, pageSize: number = 10, recommended: boolean | undefined, categoryNode: string | undefined): Promise<AxiosResponse> => {
    return request({
        url: '/product/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize,
            recommended: recommended,
            category_node: categoryNode
        }
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

export {
    getRecommendedProductListApi,
    getProductByProductIdApi,
    getProductPagesApi,
    getAttrListApi,
    getSkuListApi
}