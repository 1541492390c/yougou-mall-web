// 响应码
enum ResponseCodeEnum {
    OK = '00000',
    // 未登录
    UN_LOGIN_ERROR = 'A0001',
    // 无效token
    UN_VALID_TOKEN_ERROR = 'A0003',
    // token已过期
    TOKEN_EXPIRED_ERROR  = 'A0011'
}

// 轮播图类型
enum BannerTypeEnum {
    // PC端
    PC = 1
}

// 收获地址对话框类型
enum AddrModalTypeEnum {
    // 添加
    ADD = 1,
    // 更新
    UPDATE
}

// 上传资源类型
enum ResourceTypeEnum {
    // 头像资源
    AVATAR = 1,
    // 反馈资源
    FEEDBACK,
    // 评论资源
    COMMENT
}

// 订单状态
enum OrderStateEnum {
    // 已取消
    CANCEL,
    // 待支付
    WAIT_PAY,
    // 待发货
    WAIT_DELIVERY,
    // 配送中
    DELIVERING,
    // 已完成
    FINISHED
}

// 商品搜索类型
enum ProductSearchTypeEnum {
    // 全部(包括分类、品牌、商品)
    ALL = 1,
    // 仅商品
    PRODUCT
}

// 更新密码类型
enum UpdatePassTypeEnum {
    // 忘记密码
    FORGET = 1
}

export { ResponseCodeEnum, BannerTypeEnum, AddrModalTypeEnum, ResourceTypeEnum, OrderStateEnum, ProductSearchTypeEnum, UpdatePassTypeEnum }