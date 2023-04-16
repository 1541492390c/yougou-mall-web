import React, { ReactElement } from 'react'

interface Props {
    children: ReactElement
}

const AuthRoute: React.FC<Props> = ({ children }) => {
    const isLogin = localStorage.getItem('token')
    return !!isLogin ? children : <div />
}

export default AuthRoute