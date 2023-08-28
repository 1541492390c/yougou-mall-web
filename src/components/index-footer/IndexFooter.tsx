import React from 'react'
import style from './style.module.scss'

const IndexFooterComponent: React.FC = (): JSX.Element => {
    return (
        <div className={style.footer}>
            <div className={style.footerContent}>
                <div className={style.help}>
                    <div className={style.helpItem}>
                        <div className={style.helpItemTitle}>
                            <span>用户服务</span>
                        </div>
                        <div className={style.helpItemText}>
                            <div><span>免费注册</span></div>
                            <div><span>个人中心</span></div>
                            <div><span>忘记密码</span></div>
                            <div><span>修改密码</span></div>
                        </div>
                    </div>
                    <div className={style.helpItem}>
                        <div className={style.helpItemTitle}>
                            <span>售后服务</span>
                        </div>
                        <div className={style.helpItemText}>
                            <div><span>正品保障</span></div>
                            <div><span>7天无理由退货</span></div>
                            <div><span>价格保护</span></div>
                        </div>
                    </div>
                    <div className={style.helpItem}>
                        <div className={style.helpItemTitle}>
                            <span>物流服务</span>
                        </div>
                        <div className={style.helpItemText}>
                            <div><span>商品免邮</span></div>
                            <div><span>急速物流</span></div>
                            <div><span>配送服务</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.copyright}>
                <div>&copy; Copyright 2022-2023 CCM</div>
            </div>
        </div>
    )
}

export default IndexFooterComponent