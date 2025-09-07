
import { defineSchema, defineTable } from "convex/server";
import {v} from "convex/values";

export default defineSchema({
    users: defineTable({
  name: v.string(),
  email: v.string(),
  tokenIdentifier: v.string(),
  imageUrl:v.optional(v.string()),
  plan:v.union(v.literal("free"), v.literal("pro")),
  createdAt: v.number(),
  lastActiveAt: v.number(),
  projectUsed:v.number(),
   exportedThisMonth:v.number(),
}).index("by_token", ["tokenIdentifier"]).
   index("by_email", ["email"]).
   searchIndex("search_name" , {searchField :"name"} ).
   searchIndex("search_email" , {searchField :"email"} ),
  
   project:defineTable({
      title:v.string(),
      userId:v.string("users"),
      canvasState:v.any(),
      width:v.number(),
      height:v.number(),
      originalImageUrl:v.optional(v.string()),
      currentImageUrl:v.optional(v.string()),
      thumbnailUrl:v.optional(v.string()),
      activeTrasformations:v.optional(v.string()),
      backgroundRemoved:v.optional(v.boolean()),
      folderId:v.optional(v.id("folders")),
      createdAt:v.number(),
      updatedAt:v.number(),
   }).index( "by_user", ["userId"]).
   index("by_folder", ["folderId"]).
   index("by_user_update",["userId","updatedAt"]),

   folder:defineTable({
     name:v.string(),
     userId:v.string("users"),
      createdAt:v.number(),
   }).index("by_user", ["userId"])

})