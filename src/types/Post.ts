export default interface Post {
  user: {
    name: string | null;
  };
  id: string;
  upvotedBy: {
    id: string;
  }[];
  body: string;
  title: string;
}
