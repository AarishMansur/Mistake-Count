import VoteButton from "./VoteButton"

export default function PostCard({post}:any){
  
     if(!post) return null;
  return(
    <div>

      <h3>{post.title}</h3>

      <p>{post.content}</p>

      <p>{post.author?.role}</p>

      <VoteButton postId={post.id} />

    </div>
  )
}