import React, { ReactElement, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface Props {
    children: ReactElement
}

const AppScrollTop: React.FC<Props> = ({ children }) => {
    const location = useLocation()
    useEffect(() => window.scrollTo(0, 0), [location])
    return children
}

export default AppScrollTop