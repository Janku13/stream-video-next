import fs from 'fs'

export function chunkVideo(videoPath: string, range: string, chunkSizeInBts: number) {
  const videoSizeInBytes = fs.statSync(videoPath).size
  const chunkStart = Number(range.replace(/\D/g, ""))
  console.log('start', chunkStart)
  
  const chunkEnd = Math.min(
    chunkStart + chunkSizeInBts,
    videoSizeInBytes - 1
  )
  const contentLength = chunkEnd - chunkStart + 1
  const headers = {
    "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${videoSizeInBytes}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type":"video/mp4"
  }
  return {
    headers,
    chunkStart,
    chunkEnd
  }
}
