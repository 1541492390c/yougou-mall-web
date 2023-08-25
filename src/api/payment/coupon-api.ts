import { AxiosResponse } from 'axios'
import request from '@/request'

// 获取优惠券分页信息
const getCouponPagesApi = (pageNum: number = 1, pageSize: number = 10): Promise<AxiosResponse> => {
    return request({
        url: '/payment/coupon/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize
        }
    })
}

// 领取优惠券
const receiveCouponApi = (couponId: string | undefined): Promise<AxiosResponse> => {
    return request({
        url: '/payment/coupon/receive',
        method: 'POST',
        params: {coupon_id: couponId}
    }, true)
}

export { getCouponPagesApi, receiveCouponApi }