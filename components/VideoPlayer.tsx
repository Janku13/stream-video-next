const VideoPlayer = ({id}:{id:string}) => {
  return (
    <video src={`/api/videos?videoId=${id}`} width="80%" height="auto" controls autoPlay id="video-player"/>
  );
}

export default VideoPlayer;