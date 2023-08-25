import { AxiosResponse } from 'axios'
import request from '@/request'

// 获取用户优惠券信息列表
const getCouponUserListApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/payment/coupon_user/list',
        method: 'GET'
    }, true)
}

// 查询可用优惠券
const queryAvailableCouponApi = (value: {totalAmount: number, categoryNodeList: Array<string>}): Promise<AxiosResponse> => {
    return request({
        url: '/payment/coupon_user/available_coupon',
        method: 'POST',
        data: value
    }, true)
}

export { getCouponUserListApi, queryAvailableCouponApi }