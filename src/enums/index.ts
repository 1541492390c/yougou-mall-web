// 响应码
enum ResponseCodeEnum {
    OK = '00000',
    // 未登录
    UN_LOGIN_ERROR = 'A0001',
    // 无效token
    UN_VALID_TOKEN_ERROR = 'A0003',
}

// 轮播图类型
enum BannerTypeEnum {
    PC = 1
}

// 收获地址对话框类型
enum AddrModalTypeEnum {
    ADD = 1,
    UPDATE
}

// 上传资源类型
enum ResourceTypeEnum {
    AVATAR = 1,
    FEEDBACK,
    COMMENT
}

// 订单状态
enum OrderStateEnum {
    CANCEL,
    WAIT_PAY,
    WAIT_DELIVERY,
    DELIVERING,
    FINISHED
}

// 商品搜索类型
enum ProductSearchTypeEnum {
    ALL = 1,
    PRODUCT
}

export { ResponseCodeEnum, BannerTypeEnum, AddrModalTypeEnum, ResourceTypeEnum, OrderStateEnum, ProductSearchTypeEnum }