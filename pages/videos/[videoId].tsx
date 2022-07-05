import { GetServerSideProps } from 'next'
import Link from 'next/link'
import VideoPlayer from "../../components/VideoPlayer";
import { useRouter } from 'next/router'
import styles from '../../styles/Home.module.css'

function VideoPage() {
  const router = useRouter()
  const { videoId } = router.query as { videoId: string }
  
  return (
    <div className={styles.main}>
      <VideoPlayer id={videoId} />
      <div style={{marginTop:'20px'}}>
       <Link href="/" >
        <a> Upload more videos</a>
        </Link>
      </div>
    </div>
  );
}




export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // const { data } = await  // your fetch function here   
  return {
    props: {
      query:ctx.query
    }
  }
}
export default VideoPage;