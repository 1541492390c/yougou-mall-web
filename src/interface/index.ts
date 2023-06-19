// 用户信息
interface User {
    userId?: number,
    username?: string,
    avatar?: string,
    role?: string,
    age?: number,
    gender?: number,
    birthday?: Date
}

// 商品分类
interface Category {
    categoryId: number,
    parentId: number,
    level: number,
    name: string,
    children?: Array<Category>
}

// 商品
interface Product {
    productId: number,
    brandId?: number,
    state: number,
    price: number,
    categories: string,
    name: string,
    cover: string,
    imgList?: string
}

// 商品sku规格
interface SkuSpecs {
    attrName: string,
    attrValueName: string
}

// 商品sku
interface Sku {
    skuId: number,
    productId: number,
    skuStock: number,
    price: number,
    description: string,
    skuSpecs: Array<SkuSpecs>
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

// 轮播图
interface Banner {
    bannerId: number,
    description?: string,
    link: string,
    img: string
}

// 购物车
interface ShopCarItem {
    productId?: number,
    skuId: number,
    quantity: number,
    totalAmount: number,
    productName?: string,
    img?: string,
    specs: string
}

// 用户收藏
interface Favorite {
    favoriteId: number,
    productId: number
}

export type { User, Category, Product, SkuSpecs, Sku, Attr, AttrValue, Banner, ShopCarItem, Favorite }