import { AxiosResponse } from 'axios'
import request from '@/request'
import { Addr } from '@/interface'

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

// 获取收获地址接口
const getAddrListApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/user/addr/list',
        method: 'GET'
    }, true)
}

// 保存收货地址
const saveAddrApi = (addr: Addr): Promise<AxiosResponse> => {
    return request({
        url: '/user/addr/save',
        method: 'POST',
        data: addr
    }, true)
}

// 更新收货地址
const updateAddrApi = (addr: Addr): Promise<AxiosResponse> => {
    return request({
        url: '/user/addr/update',
        method: 'PUT',
        data: addr
    }, true)
}

// 删除收货地址
const deleteAddrApi = (addrId: number): Promise<AxiosResponse> => {
    return request({
        url: '/user/addr/delete',
        method: 'DELETE',
        params: {addr_id: addrId}
    }, true)
}

export {
    registerApi,
    getUserinfoApi,
    getCommentRateStatistics,
    getAddrListApi,
    saveAddrApi,
    updateAddrApi,
    deleteAddrApi
}