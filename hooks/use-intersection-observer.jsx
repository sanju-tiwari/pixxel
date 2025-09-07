import React, { useEffect, useRef, useState } from 'react'

 export const Intersectionobserver = ( threshold = 0.1 )=> {
  const [isvisible, setIsVisible] = useState(false);
  const ref = useRef(null)

   useEffect(()=>{
      const observer = new IntersectionObserver(
        ([entry])=> setIsVisible(entry.isIntersecting) , {threshold}
      )  
        if(ref.current) observer.observe(ref.current)
          return ()=> observer.disconnect()
   },[threshold] )
   
   return [ref , isvisible]
}

