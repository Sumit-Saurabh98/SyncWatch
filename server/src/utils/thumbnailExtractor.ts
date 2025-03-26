export const thumbnailExtractor = (videoId:string):{default:string,medium:string,high:string,standard:string,maxResolution:string} =>{
    return {
        default: `https://img.youtube.com/vi/${videoId}/default.jpg`,      // 120x90
        medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,     // 320x180
        high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,       // 480x360
        standard: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,   // 640x480
        maxResolution: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`  // 1280x720
    };
  }