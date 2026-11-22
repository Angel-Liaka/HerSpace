
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import { Heart, MessageCircle, Send, Trash2 } from "lucide-react";

const reactions = [
  { field: "hearts", emoji: "❤️", label: "Love" },
  { field: "hugs", emoji: "🤗", label: "Support" },
  { field: "likes", emoji: "💗", label: "Like" },
];

export default function HerCircle({ user }) {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const postsQuery = query(
      collection(db, "communityPosts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        setPosts(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );
      },
      () => setError("Could not load community posts.")
    );

    return unsubscribe;
  }, []);

  async function createPost(event) {
    event.preventDefault();

    if (!message.trim()) return;

    try {
      await addDoc(collection(db, "communityPosts"), {
        text: message.trim(),
        authorId: user.uid,
        authorName: user.displayName || user.email,
        createdAt: serverTimestamp(),
        hearts: [],
        hugs: [],
        likes: [],
        comments: [],
      });

      setMessage("");
      setError("");
    } catch {
      setError("Could not publish your post. Please try again.");
    }
  }

  async function reactToPost(post, field) {
    const currentUsers = post[field] || [];
    const alreadyReacted = currentUsers.includes(user.uid);

    try {
      await updateDoc(doc(db, "communityPosts", post.id), {
        [field]: alreadyReacted
          ? arrayRemove(user.uid)
          : arrayUnion(user.uid),
      });
    } catch {
      setError("Could not save your reaction.");
    }
  }

  async function addComment(post) {
    const text = (comments[post.id] || "").trim();

    if (!text) return;

    const newComment = {
      text,
      authorId: user.uid,
      authorName: user.displayName || user.email,
      createdAt: new Date().toISOString(),
    };

    try {
      await updateDoc(doc(db, "communityPosts", post.id), {
        comments: arrayUnion(newComment),
      });

      setComments((previous) => ({
        ...previous,
        [post.id]: "",
      }));
      setError("");
    } catch {
      setError("Could not add your comment.");
    }
  }

  async function removePost(post) {
    if (post.authorId !== user.uid) return;

    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "communityPosts", post.id));
    } catch {
      setError("Could not delete your post.");
    }
  }

  function displayDate(timestamp) {
    if (!timestamp?.toDate) return "Just now";
    return timestamp.toDate().toLocaleString();
  }

  return (
    <section className="community-page">
      <div className="page-heading">
        <p className="eyebrow">YOUR COMMUNITY</p>
        <h2>HerCircle♡</h2>
        <p>Share, connect and support one another.</p>
      </div>

      {error && <p className="message error">{error}</p>}

      <form className="community-compose" onSubmit={createPost}>
        <h3>Share something with the community</h3>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write a message, share an experience or encourage someone..."
          rows="4"
          maxLength="1000"
        />

        <button className="primary-button" type="submit">
          <Send size={16} /> Share post
        </button>
      </form>

      <div className="community-posts">
        {posts.length === 0 ? (
          <p className="empty-message">
            No posts yet. Be the first to share something!
          </p>
        ) : (
          posts.map((post) => (
            <article className="community-post" key={post.id}>
              <div className="post-header">
                <div>
                  <strong>{post.authorName || "HerSpace member"}</strong>
                  <small>{displayDate(post.createdAt)}</small>
                </div>

                {post.authorId === user.uid && (
                  <button
                    className="icon-button"
                    onClick={() => removePost(post)}
                    title="Delete post"
                    type="button"
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </div>

              <p className="post-text">{post.text}</p>

              <div className="post-reactions">
                {reactions.map((reaction) => {
                  const users = post[reaction.field] || [];
                  const active = users.includes(user.uid);

                  return (
                    <button
                      type="button"
                      key={reaction.field}
                      className={active ? "reaction active" : "reaction"}
                      onClick={() => reactToPost(post, reaction.field)}
                    >
                      {reaction.emoji} {users.length}
                    </button>
                  );
                })}

                <span className="comment-count">
                  <MessageCircle size={15} />
                  {(post.comments || []).length}
                </span>
              </div>

              <div className="post-comments">
                {(post.comments || []).map((comment, index) => (
                  <div className="comment" key={index}>
                    <strong>{comment.authorName}</strong>
                    <p>{comment.text}</p>
                  </div>
                ))}

                <form
                  className="comment-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    addComment(post);
                  }}
                >
                  <input
                    value={comments[post.id] || ""}
                    onChange={(event) =>
                      setComments((previous) => ({
                        ...previous,
                        [post.id]: event.target.value,
                      }))
                    }
                    placeholder="Write a response..."
                    maxLength="500"
                  />
                  <button type="submit" aria-label="Send comment">
                    <Send size={17} />
                  </button>
                </form>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
