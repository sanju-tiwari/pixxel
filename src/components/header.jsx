'use client'
import {SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import {useStoreUser} from '../../hooks/useStoreUserEffect'
import { BarLoader } from 'react-spinners'
import { Authenticated, Unauthenticated } from 'convex/react'
import { LayoutDashboard } from 'lucide-react'

function Header() {

    const path = usePathname()
     const {isLoading}= useStoreUser()
     if(path.includes("/editor")){
      return null
     }

  return (
    <header className=' fixed top-6 left-1/2 transform -translate-x-1/2 z-50 ' >
     <div className=' flex items-center justify-center text-center backdrop-blur-md bg-white/10 border-white/20 rounded-full px-8 py-4 gap-8 ' > 
      <Link href="/" className='mr-10 md:mr-20 '>
       <Image src="/Spidey.png" alt='/logo.png'   width={96} height={74} className=' min-w-24 h-7 rounded-[5px] object-cover ' />
       </Link>
       {path === "/" && (
          <div className=' hidden md:flex space-x-6 '>
        <Link href="/features" className='font-medium transition-all duration-300 text-white hover:text-cyan-400 cursor-pointer '>
            Features
        </Link>
        <Link href="/pricing" className='font-medium transition-all duration-300 text-white hover:text-cyan-400 cursor-pointer '>
          Pricing
        </Link>
        <Link href="/contact" className='font-medium transition-all duration-300 text-white hover:text-cyan-400 cursor-pointer '>
          Contact
        </Link>
          </div>
       ) }
       <div className='flex items-center gap-3 ml-10 md:ml-20 '>
         <Unauthenticated>
              <SignInButton>
                 <Button variant="glass">Sign In</Button>
               </SignInButton >
              <SignUpButton>
                 <Button variant="primary">Get Started</Button>
              </SignUpButton>
            </Unauthenticated>
            <Authenticated>
              <Link href='/dashboard'>
                <Button variant="glass" className='flex'>
                  <LayoutDashboard className='h-4 w-4'/>
                  <span className=' hidden md:flex'>Dashboard</span>
                </Button>
              </Link>
              <UserButton
              appearance={{
                elements:{
                  avatarBox:'w-8 h-8',
                }
              }}
              />
            </Authenticated>
       </div>
       {isLoading && (
       <div className='fixed bottom-0 left-0 w-full z-40 flex justify-center ' >
        <BarLoader width={"95%"} color='#06b6d4'  />
        </div> 
       )
        }
     </div>
    </header>
  )
}

export default Header
