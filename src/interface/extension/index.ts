// 购物车
interface ShopCarItem {
    productId?: number,
    skuId: number,
    quantity: number,
    totalAmount: number,
    price: number,
    maxStock: number,
    productName?: string,
    categoryNode?: string,
    img?: string,
    specs: string
}

// 行政区域选项
interface District {
    name: string,
    districts: Array<District>
}

export type { ShopCarItem, District }