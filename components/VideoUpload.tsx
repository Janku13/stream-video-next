import React, { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

export default function VideoUpload() {
  const [file,setFile] = useState<File|undefined>()
  const [progress,setProgress] = useState(0)
  const [error,setError] = useState<string|null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    const data = new FormData() 
    if (!file) return
    setSubmitting(true)
    data.append('file', file)
    const config : AxiosRequestConfig = {
      onUploadProgress: function (progressEvent) {
        const percentComplete = Math.round((progressEvent*100)/progressEvent.total)
        setProgress(percentComplete)
      }
    }
    try {
        await axios.post("/api/videos",data,config)
    } catch (e:any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
      setProgress(0)
    }
  }

  function handleSetFile(event:React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (files?.length) {
      setFile(files[0])
    }
  }
  return (
    <div>
      {error && <p>{error}</p>}
      {submitting && <p>{progress}%</p>}
      <form action="POST">
        <div style={{display:'grid'}}>
          <label style={{marginTop:'10px',textAlign:'center'}} htmlFor="file">File</label>
          <input style={{margin:'10px'}} type="file" id='file' accept=".mp4" onChange={handleSetFile}/>
        </div>
      </form>
      <button style={{margin:'20px'}} onClick={handleSubmit}>Upload Video</button>
    </div>
  );
}