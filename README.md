# 优购商城-web端
<div align='center'>
    <img src='https://gitee.com/chi-congmin/yougou-mall/raw/master/readme/img/yougou.png' alt='logo'>
</div>

## 介绍
毕业设计，一个基于React、AntDesign的前后端分离、包含了完整的购物流程的Web商城前端项目。

## 目录结构
```
yougou-mall-web
├─public --公开目录
└─src --源码
    ├─api --Api接口
    │  ├─auth --认证授权相关Api接口
    │  ├─extra --扩展相关Api接口（包含短信、文件上传）
    │  ├─order --订单相关Api接口
    │  ├─payment --支付相关Api接口
    │  ├─platform --平台相关Api接口
    │  ├─product --商品相关Api接口
    │  ├─search --搜索相关Api接口
    │  └─user --用户相关Api接口
    ├─assets --静态资源
    │  ├─font --字体
    │  ├─img --图片
    │  │  ├─common --通用图片
    │  │  ├─empty --缺省图片
    │  │  ├─index --首页图片
    │  │  ├─login --登录页面图片
    │  │  └─payment --支付页面图片
    │  └─style --公共样式
    ├─components --组件
    ├─enums --枚举
    ├─event --事件监听器
    ├─interface --接口
    │  ├─auth -- 认证授权相关接口
    │  ├─extension --扩展接口
    │  ├─order --订单相关接口
    │  ├─payment --支付相关接口
    │  ├─platform --平台相关接口
    │  ├─product --商品相关接口
    │  └─user --用户相关接口
    ├─pages --页面
    │  ├─comment --商品评论页面
    │  ├─feedback --反馈页面
    │  ├─index --主页
    │  │  ├─brands --品牌中心
    │  │  ├─coupons --领券中心
    │  │  ├─discount --限时特惠
    │  │  ├─home --首页
    │  │  └─sec-kills --秒杀专场
    │  ├─list --商品搜索页面
    │  ├─login --登录页面
    │  ├─payment --收银台
    │  ├─payment-success --支付成功返回页面
    │  ├─personal --个人中心
    │  │  ├─account-security --账号安全
    │  │  ├─addr --收货地址
    │  │  ├─favorite --我的收藏
    │  │  ├─my-coupon --我的优惠券
    │  │  ├─my-feedback --我的反馈
    │  │  └─my-order --我的订单
    │  ├─product-detail --商品详情
    │  ├─register --注册页面
    │  ├─settlement --购物车结算
    │  └─update-password --修改密码
    ├─request --http网络请求
    ├─router --路由
    ├─store --公共仓库 
    └─utils --工具
```



## 技术选型

|     技术      |       说明       |                            官网                            |
| :-----------: | :--------------: | :----------------------------------------------------------: |
|     React     |     前端框架     |                 https://react.docschina.org                  |
| React-Router  |     路由框架     |               https://reactrouter.com/en/main                |
| Redux-Toolkit | 全局状态管理框架 |                 https://redux-toolkit.js.org                 |
|   AntDesign   |    前端UI框架    |           https://ant-design.antgroup.com/index-cn           |
|     Axios     |     HTTP框架     | [https://github.com/axios/axios](https://gitee.com/link?target=https%3A%2F%2Fgithub.com%2Faxios%2Faxios) |

## 环境搭建

### 开发环境

| 工具 | 说明 | 版本号  |
| :--: | :--: | :-----: |
| Node | Node | 18.16.1 |

### 开发工具

|   工具   |    说明    |                  下载地址                   |
| :------: | :--------: | :-----------------------------------------: |
| WebStorm | Web开发IDE | https://www.jetbrains.com/webstorm/download |

## 部署

- ### 安装node模块

```
npm install
```

- ### 运行

```
npm run dev
```

## 运行截图
- 首页
![首页1](https://gitee.com/chi-congmin/yougou-mall/raw/master/readme/img/%E9%A6%96%E9%A1%B51.png)
![首页2](https://gitee.com/chi-congmin/yougou-mall/raw/master/readme/img/%E9%A6%96%E9%A1%B52.png)
- 品牌中心
![品牌中心](https://gitee.com/chi-congmin/yougou-mall/raw/master/readme/img/%E5%93%81%E7%89%8C%E4%B8%AD%E5%BF%83.png)
- 商品详情
![商品详情](https://gitee.com/chi-congmin/yougou-mall/raw/master/readme/img/%E5%95%86%E5%93%81%E8%AF%A6%E6%83%85.png)
- 商品搜索
![商品搜索](https://gitee.com/chi-congmin/yougou-mall/raw/master/readme/img/%E5%95%86%E5%93%81%E6%90%9C%E7%B4%A2.png)
- 个人中心
![个人中心1](https://gitee.com/chi-congmin/yougou-mall/raw/master/readme/img/%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%831.png)
![个人中心2](https://gitee.com/chi-congmin/yougou-mall/raw/master/readme/img/%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%832.png)
![个人中心3](https://gitee.com/chi-congmin/yougou-mall/raw/master/readme/img/%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%833.png)
- 购物车结算
![购物车结算](https://gitee.com/chi-congmin/yougou-mall/raw/master/readme/img/%E8%B4%AD%E7%89%A9%E8%BD%A6%E7%BB%93%E7%AE%97.png)
- 登录页面
![登录页面](https://gitee.com/chi-congmin/yougou-mall/raw/master/readme/img/%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2.png)