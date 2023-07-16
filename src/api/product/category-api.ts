import { AxiosResponse } from 'axios'
import request from '@/request'

// 获取分类列表
const getCategoryListApi = (parentId: number = 0): Promise<AxiosResponse> => {
    return request({
        url: '/product/category/list',
        method: 'GET',
        params: {parent_id: parentId}
    })
}

// 根据分类节点获取分类列表
const getCategoryByNodeApi = (node: string): Promise<AxiosResponse> => {
    return request({
        url: '/product/category/by_node',
        method: 'GET',
        params: {node: node}
    })
}

export { getCategoryListApi, getCategoryByNodeApi }