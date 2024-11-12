"use client"

import { signIn } from 'next-auth/react'
import React from 'react'

const GoogleSignInButton = () => {


    const handleClick = async () => {
        await signIn("google", {callbackUrl: "/"});
    }

  return (
    <div onClick={handleClick}>GoogleSignInButton</div>
  )
}

export default GoogleSignInButton