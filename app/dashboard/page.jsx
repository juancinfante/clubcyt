"use client"

import React from 'react'
import { useSession } from 'next-auth/react'

const page = () => {

    const data = useSession()
    console.log(data)
  return (
    <div>Dashboard</div>
  )
}

export default page