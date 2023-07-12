import React from 'react'
import style from './style.module.scss'

const FooterComponent: React.FC = (): JSX.Element => {
    return (
        <div className={style.footer}>
            <div>&copy; Copyright 2022 CCM</div>
        </div>
    )
}

export default FooterComponent