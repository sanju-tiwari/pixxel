'use client'

import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { canvaContext } from '../../../../../context/context'
import { Loader2, Monitor } from 'lucide-react'
import { useConvexQuery } from '../../../../../hooks/use-convex'
import { api } from '../../../../../convex/_generated/api'
import { RingLoader } from 'react-spinners'
import Canvaproject from './_component/Canvaproject'
import EditorTopBar from './_component/editor-top-bar'
import {EditorSlidebar} from './_component/editor-slidebar'

export default function Editor() {
   const param = useParams()
   const projectId = param.projectId
   
   const [canvasEditor , setcanvaEditor] = useState(null)
   const [processingMessage , setprocessingMessage ] = useState(null)
   const [activeTool , setactiveTool] = useState("resize")

   const {
    data:project,
    isLoading,
    error  
   }   = useConvexQuery(api.project.getProject ,{projectId} )
     
     if(isLoading ){
       return (
       <div className=' min-h-screen bg-slate-900 items-center justify-center '>
        <div className=' flex flex-col items-center gap-4 '>
          <Loader2 className=' h-8 w-8 animate-spin text-cyan-500 ' />
            <p className=' text-white/70 ' >
                  Loading....
            </p>
        </div>
      </div>
     )}
        
     if(error || !project){
      return(
        <div className=' min-h-screen bg-slate-900 flex items-center justify-center ' >
          <div className='text-center ' >
            <h1 className='text-2xl font-bold text-white mb-2 '>
                  Project not found
            </h1>
            <p className=' text-white/70 ' >
                     The project you're looking for doesn't exists or you don't have access to it..
            </p>
          </div>
        </div>
      )
     }

  return (
  <canvaContext.Provider value={{ canvasEditor , setcanvaEditor , setprocessingMessage , onToolchange:setactiveTool , processingMessage ,activeTool}} > 
     <div className=' lg:hidden min-h-screen bg-slate-900 flex items-center justify-center p-6 ' >
      <div className=' text-center max-w-md ' >
       < Monitor className=' h-16 w-16 text-cyan-400 mx-auto mb-6 '  />
       <h1 className=' text-2xl font-bold text-white mb-4'>
        Desktop Required
       </h1>
       <p className=' text-white/70 text-lg mb-2 '>
              The editor is only usable for desktop 
       </p>
       <p className=' text-white/50 text-sm'>
             Please use a large screen to access the full editing experience
       </p>
      </div>
     </div>
        <div>
    {processingMessage && (
        <div className=' fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center'>
            <div className=' rounded-lg p-6 flex flex-col items-center gap-4 '>
                <RingLoader color='#fff' />
                    <div className='text-center  '  >
                            <p className=' text-white font-medium ' >
                                  {processingMessage}
                            </p>
                            <p className=' text-white/70 text-sm mt-1 ' >
                                 Please wait , do not switch tabs or navigate away
                            </p>
                    </div>
              </div>
            </div>
           )}
              <EditorTopBar project={project} />
            <div className=' flex flex-1 overflow-hidden '>
              <EditorSlidebar project={project} />
            <div className=' flex bg-slate-900' >
              <Canvaproject project={project} />
           </div>
          </div>
          </div>    
    </canvaContext.Provider>
  );
}

