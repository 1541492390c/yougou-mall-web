import { AxiosResponse } from 'axios'
import request from '@/request'
import { OrderAddr, OrderItem } from '@/interface/order'

// 提交订单接口
const submitOrderApi = (order: {orderAddr: OrderAddr, orderItemList: Array<OrderItem>, couponUserId: number | undefined}): Promise<AxiosResponse> => {
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

// 根据ID获取订单信息
const getOrderByIdApi = (id: number | undefined) => {
    return request({
        url: `/order/${id}`,
        method: 'GET'
    }, true)
}

export { submitOrderApi, getOrderPagesApi, getOrderByIdApi }