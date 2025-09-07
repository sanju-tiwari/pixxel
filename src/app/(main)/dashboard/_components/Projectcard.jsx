import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { useConvexMutation } from '../../../../../hooks/use-convex'
import { formatDistanceToNow } from 'date-fns'
import { api } from '../../../../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
  
function Projectcard({ project , onEdit } ) {
    
    const {mutate : deleteProject , isLoading } =  useConvexMutation( api.project.deleteProject )
   
    const lastUpdate = formatDistanceToNow( new Date(project.updatedAt)) 
    
      const handleDelete = async () => {
    const confirmed = confirm(
      `Are you sure you want to delete "${project.title}"? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await deleteProject({ projectId: project._id });
        toast.success("Project deleted successfully");
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project. Please try again.");
      }
    }
  };

  return (
   <Card className=' py-0 group relative bg-slate-800/50 overflow-hidden hover:border-white/20 transition-all hover:scale-(1.02) ' >
    <div  className=' aspect-video bg-slate-700 relative overflow-hidden'>
            {project.thumbnailUrl && (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        )}
        
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button variant="glass" size="sm" onClick={onEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="glass"
            size="sm"
            onClick={handleDelete}
            className="gap-2 text-red-400 hover:text-red-300"
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
    </div>
      <CardContent className="pb-6">
        <h3 className="font-semibold text-white mb-1 truncate">
          {project.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-white/70">
          <span>Updated {lastUpdate}</span>
          <Badge
            variant="secondary"
            className="text-xs bg-slate-700 text-white/70"
          >
            {project.width} × {project.height}
          </Badge>
        </div>
      </CardContent>
</Card>
  )
}

export default Projectcard

