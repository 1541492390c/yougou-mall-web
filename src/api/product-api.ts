import request from '@/request'
import { AxiosResponse } from 'axios'

const getCategoryListApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/product/category/list',
        method: 'GET'
    })
}

const getRecommendedProductListApi = (): Promise<AxiosResponse> => {
    return request({
        url: 'product/recommended_list',
        method: 'GET'
    })
}

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

const getSkuListApi = (productId: string | undefined) => {
    return request({
        url: '/product/sku/list',
        method: 'GET',
        params: {product_id: productId}
    })
}

export { getCategoryListApi, getRecommendedProductListApi, getProductByProductIdApi, getAttrListApi, getSkuListApi }