'use client'

import React, { useState } from 'react'
import { useCanva } from '../../../../../../../context/context';
import { Button } from '@/components/ui/button';
import { Download, ImageIcon, Loader2, Palette, Search, Trash2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { Input } from '@/components/ui/input';
import { FabricImage } from 'fabric';
import { HexColorPicker } from "react-colorful";
import { Alert } from '@/components/ui/alert';

const UNSPLASH_ACCESS_KEY=process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
const UNSPLASH_API_URL= "https://api.unsplash.com" 

function BackgroundControl({project}) {
  const { canvasEditor , setcanvaEditor , setprocessingMessage , onToolchange , processingMessage ,activeTool } = useCanva();
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [searchQuery, setSearchQuery] = useState("");
  const [unsplashImages, setUnsplashImages] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);


  const getMainImage = ()=>{
    if(!canvasEditor) return null 
    const object = canvasEditor.getObjects()
    return object.find((obj) => obj.type === "image") || null
  }

 const handleBackgroundRemoval = async()=>{
     const mainImage = getMainImage();
     if(!mainImage || !project) return  
         
   setprocessingMessage("Removing background with AI...")
   try {
     const currentImageUrl = project.currentImageUrl || project.originalImageUrl
     const bgRemover = currentImageUrl.includes("ik.imagekit.io") ? `${currentImageUrl.split("?")[0]}?tr=e-bgremove` : currentImageUrl;
     const processedImage = await FabricImage.fromURL(bgRemover  , {
      crossOrigin:"anonymous"
     })
     
      const currentProps = {
        left: mainImage.left,
        top: mainImage.top,
        scaleX: mainImage.scaleX,
        scaleY: mainImage.scaleY,
        angle: mainImage.angle,
        originX: mainImage.originX,
        originY: mainImage.originY,
      };

      canvasEditor.remove(mainImage);
      processedImage.set(currentProps);
      canvasEditor.add(processedImage);
      processedImage.setCoords();
      canvasEditor.setActiveObject(processedImage);
      canvasEditor.calcOffset();
      canvasEditor.requestRenderAll();
   } catch (error) {
      console.error("Error removing background:", error);
      Alert("Failed to remove background. Please try again.");
   }finally{
       setprocessingMessage(null);
   }
   
 

    if (!canvasEditor) {
    return (
      <div className="p-4">
        <p className="text-white/70 text-sm">Canvas not ready</p>
      </div>
    );
  }
 }
  const searchUnsplashImages =async()=>{
    if(!searchQuery.trim() || !UNSPLASH_ACCESS_KEY ) return 
    setIsSearching(true)
    try {
     const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=12`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to search images");
      const data = await response.json();
      setUnsplashImages(data.results || []);
    } catch (error) {
     console.error("Error searching Unsplash:", error);
      alert("Failed to search images. Please try again.");
    } finally {
      setIsSearching(false);
    }
      
    
  } 
   const handleColorBackground = () => {
    if (!canvasEditor) return;

    // In Fabric.js 6.7, set property directly and render
    canvasEditor.backgroundColor = backgroundColor;
    canvasEditor.requestRenderAll();
  };
    const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      searchUnsplashImages();
    }
  };
  const handleRemoveBackground = () => {
    if (!canvasEditor) return;

    // Clear both background color and image
    canvasEditor.backgroundColor = null;
    canvasEditor.backgroundImage = null;
    canvasEditor.requestRenderAll();
  };
  const handleImageBackground = async(imageUrl , imageId)=>{
       if(!canvasEditor) return 
       
       setSelectedImageId(imageId)
       try {
          if (UNSPLASH_ACCESS_KEY) {
        fetch(`${UNSPLASH_API_URL}/photos/${imageId}/download`, {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }).catch(() => {}); 
      }
      const fabricImage = await FabricImage.fromURL(imageUrl, {
        crossOrigin: "anonymous",
      });

      // USE PROJECT DIMENSIONS instead of canvas dimensions for proper scaling
      const canvasWidth = project.width; // Logical canvas width
      const canvasHeight = project.height; // Logical canvas height

      // Calculate scales
      const scaleX = canvasWidth / fabricImage.width;
      const scaleY = canvasHeight / fabricImage.height;

      const scale = Math.max(scaleX, scaleY);

      fabricImage.set({
        scaleX: scale,
        scaleY: scale,
        originX: "center",
        originY: "center",
        left: canvasWidth / 2, // Use project dimensions
        top: canvasHeight / 2, // Use project dimensions
      });

      canvasEditor.backgroundImage = fabricImage;
      canvasEditor.requestRenderAll();
      setSelectedImageId(null);

      console.log("Background set:", {
        imageSize: `${fabricImage.width}x${fabricImage.height}`,
        canvasSize: `${canvasWidth}x${canvasHeight}`,
        scale: scale,
        finalSize: `${fabricImage.width * scale}x${fabricImage.height * scale}`,
      });
       } catch (error) {
         console.error("Error setting background image:", error);
           alert("Failed to set background image. Please try again.");
           setSelectedImageId(null);
       }
  }

  return (
    <div className='space-y-6 relative h-full'>
     <div className=' space-y-4 pb-4 border-b border-white/10'>
        <div>
           <h3 className=' text-sm font-medium text-white mb-2  ' >
                 Al Background Removal
           </h3>
              <p className=' text-xs text-white/70 mb-4'>
                Automatically remove the background from your image using AI
              </p>
        </div>
        <Button variant='primary' className='w-full' onClick={handleBackgroundRemoval}  disabled={processingMessage || !getMainImage()} >
             <Trash2 className=' h-4 w-4 mr-2 '/>
             Remove Image Baclground
        </Button>
          {!getMainImage() && (
          <p className="text-xs text-amber-400">
            Please add an image to the canvas first to remove its background
          </p>
        )}
     </div>
     <Tabs className='w-full' defaultValue='color'>
        <TabsList className=' grid w-full grid-cols-2 bg-slate-700/50'>
                 <TabsTrigger value='color' className=' data-[slate=active]:bg-cyan-500 data-[slate=active]:text-white'>
                        <Palette className='h-4 w-4 mr-2'/>
                             Color
                 </TabsTrigger>
                 <TabsTrigger value='image' className=' data-[state=active]:bg-cyan-500 data-[slate=active]:text-white'>
                     <ImageIcon className="h-4 w-4 mr-2" />
                        Image
                 </TabsTrigger>
        </TabsList>
        <TabsContent value='color' className='space-y-4 mt-6'>
            <div>
                <h3 className=' text-sm font-medium text-white mb-2 '>
                    Solid Color Background
                </h3>
                <p className='text-xs text-white/70 mb-4'>
                    Choose a solid color for your canvas background     
                </p>
            </div>
            <div className='space-y-4'>
              <HexColorPicker
              color={backgroundColor}
              onChange={setBackgroundColor}
              style={{ width: "100%" }}
            />
            <div className='flex items-center gap-2'>
                 <Input value={backgroundColor} onChange={(e)=> setBackgroundColor(e.target.value)}  placeholder="#ffffff"
                className="flex-1 bg-slate-700 border-white/20 text-white" />
                <div className=' w-10 h-10 rounded border border-white/20 ' style={{backgroundColor}} />
            </div>
            <Button onClick={handleColorBackground } className=' w-full ' variant='primary'>
                <Palette className=' h-4 w-4 mr-2 '/>
                Apply Color
            </Button>
            </div>
        </TabsContent>
        <TabsContent value='image' className=' space-y-4 mt-6'>
            <div>
                <h3 className=' text-sm font-medium text-white mb-2 '>
                    Image Background
                </h3> 
                <p className=' text-xs text-white/70 mb-4 '>
                    Search and use high-quality images from Unsplash
                </p>
            </div>
            <div className=' flex gap-2'>
               <Input  value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              placeholder="Search for backgrounds..."
              className="flex-1 bg-slate-700 border-white/20 text-white" />
              <Button 
              onClick={searchUnsplashImages}
              disabled={isSearching || !searchQuery.trim()}
              variant="primary"
              >
                     {isSearching ? (
                        <Loader2 className=' h-4 w-4 animated-spin '/>
                     ) : (
                        <Search  className='h-4 w-4 '/>
                     ) }
              </Button>
            </div>
            {unsplashImages?.length > 0 && (
                <div className=' space-y-3'>
                    <h4 className=' text-sm font-medium text-white ' >
                          Search Results ({unsplashImages?.length})
                    </h4>
                  <div className=' grid grid-cols-2 gap-3 max-h-96 overflow-y-auto'>
                    {unsplashImages.map((image) => (
                        <div key={image.id} className=' relative group cursor-pointer rounded-lg overflow-hidden border border-white/10 hover:border-cyan-400 transition-colors '  onClick={ ()=> handleImageBackground(image.urls.regular, image.id)} >

                           <img src={image.urls.small} alt={image.alt_description || "Background image"} className=' w-full h-24 object-cover ' />     
                         {selectedImageId === image.id && (
                          <div className=' absolute inset-0 bg-black/50 flex items-center justify-center   ' >
                                  <Loader2 className=' h-5 w-5 animate-spin text-white ' />
                          </div>
                         )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Download className="h-5 w-5 text-white" />
                    </div>
                        </div>
                        
                    ))}
                  </div>
                </div>
            )}
            

           {!isSearching && unsplashImages?.length===0  && searchQuery && (
                     <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/70 text-sm">
                No images found for "{searchQuery}"
              </p>
              <p className="text-white/50 text-xs">
                Try a different search term
              </p>
            </div>

           )}
            {!searchQuery && unsplashImages?.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/70 text-sm">
                Search for background images
              </p>
              <p className="text-white/50 text-xs">Powered by Unsplash</p>
            </div>
          )}
        </TabsContent>
    </Tabs>     
        <div className="pt-4 border-t border-white/10 bottom-0 w-full">
        <Button
          onClick={handleRemoveBackground}
          className="w-full"
          variant="outline"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Canvas Background
        </Button>
      </div>
    </div>
  )
}

export default BackgroundControl
