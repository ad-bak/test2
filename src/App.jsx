import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const POSTS = [
  { id: 1, title: "First Post", body: "Hello world!" },
  { id: 2, title: "Second Post", body: "Hello again!" },
];

function App() {
  const queryClient = useQueryClient();
  const postQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => wait(1000).then(() => [...POSTS]),
  });

  const newPostMutation = useMutation({
    mutationFn: (title, body) => {
      return wait(1000)
        .then(() =>
          POSTS.push({
            id: crypto.randomUUID(),
            title,
            body,
          })
        )
        .then(() => console.log(POSTS));
    },
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });

  if (postQuery.isLoading) {
    return <>Loading...</>;
  }

  if (postQuery.isError) {
    return <pre>{JSON.stringify(postQuery.error, null, 2)}</pre>;
  }

  return (
    <>
      {postQuery.data.map((post) => (
        <div key={post.id}>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
        </div>
      ))}
      <button
        disabled={newPostMutation.isLoading}
        onClick={() => newPostMutation.mutate("New Post", "Body")}
      >
        Add Post
      </button>
    </>
  );
}

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;
