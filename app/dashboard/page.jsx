"use client"

import React from 'react'
import { useSession } from 'next-auth/react'

const page = () => {

    const data = useSession()
  return (
    <div>Dashboard</div>
  )
}

export default page