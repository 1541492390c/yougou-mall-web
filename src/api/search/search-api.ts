import { AxiosResponse } from 'axios'
import request from '@/request'

// 关键词搜索
const keywordSearchApi = (
    keyword: string | undefined,
    sort: string, categoryNode: string | undefined,
    brandId: number | undefined,
    searchType: number | undefined = 1,
    pageNum: number = 1, pageSize: number = 1
): Promise<AxiosResponse> => {
    return request({
        url: '/search/product/keyword',
        method: 'GET',
        params: {
            keyword: keyword,
            sort: sort,
            category_node: categoryNode,
            brand_id: brandId,
            search_type: searchType,
            page_num: pageNum,
            page_size: pageSize
        }
    })
}

export { keywordSearchApi }