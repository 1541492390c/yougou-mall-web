// 用户信息
interface User {
    userId?: string,
    nickname?: string,
    avatar?: string,
    age?: number,
    gender?: number,
    birthday?: Date
}

// 收获地址
interface Addr {
    addrId?: number,
    userId?: string,
    consignee: string,
    telephone: string,
    province?: string,
    city?: string,
    district?: string,
    detailedAddr?: string,
    isDefault: boolean
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

export type { User, Addr, RateStatistics }