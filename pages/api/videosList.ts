import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'

function getListOfVideos(req: NextApiRequest, res: NextApiResponse) {
  const directoryPath = './videos'
  fs.readdir(directoryPath, (err,files) => {
    if (err) {
    return res.status(400).json({error:err});
    } 
    res.status(200).json({files})
  })
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method
  if (method === 'GET') {
    return getListOfVideos(req,res)
  }
  return res.status(405).json({error:`Method ${method} in not allowed`})
}
