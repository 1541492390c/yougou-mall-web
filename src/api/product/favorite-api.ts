import request from '@/request'
import { AxiosResponse } from 'axios'

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
        data: {productId: productId}
    }, true)
}

// 获取用户收藏分页信息
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
const deleteFavoriteApi = (id: number | undefined): Promise<AxiosResponse> => {
    return request({
        url: `/product/favorite/delete/${id}`,
        method: 'DELETE'
    }, true)
}

export { isFavoriteApi, saveFavoriteApi, getFavoritePagesApi, deleteFavoriteApi }