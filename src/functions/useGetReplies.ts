import { useQuery } from "@tanstack/react-query";
import { getReply } from "../api";

function useGetReply(id, subreddit, threadId, threadTitle) {
  const replies = useQuery({
    queryKey: ["comment", id],
    queryFn: () => getReply(subreddit, threadId, threadTitle, id),
  });
  return replies;
}

export default useGetReply;
