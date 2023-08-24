import { AxiosResponse } from 'axios'
import request from '@/request'

// 关键词搜索
const keywordSearchApi = (
    keyword: string | undefined,
    sort: string, categoryNode: string | undefined,
    brandId: number | undefined,
    pageNum: number = 1, pageSize: number = 20
): Promise<AxiosResponse> => {
    return request({
        url: '/search/product/keyword',
        method: 'GET',
        params: {
            keyword: keyword,
            sort: sort,
            category_node: categoryNode,
            brand_id: brandId,
            page_num: pageNum,
            page_size: pageSize
        }
    })
}

export { keywordSearchApi }