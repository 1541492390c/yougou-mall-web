// 商品
interface Product {
    productId: string,
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
    parentId: string,
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

// 商品sku规格
interface SkuSpecs {
    attrName: string,
    attrValueName: string
}

// 商品sku
interface Sku {
    skuId: number,
    productId: string,
    skuStock: number,
    price: number,
    discount: number,
    discountPrice: number,
    description: string,
    isDiscount: boolean,
    skuSpecs: Array<SkuSpecs>
}

// 用户收藏
interface Favorite {
    favoriteId: number,
    productId: string
}

export type { Product, Category, Attr, AttrValue, Sku, SkuSpecs, Favorite }