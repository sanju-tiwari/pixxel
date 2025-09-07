"use client"
import { Button } from '@/components/ui/button'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Trash2, Type } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useCanva } from '../../../../../../../context/context';
import { IText } from 'fabric';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';


const FONT_FAMILIES = [
  "Arial",
  "Arial Black",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Comic Sans MS",
  "Impact",
];

const FONT_SIZES = { min: 8, max: 120, default: 20 };


function TextControl() {
 const { canvasEditor } = useCanva();
  const [selectedText, setSelectedText] = useState(null);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(FONT_SIZES.default);
  const [textColor, setTextColor] = useState("#000000");
  const [textAlign, setTextAlign] = useState("left");
  const [_, setChanged] = useState(0);


  const addtext = ()=>{
    if(!canvasEditor) return 
    
    const text = new IText("Edit this text" , {
        left:canvasEditor.width/2,
        top: canvasEditor.height/2 ,
        originX:"center",
        originY:"center",
        fontFamily,
        fontSize:FONT_SIZES.default,
        fill:textColor,
        textAlign,
        editable:true,
        selectable:true
    })

    canvasEditor.add(text)
    canvasEditor.setActiveObject(text)
    canvasEditor.requestRenderAll()

    
    setTimeout(() => {
      text.enterEditing();
      text.selectAll();
    }, 100);

  }
    const deleteSelectedText = () => {
    if (!canvasEditor || !selectedText) return;
    canvasEditor.remove(selectedText);
    canvasEditor.requestRenderAll();
    setSelectedText(null);
  };
    const applyFontFamily = (family) => {
    if (!selectedText) return;
    setFontFamily(family);
    selectedText.set("fontFamily", family);
    canvasEditor.requestRenderAll();
  };

  const applyFontSize = (size) => {
    if (!selectedText) return;
    const newSize = Array.isArray(size) ? size[0] : size;
    setFontSize(newSize);
    selectedText.set("fontSize", newSize);
    canvasEditor.requestRenderAll();
  };

  const applyTextAlign = (alignment) => {
    if (!selectedText) return;
    setTextAlign(alignment);
    selectedText.set("textAlign", alignment);
    canvasEditor.requestRenderAll();
  };

  const applyTextColor = (color) => {
    if (!selectedText) return;
    setTextColor(color);
    selectedText.set("fill", color);
    canvasEditor.requestRenderAll();
  }
  
  useEffect(() => {
  if (!canvasEditor) return;

  const handleSelection = (e) => {
    const obj = e.selected[0];
    if (obj && obj.type === "i-text") {
      setSelectedText(obj);
    } else {
      setSelectedText(null);
    }
  };

  canvasEditor.on('selection:created', handleSelection);
  canvasEditor.on('selection:updated', handleSelection);

  return () => {
    canvasEditor.off('selection:created', handleSelection);
    canvasEditor.off('selection:updated', handleSelection);
  };
}, [canvasEditor]);


  return(
    <div className=' space-y-6 ' >
      <div className='space-y-4' >
          <div>
            <h3 className=' text-sm font-medium text-white mb-2 ' >
              Add Text
            </h3>
            <p className=' text-xs text-white/70 mb-4  ' >
            Click to add editable text to your canvas
            </p>
            <Button
            variant="primary"
            className='w-full'
            onClick={addtext}
            >
                <Type/> 
                Add Text
            </Button>
          </div>
             {selectedText && (
                <div className=' border-t border-white/10 pt-6  ' >
                   <h3 className=' text-sm font-medium text-white mb-4'>
                    Edit Selected Text
                   </h3>
                   <div className=' space-y-2 mb-4 ' >
                        <label className=' text-xs text-white/70'>Font Family</label>
                        <select value={fontFamily} onChange={(e)=>applyFontFamily(e.target.value)} className=' w-full px-3 py-2 bg-slate-700 border border-white/20 rounded text-white text-sm'>
                          {FONT_FAMILIES.map((text)=>(
                        <option key={text} value={text} >
                             {text}
                        </option>
                          ))}
                        </select>
                   </div>
                   <div className=' space-y-2 mb-4 ' >
                             <div className=' flex items-center justify-between  ' >
                                  <label className=' text-xs text-white/70 '>Font Size</label>
                                  <span>{fontSize}</span>
                             </div>
                             <Slider value={[fontSize]} onValueChange={applyFontSize} min={FONT_SIZES.min} max={FONT_SIZES.max} step={1} className={`w-full`}  />
                   </div>
                    <div className="space-y-2 mb-4">
            <label className="text-xs text-white/70">Text Alignment</label>
            <div className="grid grid-cols-4 gap-1">
              {[
                ["left", AlignLeft],
                ["center", AlignCenter],
                ["right", AlignRight],
                ["justify", AlignJustify],
              ].map(([align, Icon]) => (
                <Button
                  key={align}
                  onClick={() => applyTextAlign(align)}
                  variant={textAlign === align ? "default" : "outline"}
                  size="sm"
                  className="p-2"
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
             <div className="space-y-2 mb-4">
            <label className="text-xs text-white/70">Text Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => applyTextColor(e.target.value)}
                className="w-10 h-10 rounded border border-white/20 bg-transparent cursor-pointer"
              />
              <Input
                value={textColor}
                onChange={(e) => applyTextColor(e.target.value)}
                placeholder="#000000"
                className="flex-1 bg-slate-700 border-white/20 text-white text-sm"
              />
            </div>
          </div>
            <Button
            onClick={deleteSelectedText}
            variant="outline"
            className="w-full text-red-400 border-red-400/20 hover:bg-red-400/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Text
          </Button>
        </div>
             )}   
      </div>
        <div className="bg-slate-700/30 rounded-lg p-3">
        <p className="text-xs text-white/70">
          <strong>Double-click</strong> any text to edit it directly on canvas.
          <br />
          <strong>Select</strong> text to see formatting options here.
        </p>
      </div>
    </div>
  )
}

export default TextControl
