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

export { submitOrderApi }