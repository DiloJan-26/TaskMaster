// Step 2 - auth-layout.tsx file is created

import React from 'react'
import { Outlet } from 'react-router'

const AuthLayout = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <Outlet />
    </div>
  )
}

export default AuthLayout