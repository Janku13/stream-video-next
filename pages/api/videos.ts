import type { NextApiRequest, NextApiResponse } from 'next'
import busboy from 'busboy'
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'
import { chunkVideo } from './utils/videoHelper';

export const config = {
  api: {
    bodyParser:false,
  }
}

const fileId = uuidv4() //generate an id for each file
const CHUNK_SIZE_IN_BYTES = 1000000 //1mb

function uploadVideoStream(req:NextApiRequest, res:NextApiResponse) {
  const bb = busboy({ headers: req.headers })
  bb.on('file', (_, file, info) => {
    const fileName = `${fileId}${info.filename}`
    const filePath = `./videos/${fileName}`
    const stream = fs.createWriteStream(filePath)
    file.pipe(stream)
    
  })

  bb.on('close', () => {
    res.writeHead(200, { Connection: "close" });
    res.end('Finished uploading')
  })
  req.pipe(bb)
  return
}

function getVideo(req:NextApiRequest, res:NextApiResponse) {
  const range = req.headers.range
  if (!range) {
    return res.status(400).send('Range must be provided')
  }
  console.log('range',range);
  
  const videoId = req.query.videoId
  const videoPath = `./videos/${videoId}.mp4`
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Cannot find videos')
  }
  const { chunkEnd, chunkStart, headers } = chunkVideo(videoPath, range, CHUNK_SIZE_IN_BYTES) //helper function
  
  res.writeHead(206, headers)
  const videoStream = fs.createReadStream(videoPath, {
    start: chunkStart,
    end:chunkEnd
  })
  videoStream.pipe(res)
}


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method
  if (method === 'GET') {
    return getVideo(req,res)
  }
  if (method === 'POST') {
    return uploadVideoStream(req,res)
  }
  return res.status(405).json({error:`Method ${method} in not allowed`})
}
