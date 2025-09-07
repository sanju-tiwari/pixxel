'use client'
import { useEffect, useState } from "react";
export const Scroll = ()=>{
  const [scrollY, setScrollY] = useState("");

  useEffect(()=>{
     const handlescrool = ()=>{ setScrollY(window.scrollY)}
        window.addEventListener("scroll", handlescrool);

        return ()=> {
          window.removeEventListener("scroll", handlescrool);
        }
  } ,[] )
  
  return scrollY
}