import { AxiosResponse } from 'axios'
import request from '@/request'

// 注册接口
const registerApi = (values: { username: string, password: string, email: string }): Promise<AxiosResponse> => {
    return request({
        url: '/user/register',
        method: 'POST',
        data: values
    })
}

// 获取用户信息接口
const getUserinfoApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/user/info',
        method: 'GET'
    }, true)
}

// 获取评价评分统计
const getCommentRateStatistics = (productId: string | undefined): Promise<AxiosResponse> => {
    return request({
        url: '/user/comment/rate_statistics',
        method: 'GET',
        params: {product_id: productId}
    })
}

export {
    registerApi,
    getUserinfoApi,
    getCommentRateStatistics
}