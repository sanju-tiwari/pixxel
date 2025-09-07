import React, { useEffect, useRef, useState } from 'react'
import { useCanva } from '../../../../../../context/context'
import { useConvexMutation } from '../../../../../../hooks/use-convex'
import { api } from '../../../../../../convex/_generated/api'
import { Loader2 } from 'lucide-react'
import { Canvas, FabricImage } from 'fabric'

function Canvaproject({project}) {
    const [loading , setloading] = useState(true)
    const canvaRef = useRef()
    const containerRef = useRef()
    const {canvasEditor , setcanvaEditor , setprocessingMessage , onToolchange , processingMessage ,activeTool} = useCanva()
    const {mutate: updateProject} = useConvexMutation( api.project.updateProject) 
      
     const calculateViewportScale = ()=>{
        if(!containerRef.current || !project) return 1
       const container = containerRef.current
       const containerWidth = container.clientWidth - 40 
       const containerHeight = container.clientHeight - 40 
       const scaleX = containerWidth / project.width
       const scaleY = containerHeight / project.height
       return Math.min(scaleX,scaleY,1) 
     }

     useEffect(()=>{
        if(!canvaRef || !project || canvasEditor ) return
             
        const initializeCanvas = async()=>{
        setloading(true)
        const viewportScale = calculateViewportScale()
        const canvas = new Canvas(canvaRef.current , {
            height:project.height,
            width:project.width,
            backgroundColor:"#ffffff",
            preserveObjectStacking:true,
            controlsAboveOverlay:true,
            selection:true,
            hoverCursor:"move",
            moveCursor:"move",
            defaultCursor:"default",
            allowTouchScrolling:false,
            renderOnAddRemove:true,
            skipTargetFind:false  
        })

         canvas.setDimensions(
            {
                width:project.width * viewportScale ,
                height:project.height * viewportScale
            },
            {backstoreOnly : false}
         )
          
         canvas.setZoom(viewportScale)

         const scaleFactor = window.devicePixelRatio || 1
         if(scaleFactor > 1 ){
            canvas.getElement().width = project.width * scaleFactor
            canvas.getElement().height = project.height * scaleFactor
            canvas.getContext().scale(scaleFactor , scaleFactor )  
         }
         if(project.currentImageUrl || project.originalImageUrl){
            try {
                const imageUrl = project.currentImageUrl || project.originalImageUrl
                const fabricImage = await FabricImage.fromURL(imageUrl , {
                    crossOrigin : "anonymous"
                })
                const imgAspectRatio = fabricImage.width / fabricImage.height
                const canvasAspectratio = project.width / project.height
                let scaleX , scaleY
                 
                if(imgAspectRatio > canvasAspectratio ){
                    scaleX = project.width / fabricImage.width
                    scaleY = scaleX
                }else{
                      scaleY = project.height / fabricImage.height
                      scaleX = scaleY
                }
                
                fabricImage.set({
                    left: project.width / 2 ,
                    top: project.height / 2 ,
                    originX : "center",
                    originY: "center",
                    scaleX,
                    scaleY,
                    selectable: true,
                    evented: true,
                       
                })
                canvas.add(fabricImage)
                canvas.centerObject(fabricImage)
            } catch (error) {
                console.log("Error loading project image" , error )
            }
         }
         
         if(project.canvasState){
          try {
            await canvas.loadFromJSON(project.canvasState)
            canvas.requestRenderAll()
          } catch (error) {
            console.log("Error loading canvas state" , error )
          }
         }
         canvas.calcOffset()
         canvas.requestRenderAll()
         setcanvaEditor(canvas)

         setTimeout(() => {
           window.dispatchEvent(new Event("resize"))
         }, 500);

                setloading(false)   
        }

         initializeCanvas()
           return ()=>{
          if(canvasEditor){
            canvasEditor.dispose()
            setcanvaEditor(null)
          }
         }
     } , [project])

const saveCanvaState = async()=>{
    if(!canvasEditor || !project) return
    try {
       const canvaJSON = canvasEditor.toJSON()
              await updateProject({
                projectId:project._id,
                canvasState: canvaJSON
              })
            } catch (error) {
              console.error("Error saving canvas state" , error)
            }
     } 
  useEffect(() => {
    if (!canvasEditor) return;
    let saveTimeout;
    const handleCanvasChange = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
         saveCanvaState();
      }, 2000);
    };

    canvasEditor.on("object:modified", handleCanvasChange);
    canvasEditor.on("object:added", handleCanvasChange);
    canvasEditor.on("object:removed", handleCanvasChange);

    return () => {
      clearTimeout(saveTimeout);
      canvasEditor.off("object:modified", handleCanvasChange);
      canvasEditor.off("object:added", handleCanvasChange);
      canvasEditor.off("object:removed", handleCanvasChange);
    };
  }, [canvasEditor]);

  useEffect(() => {
    if (!canvasEditor) return;

    switch (activeTool) {
      case "crop":
        canvasEditor.defaultCursor = "crosshair";
        canvasEditor.hoverCursor = "crosshair";
        break;
      default:
        canvasEditor.defaultCursor = "default";
        canvasEditor.hoverCursor = "move";
    }
  }, [canvasEditor, activeTool]);

  useEffect(() => {
    const handleResize = () => {
      if (!canvasEditor || !project) return;

      const newScale = calculateViewportScale();
      canvasEditor.setDimensions(
        {
          width: project.width * newScale,
          height: project.height * newScale,
        },
        { backstoreOnly: false }
      );
      canvasEditor.setZoom(newScale);
      canvasEditor.calcOffset();
      canvasEditor.requestRenderAll();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvasEditor, project]);

  useEffect(() => {
    if (!canvasEditor || !onToolchange) return;

    const handleSelection = (e) => {
      const selectedObject = e.selected?.[0];
      if (selectedObject && selectedObject.type === "i-text"){
        onToolchange("text");
      }
    };

    canvasEditor.on("selection:created", handleSelection);
    canvasEditor.on("selection:updated", handleSelection);

    return () => {
      canvasEditor.off("selection:created", handleSelection);
      canvasEditor.off("selection:updated", handleSelection);
    };
  }, [canvasEditor, onToolchange]);
     
  return (
 <div 
  ref={containerRef} 
  className="relative flex items-center h-full justify-center bg-secondary overflow-hidden "
    style={{
    width: 'calc(90vw - 300px)',
  }}
  >
  <div className="absolute inset-0 opacity-10 pointer-events-none"
    style={{
      backgroundImage:`
        linear-gradient(45deg, #64748b 25%, transparent 25%),
        linear-gradient(-45deg, #64748b 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #64748b 75%),
        linear-gradient(-45deg, transparent 75%, #64748b 75%)`,
      backgroundSize: "20px 20px",
      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
    }}
  />
   
    {loading &&(
    <div className=' inset-0 absolute flex items-center justify-center bg-slate-800/70 z-10  ' >
     <div className=' flex flex-col items-center gap-4 ' >
         <Loader2 className=' animate-spin w-8 h-8 ' /> {' '}
         <p className=' text-white/70 text-sm '>
            Loading canvas...
         </p>
     </div>
    </div>
  )}

  <div className="h-full flex items-center justify-center px-5">
  <canvas 
      id="canvas" 
      ref={canvaRef} 
      className="border"
    />
  </div>
</div>
)
}
export default Canvaproject
