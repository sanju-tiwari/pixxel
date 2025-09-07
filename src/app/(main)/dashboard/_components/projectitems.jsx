'use client'

import { useRouter } from 'next/navigation';
import React from 'react'
import Projectcard from './Projectcard';
function ProjectGrid({project}) {
    const router = useRouter();
    const handleEditProject = (projectId)=>{
        router.push(`/editor/${projectId}`)
    }
  return (
    <div className=' grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {project.map( (project , i) => (
         <Projectcard key={i} project={project} onEdit={ ()=> handleEditProject(project._id) } />
        ) ) 
        }
    </div>
  )
}

export default ProjectGrid
