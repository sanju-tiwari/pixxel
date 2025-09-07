import { Crop, Expand, Eye, Maximize2, Palette, Sliders, Text } from 'lucide-react';
import React from 'react'
import { useCanva } from '../../../../../../context/context';
import CropContext from './_tool/CropContext';
import ResizeControl from './_tool/ResizeControl ';
import Adjustment from './_tool/adjustment';
import BackgroundControl from './_tool/backgroundRemover';
import TextControl from './_tool/text';
import EditingControl from './_tool/editing';

  const TOOL_CONFIGS = {
  resize: {
    title: "Resize",
    icon: Expand,
    description: "Change project dimensions",
  },
  crop: {
    title: "Crop",
    icon: Crop,
    description: "Crop and trim your image",
  },
  adjust: {
    title: "Adjust",
    icon: Sliders,
    description: "Brightness, contrast, and more (Manual saving required)",
  },
  background: {
    title: "Background",
    icon: Palette,
    description: "Remove or change background",
  },
  text: {
    title: "Add Text",
    icon: Text,
    description: "Customize in Various Fonts",
  },
  ai_edit: {
    title: "AI Editing",
    icon: Eye,
    description: "Enhance image quality with AI",
  },
};

export const EditorSlidebar = ({project})=> {
  const { activeTool } = useCanva()
  const toolConfig = TOOL_CONFIGS[activeTool];
  if (!toolConfig) {
    return null;
  }

  const Icon = toolConfig.icon;

  return (
    <div className=' min-h-96 border-r flex flex-col w-[30rem] '>
      <div className=' p-4 border-b'>
          <div className=' flex items-center gap-3'>
              <Icon className=' h-5 w-5 text-white'/>
              <h2 className=' text-lg font-semibold text-white'>
                {toolConfig.title}
              </h2>
          </div>
          <p className='text-sm text-white mt-1'>
              {toolConfig.description}        
          </p>
      </div>     
         <div className="flex-1 p-4 overflow-y-scroll">
        {renderToolContent(activeTool, project)}
      </div>
    </div>
  )
}

function renderToolContent(activeTool , project ){
  switch(activeTool){
    case "crop":
    return <CropContext/>
    case "resize":
    return <ResizeControl project={project} />
    case "adjust":
    return <Adjustment />  
    case "background":
    return < BackgroundControl project={project} />
    case "text":
    return <TextControl project={project}/>
    case "ai_edit":
    return < EditingControl project={project} />
    default:
    return <div className=' text-white '> Selected a tool to get started </div> 
  }
}

