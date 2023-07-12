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

// 收获地址
interface Addr {
    addrId?: number,
    userId?: number,
    consignee: string,
    telephone: string,
    province?: string,
    city?: string,
    district?: string,
    detailedAddr?: string,
    isDefault: boolean
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
    discount: number,
    discountPrice: number,
    description: string,
    isDiscount: boolean,
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

// 用户收藏
interface Favorite {
    favoriteId: number,
    productId: number
}

// 订单
interface Order {
    orderId?: number,
    userId?: number,
    state?: number,
    remark?: string,
    cancelTime?: Date,
    payTime?: Date,
    deliveryTime?: Date,
    finishTime?: Date,
    orderAddr?: OrderAddr,
    orderItemList?: Array<OrderItem>
}

// 订单收货地址
interface OrderAddr {
    orderId: number,
    addrId: number,
    consignee: string,
    telephone: string,
    province: string,
    city: string,
    district: string,
    detailedAddr: string
}

// 订单项
interface OrderItem {
    orderId?: number,
    productId?: number,
    skuId: number,
    quantity: number,
    totalAmount?: number,
    productName?: string,
    img?: string,
    specs?: string
}

// 购物车
interface ShopCarItem {
    productId?: number,
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
    districts: District[]
}

export type {
    User,
    Addr,
    Category,
    Product,
    SkuSpecs,
    Sku,
    Attr,
    AttrValue,
    Banner,
    ShopCarItem,
    Favorite,
    Order,
    OrderAddr,
    OrderItem,
    RateStatistics,
    District
}