'use client'

import React, { useState } from 'react'
import { useConvexQuery } from '../../../../hooks/use-convex'

import { Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BarLoader } from 'react-spinners'
import Newprojects from './_components/Newprojects'
import ProjectGrid from './_components/projectitems'
import { api } from '../../../../convex/_generated/api'

function Dashboard() {
 const [ showNewProjects ,setshowNewProjects] = useState(false)

 const {data : project , isloading} = useConvexQuery(api.project.getUserProjects)

console.log(project)

  return (
    <div  className ="min-h-screen pt-32 pb-32">
      <div className='container mx-auto px-6 ' >
        <div className=' flex items-center justify-between mb-8' >
         <div>
          <h1 className='text-4xl font-bold text-white mb-2 ' >
            Your Projects
          </h1>
          <p className='text-white/70 ' >
             Create and manage your AI-powered image design 
          </p>
         </div>
         <Button 
          onClick={()=> setshowNewProjects(true) }
         variant="primary" size="lg" className='gap-2'>
           <Sparkles className='h-5 w-5 '/>
            New Projects
         </Button>
        </div>
        </div> 
        {isloading ? <BarLoader width={"100%"} color='white' /> :  project && project.length >0 ? (
          <ProjectGrid project={project} />
        ) :( <div className='flex flex-col items-center justify-center py-20 text-center   ' >
            <h3 className=' text-2xl font-semibold text-white mb-3 ' >
              Create Your First Project
              </h3> 

              <p className='text-white/70 mb-8 max-w-md'>
              Upload an image to start editing with our powerful AI tools
                </p>  
         <Button
         onClick={()=> setshowNewProjects(true) }
         variant="primary" size="lg" className='gap-2' >
           <Sparkles className='h-5 w-5 ' />
            New Projects
         </Button>
        </div>
      )}

      <Newprojects isOpen={showNewProjects} onClose={ ()=> setshowNewProjects(false) }  />
      
    </div>
  )
}

export default Dashboard
