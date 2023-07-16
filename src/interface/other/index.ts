// 轮播图
interface Banner {
    bannerId: number,
    description?: string,
    link: string,
    img: string
}

// 购物车
interface ShopCarItem {
    productId?: string,
    skuId: number,
    quantity: number,
    totalAmount: number,
    price: number,
    productName?: string,
    img?: string,
    specs: string
}

// 评分统计
interface RateStatistics {
    average: number,
    oneCount: number,
    twoCount: number,
    threeCount: number,
    fourCount: number,
    fiveCount: number
}

// 行政区域选项
interface District {
    name: string,
    districts: Array<District>
}

export type { Banner, ShopCarItem, RateStatistics, District }