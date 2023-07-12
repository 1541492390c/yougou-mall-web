import React from 'react'
import IndexHeader from '@/components/index-header/IndexHeader'
import style from './style.module.scss'
import { Location, Outlet, useLocation } from 'react-router-dom'
import RightBar from '@/components/right-bar/RightBar'
import Navigation from '@/components/navigation/Navigation'
import IndexFooter from '@/components/index-footer/IndexFooter'

const IndexPage: React.FC = (): JSX.Element => {
    const location: Location = useLocation()

    return (
        <div className={style.main}>
            <div className={style.index}>
                <IndexHeader />
                <div className={style.navigation}>
                    <Navigation />
                </div>
                <Outlet />
                <IndexFooter />
            </div>
            <><RightBar pathname={location.pathname} /></>
        </div>
    )
}

export default IndexPage