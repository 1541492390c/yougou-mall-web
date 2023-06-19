import React, { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

interface Props {
    children: ReactElement
}

const AuthRoute: React.FC<Props> = ({ children }) => {
    return !!localStorage.getItem('token') ? children : <Navigate to='/login' />
}

export default AuthRoute