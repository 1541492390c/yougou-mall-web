import { AxiosResponse } from 'axios'
import request from '@/request'
import { Order } from '@/interface'

// 提交订单接口
const submitOrderApi = (order: Order): Promise<AxiosResponse> => {
    return request({
        url: '/order/submit',
        method: 'POST',
        data: order
    }, true)
}

// 获取订单分页信息
const getOrderPagesApi = (pageNum: number = 1, pageSize: number = 10): Promise<AxiosResponse> => {
    return request({
        url: '/order/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize
        }
    }, true)
}

export { submitOrderApi, getOrderPagesApi }