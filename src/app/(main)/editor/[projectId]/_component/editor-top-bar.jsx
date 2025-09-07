import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react'
import { useCanva } from '../../../../../../context/context';
import { usePlanAccess } from '../../../../../../hooks/has-plan-access';
import { ArrowLeft, ChevronDown, Crop, Download, Expand, Eye, FileImage, Icon, Loader2, Lock, Maximize2, Palette, RotateCcw, RotateCw, Save, Sliders, Text } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UpgradeModel } from '@/components/upgrademodels ';
import { toast } from 'sonner';
import { FabricImage } from 'fabric';
import { useConvexMutation, useConvexQuery } from '../../../../../../hooks/use-convex';
import { api } from '../../../../../../convex/_generated/api';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const TOOLS = [
  {
    id: "resize",
    label: "Resize",
    icon: Expand,
    isActive: true,
  },
  {
    id: "crop",
    label: "Crop",
    icon: Crop,
  },
  {
    id: "adjust",
    label: "Adjust",
    icon: Sliders,
  },
  {
    id: "text",
    label: "Text",
    icon: Text,
  },
  {
    id: "background",
    label: "AI Background",
    icon: Palette,
    proOnly: true,
  },

  {
    id: "ai_edit",
    label: "AI Editing",
    icon: Eye,
    proOnly: true,
  },
];
const EXPORT_FORMATS = [
  {
    format: "PNG",
    quality: 1.0,
    label: "PNG (High Quality)",
    extension: "png",
  },
  {
    format: "JPEG",
    quality: 0.9,
    label: "JPEG (90% Quality)",
    extension: "jpg",
  },
  {
    format: "JPEG",
    quality: 0.8,
    label: "JPEG (80% Quality)",
    extension: "jpg",
  },
  {
    format: "WEBP",
    quality: 0.9,
    label: "WebP (90% Quality)",
    extension: "webp",
  },
];

function EditorTopBar({project}) {
    const router = useRouter()
    const [showupgradeModel , setshowupgradeModel] = useState()
    const [isExporting, setIsExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState(null);
    const [restrictedTool , setrestrictedTool] = useState()
    const {canvasEditor , setcanvaEditor , setprocessingMessage , onToolchange , processingMessage ,activeTool } = useCanva()
    const {hasAccess , canexport , isFree}= usePlanAccess()
    const { mutate: updateProject, isLoading: isSaving } = useConvexMutation(api.project.updateProject);
    const { data: user } = useConvexQuery(api.users.getCurrentUser);

    const handleBacktoDashboard = ()=>{
        router.push('/dashboard')
    }
    const handleToolChange = (toolid)=>{
          if(!hasAccess(toolid)){
            setrestrictedTool(toolid)
            setshowupgradeModel(true)
            return
          }
            onToolchange(toolid)
    }
    const handleResertToOrigin = async()=>{
      
      if(!canvasEditor || !project || !project.originalImageUrl) {
        toast.error("No original image found to reset to")
        return;
      }
         try {
           canvasEditor.clear()
           canvasEditor.backgroundColor = "#ffffff"
           canvasEditor.backgroundImage = null

           const fabricImage = await FabricImage.fromURL(project.originalImageUr, {
            crossOrigin:"anonymous"
           })
           
           const imgAspectRatio = fabricImage.width / fabricImage.height
           const canvasAspectRatio = project.width / project.height
           const scale = imgAspectRatio > canvasAspectRatio ? project.width / fabricImage.width : project.height / fabricImage.height

                fabricImage.set({
                 left: project.width / 2,
                 top: project.height / 2,
                 originX: "center",
                 originY: "center",
                 scaleX: scale,
                 scaleY: scale,
                 selectable: true,
                 evented: true,
            });

      fabricImage.filters = [];
      canvasEditor.add(fabricImage);
      canvasEditor.centerObject(fabricImage);
      canvasEditor.setActiveObject(fabricImage);
      canvasEditor.requestRenderAll();

      const canvasJSON = canvasEditor.toJSON();
      await updateProject({
        projectId: project._id,
        canvasState: canvasJSON,
        currentImageUrl: project.originalImageUrl,
        activeTransformations: undefined,
        backgroundRemoved: false,
      });

      toast.success("Canvas reset to original image");
         } catch (error) {
            console.error("Error resetting canvas:", error);
            toast.error("Failed to reset canvas. Please try again.");
         }
 

    }
     const handleExport = async (exportConfig) => {
    if (!canvasEditor || !project) {
      toast.error("Canvas not ready for export");
      return;
    }

    // Check export limits for free users
    if (!canexport(user?.exportsThisMonth || 0)) {
      setrestrictedTool("export");
      setshowupgradeModel(true);
      return;
    }

    setIsExporting(true);
    setExportFormat(exportConfig.format);

    try {
      // Store current canvas state for restoration
      const currentZoom = canvasEditor.getZoom();
      const currentViewportTransform = [...canvasEditor.viewportTransform];

      // Reset zoom and viewport for accurate export
      canvasEditor.setZoom(1);
      canvasEditor.setViewportTransform([1, 0, 0, 1, 0, 0]);
      canvasEditor.setDimensions({
        width: project.width,
        height: project.height,
      });
      canvasEditor.requestRenderAll();

      // Export the canvas
      const dataURL = canvasEditor.toDataURL({
        format: exportConfig.format.toLowerCase(),
        quality: exportConfig.quality,
        multiplier: 1,
      });

      // Restore original canvas state
      canvasEditor.setZoom(currentZoom);
      canvasEditor.setViewportTransform(currentViewportTransform);
      canvasEditor.setDimensions({
        width: project.width * currentZoom,
        height: project.height * currentZoom,
      });
      canvasEditor.requestRenderAll();

      const link = document.createElement("a");
      link.download = `${project.title}.${exportConfig.extension}`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Image exported as ${exportConfig.format}!`);
    } catch (error) {
      console.error("Error exporting image:", error);
      toast.error("Failed to export image. Please try again.");
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

return(
<>
<div className='border-b px-6 py-3'>
        <div className='flex items-center justify-between mb-4'>
               <div className='flex items-center gap-4'>
                     <Button variant='ghost' onClick={handleBacktoDashboard}  className={ ` text-white hover:text-gray-300 `}>
                        <ArrowLeft className=' h-4 w-4 mr-2 '/>
                        All Projects
                     </Button>
               </div>
                 <h1 className="font-extrabold capitalize">{project.title}</h1>
                 <div className=' flex items-center gap-3'>

                  <Button variant='outline' size="sm" onClick={handleResertToOrigin} disabled={isSaving || !project.originalImageUrl} className='gap-2'>
                     {isSaving ? (
                        <>
                         <Loader2 className='h-4 w-4 animate-spin'/>
                         Saving...
                         </>
                     ):(
                      <>
                       <Save className='h-4 w-4'/>
                       Save
                      </>
                     )
                    }
                    </Button>
                       <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="glass"
                  size="sm"
                  disabled={isExporting || !canvasEditor}
                  className="gap-2"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Exporting {exportFormat}...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-slate-800 border-slate-700">
                <div className="px-3 py-2 text-sm text-white/70">
                  Export Resolution: {project.width} × {project.height}px
                </div>
                <DropdownMenuSeparator className="bg-slate-700" />
                {EXPORT_FORMATS.map((config, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleExport(config)}
                    className="text-white hover:bg-slate-700 cursor-pointer flex items-center gap-2">
                    <FileImage className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium">{config.label}</div>
                      <div className="text-xs text-white/50">
                        {config.format} • {Math.round(config.quality * 100)}%
                        quality
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-slate-700" />
                {isFree && (
                  <div className="px-3 py-2 text-xs text-white/50">
                    Free Plan: {user?.exportsThisMonth || 0}/20 exports this
                    month
                    {(user?.exportsThisMonth || 0) >= 20 && (
                      <div className="text-amber-400 mt-1">
                        Upgrade to Pro for unlimited exports
                      </div>
                    )}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
        </div>
        <div className='flex items-center justify-between'>
               <div className='flex items-center gap-2'> 
                      {TOOLS.map((tool)=>{
                        const Icon = tool.icon;
                        const isActive = activeTool === tool.id;
                        const handleAccess = hasAccess(tool.id)
                        return (
                            <Button key={tool.id} variant={isActive  ?  "default" : "ghost" } size="sm" onClick={()=> handleToolChange(tool.id)}
                             className={` gap-2 relative ${isActive ? "bg-blue-600 text-white hover:bg-blue-700" : " text-white hover:text-gray-300 hover:bg-gray-100 "}   ${ !handleAccess ? "opacity-60":" "}`}>
                                <Icon className='h-4 w-4'/>
                                {tool.label}
                                {tool.proOnly  && !handleAccess && (
                                <Lock className='h-3 w-3 text-amber-400'/>
                                )}
                            </Button>
                        )
                      })}
               </div>

        </div>
</div>
<UpgradeModel isOpen={showupgradeModel} onClose={()=>{
                setshowupgradeModel(false)
                setrestrictedTool(null)
             } } 
             restrictedTool={restrictedTool}
             reason={
                restrictedTool === "export"  ? "Free plan is limited to 20 exports per month. Upgrade to Pro for unlimited exports.": undefined
}/>
</>
)
}
export default EditorTopBar