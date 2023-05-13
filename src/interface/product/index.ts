interface Category {
    categoryId: number,
    parentId: number,
    level: number,
    name: string,
    children?: Array<Category>
}

export type { Category }