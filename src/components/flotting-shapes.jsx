'use client'
import React from 'react'
import { Scroll } from '../../hooks/scrool'

function Flottingshapes(){
    const scroolY = Scroll()
   const shapes=[
    
    {id :1 ,
     size:"w-72 h-72",
     position:"top-20 left-50",
     color:" from-blue-500 to-purple-600",   
     },
     {id :2 ,
     size:"w-96 h-96",
     position:"top-1/3 right-10",
     color:" from-cyan-400 to-blue-600",   
     },
    {id :3 ,
     size:"w-64 h-64",
     position:"bottom-20 left-1/2",
     color:" from-purple-600 to-pink-600",   
     },
    {id :4 ,
     size:"w-80 h-80",
     position:"bottom-1/3 top-1/2",
     color:" from-green-400 to-cyan-500",   
     }
   ]
  return <div className=' fixed inset-0 overflow-hidden pointer-events-none '> 
    {shapes.map((shapes , i ) =>{
        return <div key={i} className={` absolute ${shapes.size} ${shapes.position} bg-gradient-to-r ${shapes.color} rounded-full blur-3xl opacity-20 animate-pulse  `}
        style={{transform:`translateY(${scroolY * 0.5}px) rotate(${scroolY * 0.1 }) `}} 
        />
    } )}
   </div>
}

export default Flottingshapes
