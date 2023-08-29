// 商品
interface Product {
    productId: number,
    brandId?: number,
    state: number,
    price: number,
    discountPrice: number,
    categoryNode: string,
    name: string,
    cover: string,
    imgList?: string,
    isDiscount: boolean,
    recommended: boolean
}

// 商品分类
interface Category {
    categoryId: number,
    parentId: number,
    level: number,
    name: string,
    node: string,
    children?: Array<Category>
}

// 商品属性值
interface AttrValue {
    attrValueId: number,
    attrId: number,
    name: string
}

// 商品属性
interface Attr {
    attrId: number,
    productId: number,
    name: string,
    attrValueList: Array<AttrValue>
}

// 商品sku
interface Sku {
    skuId: number,
    productId: number,
    skuStock: number,
    price: number,
    discount: number,
    discountPrice: number,
    description: string,
    specs: string,
    isDiscount: boolean,
}

// 用户收藏
interface Favorite {
    favoriteId: number,
    productId: string
}

// 秒杀活动场次
interface SecKill {
    secKillId: number,
    description: string,
    startTime: string,
    endTime: string
}

// 品牌
interface Brand {
    brandId: number,
    name: string,
    categoryNode: string,
    description: string,
    img: string
}

export type { Product, Category, Attr, AttrValue, Sku, Favorite, SecKill, Brand }