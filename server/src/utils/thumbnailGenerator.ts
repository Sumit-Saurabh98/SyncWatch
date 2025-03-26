import { thumbnailExtractor } from "./thumbnailExtractor.js";
import { videoIdExtractor } from "./videoIdExtractor.js";

export const thumbnailGenerator = (url: string):{default:string,medium:string,high:string,standard:string,maxResolution:string} => {
    
    const videoId = videoIdExtractor(url);

   if(videoId){
    const thumbnails = thumbnailExtractor(videoId);
    return thumbnails;
   }

   return {
    default: "",
    medium: "",
    high: "",
    standard: "",
    maxResolution: ""
   }
};