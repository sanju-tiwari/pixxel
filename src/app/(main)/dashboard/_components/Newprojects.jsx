import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { useState } from 'react'
import { usePlanAccess } from '../../../../../hooks/has-plan-access'
import { useConvexMutation, useConvexQuery } from '../../../../../hooks/use-convex'
import { api } from '../../../../../convex/_generated/api'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Crown, ImageIcon, Loader2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDropzone } from 'react-dropzone'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import { UpgradeModel } from '@/components/upgrademodels '

function Newprojects( {isOpen , onClose} ) {
    const [isUploading , setisUploading ] = useState(false)
    const [projectTitle , setProjectTitle] = useState('')
    const [selectedFile , setSelectedFile] = useState(null)
    const [previewUrl , setPreviewUrl] = useState(null)
    const [showUpgradedModel , setshowUpgradedModel] = useState(false)
    const {isFree , canCreateProject } = usePlanAccess()
    const {data:project} = useConvexQuery(api.project.getUserProjects)
    const { mutate: createProject } = useConvexMutation(api.project.create);
    const router = useRouter();

    const isProjectLoading = project === undefined;

  const onDrop = (acceptedFiles)=>{
      const file = acceptedFiles[0];

      if(file){
        setSelectedFile(file)
        setPreviewUrl(URL.createObjectURL(file))

        const nameWithoutExt = file.name.replace(/\.[^/.]+$/," ")
        setProjectTitle(nameWithoutExt || "untitled Projects")
      }
  }

  const {getRootProps, getInputProps, isDragActive} =  useDropzone({
    onDrop,
    accept:{
        "image/*":[".png" ,".jpg" , ".jpeg" , ".webp" , ".gif" ]
    },
    maxFiles:1,
    maxSize:20 * 1024 * 1024
    })
    const currentProjectCount = project?.length || 0
    const canCreate = canCreateProject(currentProjectCount)
     
    const handlecreateProject = async()=>{
         
        if (isProjectLoading) {
         toast.error("Loading your projects. Please wait...");
         return;}


        if(!canCreate){
           onClose(); 
            setshowUpgradedModel(true) 
            return;
        }
         if(!selectedFile || !projectTitle.trim()){
            toast.error(" Please select an image and enter a project title")
            return
         }
            setisUploading(true);
        try{
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("fileName", selectedFile.name);

      const uploadResponse = await fetch("/api/imagekit/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        throw new Error(uploadData.error || "Failed to upload image");
      }
      const projectId = await createProject({
        title: projectTitle.trim(),
        originalImageUrl: uploadData.url,
        currentImageUrl: uploadData.url,
        thumbnailUrl: uploadData.thumbnailUrl,
        width: uploadData.width || 800,
        height: uploadData.height || 600,
        canvasState: null,
      });
      toast.success("Project created successfully!");
      router.push(`/editor/${projectId}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(
        error.message || "Failed to create project. Please try again."
      );
    } finally {
      setisUploading(false);
    }
  };
    const handleclose = ()=>{
          setSelectedFile(null);
          setPreviewUrl(null);
          setProjectTitle("");
          setisUploading(false);
          onClose() 
    }
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleclose} >
  <DialogContent>
    <DialogHeader>
      <DialogTitle className=' text-2xl font-bold text-white ' >Create New Projects</DialogTitle>
        {isFree && (
            <Badge variant='secondary' className=' bg-slate-700 text-white/70 '> 
            {currentProjectCount }/3 projects
             </Badge>
        ) }
    </DialogHeader> 
     <div className=' space-y-6'>
        {isFree && currentProjectCount >=2 && (
            <Alert variant="default | destructive">
                <Crown className=' text-amber-400 h-5 w-5  ' />
          <AlertDescription className={ ` text-amber-300/80 ` } >
            <div className=' font-semibold text-amber-500 mb-1 '>
                {currentProjectCount >=2 ? "Last Free Projects...  " : "Project Limit Reached " }
                 {
                    currentProjectCount === 2 ? 'This will be your last free projects . upgrade to pixxel Pro for unlimited projects' : "Free plan is limited to 3 projects. Upgrade to Pixxel Pro  to create more projects "
                 }
            </div>
          </AlertDescription>
         </Alert>
        ) }
          {!selectedFile ? (
         <div {...getRootProps()} className= {`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${isDragActive ? "border-cyan-400 bg-cyan-400/5 " : " border-white/20 hover:border-white/40 " }    ${!canCreate ?  "opacity-50  pointer-events-none " : ""  } `}>
      <input {...getInputProps()} />
           <Upload className=' h-12 w-12 text-white/50 mx-auto mb-4 '/>
           <h3 className=' text-xl font-semibold text-white mx-auto mb-4 ' > {isDragActive ? "Drop your image here" : "Upload an image" } </h3>
           <p className=' text-white/70 mb-4'> {canCreate ? "Drag and drop your image , or click to browser" : "upgrade to pro to create more projects"  } </p>{' '}
           <p className=' text-sm text-white/50'> Supports PNG , JPG , WEBP up to 200MB </p> 
     </div>) :(
        <div className='space-y-6  ' >
           <div className=' relative'>
            <img src={previewUrl} alt="Preview"  className=' w-full h-64 object-cover rounded-xl border border-white/10 '/>
             <Button variant='ghost' size='icon' onClick={ ()=> {setPreviewUrl(null) ;
                setSelectedFile(null) ;
                setProjectTitle("") } }  className={ ` absolute top-2 right-2 bg-black/50 hover":bg-black/70 text-white ` }  >
                 <X className='h-4 w-4 ' />
             </Button>
           </div>
            
            <div className=' space-y-2 ' >
               <Label className=' text-white ' htmlFor='project-title'   >
                     Project Title
               </Label>
                   <Input type="text" id='project-title' value={projectTitle} onChange={(e)=> setProjectTitle(e.target.value) }  placeholder='Enter project name...  ' className=' bg-slate-700 border-white/20 text-white placeholder-white/50 focus:border-cyan-500 focus:ring-cyan-500 '  />
            </div>
             <div  className=' bg-slate-700/50 rounded-lg p-4'>
             <div className=' flex items-center gap-3'>
                  <ImageIcon className=' h-5 w-5 text-cyan-500'/> 
             </div>
             <p className=' text-white font-medium ' >
                       {selectedFile.name}
             </p>
             <p className=' text-white/70 text-sm  ' >
                    {(selectedFile.size /1024/1024).toFixed(2)}MB
             </p>
             </div>
        </div>
     )}
     </div>
    <DialogFooter>
        <Button variant='ghost' disabled={isUploading} onClick={handleclose} className='text-white/70 hover-text-white'>
               Cancel 
        </Button>

            <Button variant='primary' onClick={handlecreateProject} disabled={!selectedFile || !projectTitle.trim() || isUploading } className='text-white/70 hover-text-white'>
               { isUploading ?  <div> <Loader2 className=' h-4 w-4 animate-spin ' /> Creating...  </div> : 'Create Project'  } 
        </Button>

    </DialogFooter>
  </DialogContent>
</Dialog>
   
   <UpgradeModel isOpen={showUpgradedModel} onClose={()=> setshowUpgradedModel(false)} restrictedTool="project"  reason=' Free plan is limited to 3 projects . Upgrade to pro fro unlimited projects and access to all AI editing tool '  />
    </div>
  )
}

export default Newprojects
