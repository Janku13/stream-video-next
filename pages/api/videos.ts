// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import busboy from 'busboy'
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'

export const config = {
  api: {
    bodyParser:false,
  }
}

const fileId = uuidv4()

function uploadVideoStream(req:NextApiRequest, res:NextApiResponse) {
  const bb = busboy({ headers: req.headers })
    setTimeout(() => { }, 10000)
  bb.on('file', (_, file, info) => {
    console.log(file)
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


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method
  if (method === 'GET') {
    return res.status(200).json({ name: 'Mohamed' })
  }
  if (method === 'POST') {
    return uploadVideoStream(req,res)
  }
  return res.status(405).json({error:`Method ${method} in not allowed`})
}
