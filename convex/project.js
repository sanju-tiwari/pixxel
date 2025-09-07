import { v } from "convex/values";
import { mutation } from "./_generated/server";
import {internal} from "./_generated/api"
import { query } from "./_generated/server";

export const create  = mutation({
    args:{
        title:v.string(),
        originalImageUrl:v.optional(v.string()),
        currentImageUrl:v.optional(v.string()),
        thumbnailUrl:v.optional(v.string()),
        width:v.number(),
        height:v.number(),
        canvasState:v.optional(v.any()) 
    },
    handler: async (ctx , args)=>{
        const user = await ctx.runQuery(internal.users.getCurrentUser);
       
        if(user.plan === "free"){
            const projectcount = await ctx.db
            .query("project")
            .withIndex("by_user" , (q)=> q.eq("userId" , user._id))
            .collect();

           if(projectcount.length >=3){
            throw new Error( "Free plan limited to 3 projects. Upgrade to Pro for unlimited projects.")
           }
        }

       const prodectId = await ctx.db.insert("project" , {
      title: args.title,
      userId: user._id,
      originalImageUrl: args.originalImageUrl,
      currentImageUrl: args.currentImageUrl,
      thumbnailUrl: args.thumbnailUrl,
      width: args.width,
      height: args.height,
      canvasState: args.canvasState,
      createdAt: Date.now(),
      updatedAt: Date.now(),
       } )

     await ctx.db.patch(user._id , {
        projectUsed:(user.projectUsed || 0) + 1,
        lastActiveAt:Date.now()
     } )
      
     return prodectId

    }

})

export const deleteProject = mutation({
  args: { projectId: v.id("project") },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (!user || project.userId !== user._id) {
      throw new Error("Access denied");
    }

    await ctx.db.delete(args.projectId);

    await ctx.db.patch(user._id, {
      projectUsed: Math.max(0, (user.projectsUsed ||0 ) - 1),
      lastActiveAt: Date.now(),
    });

    return { success: true };
  },
});

export const getProject = query({
  args: { projectId: v.id("project") },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (!user || project.userId !== user._id) {
      throw new Error("Access denied");
    }

    return project;
  },
});

export const getUserProjects = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    const project = await ctx.db
      .query("project")
      .withIndex("by_user_update", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return project;
  },
});

export const updateProject = mutation({
  args:{
    projectId:v.id("project"),
    canvasState:v.optional(v.any()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    currentImageUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    activeTransformations : v.optional(v.string()),
    backgroundRemoved: v.optional(v.boolean())
  },
  handler: async (ctx , args)=>{
       const user = await ctx.runQuery(internal.users.getCurrentUser)
       const project = await ctx.db.get(args.projectId)

       if(!project){
        throw new Error("Project not found")
       }

       const updatedDate = {
        updatedAt: Date.now()
       }
        
       if(args.canvasState !== undefined ) updatedDate.canvasState = args.canvasState;
        if(args.width !== undefined ) updatedDate.width = args.width;
        if(args.height !== undefined ) updatedDate.height = args.height;
        if(args.currentImageUrl !== undefined ) updatedDate.currentImageUrl = args.currentImageUrl;
        if(args.thumbnailUrl !== undefined ) updatedDate.thumbnailUrl = args.thumbnailUrl;
        if(args.activeTransformations !== undefined ) updatedDate.activeTrasformations = args.activeTrasformations ;
        if(args.backgroundRemoved !== undefined ) updatedDate.backgroundRemoved = args.backgroundRemoved;

        await ctx.db.patch(args.projectId , updatedDate)
  }
})