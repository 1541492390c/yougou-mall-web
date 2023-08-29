import { AxiosResponse } from 'axios'
import request from '@/request'

// 支付接口
const payApi = (orderId: number | undefined, paymentType: number): Promise<AxiosResponse> => {
    return request({
        url: '/payment/pay',
        method: 'POST',
        params: {
            order_id: orderId,
            payment_type: paymentType
        }
    }, true)
}

export { payApi }