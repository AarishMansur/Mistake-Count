export default function VoteButton({postId}: {postId: string}) {
  return (
    <button onClick={() => console.log('Vote for post', postId)}>
      Vote
    </button>
  );
}