interface User {
    userId?: number,
    username?: string,
    avatar?: string,
    role?: string,
    age?: number,
    gender?: number,
    birthday?: Date
}

interface Category {
    categoryId: number,
    parentId: number,
    level: number,
    name: string,
    children?: Array<Category>
}

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

export type { User, Category, Product }