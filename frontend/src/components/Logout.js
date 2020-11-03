import React, { useContext, useEffect } from 'react'

import { Context } from '../Context/AuthContext'

export default () => {
    const { handleLogout } = useContext(Context)

    useEffect(() => {
        handleLogout();
    }, [])

    return null
}