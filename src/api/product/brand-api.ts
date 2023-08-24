import { AxiosResponse } from 'axios'
import request from '@/request'

// 获取品牌分页信息
const getBrandPagesApi = (pageNum: number = 1, pageSize: number = 10): Promise<AxiosResponse> => {
    return request({
        url: '/product/brand/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize
        }
    })
}

// 获取品牌列表
const getBrandListApi = (categoryNode: string | undefined): Promise<AxiosResponse> => {
    return request({
        url: '/product/brand/list',
        method: 'GET',
        params: {
            category_node: categoryNode
        }
    })
}

export { getBrandPagesApi, getBrandListApi }