import { AxiosResponse } from 'axios'
import request from '@/request'
import { Addr } from '@/interface/user'

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

export { getAddrListApi, saveAddrApi, updateAddrApi, deleteAddrApi }