import axios from "axios";

export async function getThreads(options) {
  const { sort = "hot", subredditName, query, after } = options;
  const baseURL = "https://www.reddit.com";
  let URL;
  if (subredditName) {
    if (sort) {
      URL = `/r/${subredditName}/${sort}.json`;
    } else {
      URL = `/r/${subredditName}.json`;
    }
  } else if (query) {
    URL = `/search.json?q=${query}&sort=${sort}`;
  } else {
    URL = `/${sort}.json`;
  }

  if (after) {
    if (query) {
      URL = `${URL}&after=${after}`;
    } else {
      URL = `${URL}?after=${after}`;
    }
  }

  const response = await axios.get(baseURL + URL);
  return {
    threads: response.data.data.children,
    after: response.data.data.after,
    query,
    subredditName,
  };
}

export async function getInfiniteThreads({
  after,
  sort = "hot",
  subredditName,
  query,
  time,
}) {
  const baseURL = "https://www.reddit.com";
  const conditionalAfter = after ? "after=" + after : "";
  const conditionalTime = time ? "&t=" + time : "";
  let URL;
  if (subredditName) {
    if (sort) {
      URL = `/r/${subredditName}/${sort}.json?${conditionalAfter}${conditionalTime}`;
    } else {
      URL = `/r/${subredditName}.json?${conditionalAfter}${conditionalTime}`;
    }
  } else if (query) {
    URL = `/search.json?q=${query}&sort=${sort}&${conditionalAfter}${conditionalTime}`;
  } else {
    URL = `/${sort}.json?${conditionalAfter}${conditionalTime}`;
  }

  const response = await axios.get(baseURL + URL);
  return {
    threads: response.data.data.children,
    after: response.data.data.after,
    query,
    subredditName,
  };
}
export async function getInfiniteComment({
  subreddit,
  threadId,
  threadTitle,
  ids,
}) {
  const responses = await Promise.allSettled(
    ids.map(async (id) => await getReply(subreddit, threadId, threadTitle, id))
  ).catch((e) => {
    throw e;
  });
  return responses;
}

export async function getThread(subreddit, id, sort = "hot") {
  const baseURL = "https://www.reddit.com";
  const url = `/r/${subreddit}/comments/${id}.json?sort=${sort}`;
  const response = await axios.get(baseURL + url);
  return {
    thread: response.data[0].data.children[0].data,
    comments: response.data[1].data.children,
  };
}

export async function getReply(subreddit, threadId, threadTitle, replyId) {
  const url = `https://www.reddit.com/r/${subreddit}/comments/${threadId}/${threadTitle}/${replyId}.json`;
  const response = await axios.get(url);
  return response.data[1].data.children[0].data;
}
