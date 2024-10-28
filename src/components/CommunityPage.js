import React, { useState, useEffect } from "react";
import { ref, set, push, onValue, update, increment } from 'firebase/database';
import { database, storage } from '../utils/firebase';
import { useSelector } from 'react-redux';
import Header from "./Header";
import Footer from "./Footer";
import { getDownloadURL, uploadBytesResumable, ref as sRef } from "firebase/storage";

const CommunityPage = () => {

    const [newPost, setNewPost] = useState({ title: "", body: "", tags: "", image: "" });
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState({});
    const [userVotes, setUserVotes] = useState({});
    const [filter, setFilter] = useState({ type: "newest", tags: "" });
    const user = useSelector((store) => store.user);
    const [isLoading, setIsLoading] = useState(true);
    const [commentsVisible, setCommentsVisible] = useState({});

    const toggleCommentsVisibility = (postId) => {
        setCommentsVisible(prevState => ({
            ...prevState,
            [postId]: !prevState[postId]
        }));
    };

    useEffect(() => {
        const fetchPosts = () => {
            const postsRef = ref(database, 'posts');
            onValue(postsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const fetchedPosts = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key],
                        comments: data[key].comments || [],
                        author: data[key].author
                    }));
                    setPosts(fetchedPosts);
                    setIsLoading(false);
                } else {
                    setPosts([]);
                }
            }, (error) => {
                console.error("Error fetching posts: ", error);
                alert("Failed to fetch posts. Please try again later.");
            });
        };

        fetchPosts();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uniqueFileName = `postImages/${Date.now()}-${file.name}`;
        const storageRef = sRef(storage, uniqueFileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            null,
            (error) => {
                console.error("Image upload failed: ", error);
                alert("Failed to upload image. Please try again.");
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setNewPost((prevPost) => ({ ...prevPost, image: downloadURL }));
                    alert("Image uploaded successfully!");
                });
            }
        );
    };

    const formatTimeAgo = (createdAt) => {
        const now = new Date();
        const postDate = new Date(createdAt);
        const diffInMinutes = Math.floor((now - postDate) / 60000);

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        } else {
            const hours = Math.floor(diffInMinutes / 60);
            const minutes = diffInMinutes % 60;
            return `${hours} hr${hours !== 1 ? 's' : ''} ${minutes ? `${minutes} min${minutes !== 1 ? 's' : ''}` : ''} ago`;
        }
    };

    const applyFilters = (posts) => {
        let filteredPosts = [...posts];

        if (filter.tags) {
            const tagsArray = filter.tags.split(",").map(tag => tag.trim().toLowerCase());
            filteredPosts = filteredPosts.filter(post =>
                tagsArray.some(tag => post.tags.includes(tag))
            );
        }

        if (filter.type === "popularity") {
            filteredPosts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        } else if (filter.type === "oldest") {
            filteredPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else {
            filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return filteredPosts;
    };

    const filteredPosts = applyFilters(posts);

    const handlePostCreation = async () => {
        if (!user || !user.email) return alert("Please log in to create a post.");
        if (!newPost.title || !newPost.body || !newPost.tags) return alert("Please fill all fields.");

        const postWithTimestamp = {
            ...newPost,
            author: user.displayName || "Anonymous",
            createdAt: new Date().toISOString(),
            upvotes: 0,
            downvotes: 0,
            comments: []
        };

        try {
            const postsRef = ref(database, 'posts');
            const newPostRef = push(postsRef);
            await set(newPostRef, postWithTimestamp);
            alert("Post created successfully!");
            setNewPost({ title: "", body: "", tags: "", image: "" });
        } catch (error) {
            console.error("Error creating post: ", error);
            alert("Failed to create post. Please try again.");
        }
    };

    const handleVote = async (postId, voteType) => {
        if (!user || !user.email) return alert("Please log in to vote.");
        const currentVote = userVotes[postId];
        if (currentVote === voteType) return;

        try {
            const postRef = ref(database, `posts/${postId}`);
            const updates = {
                [`${voteType === "upvote" ? "upvotes" : "downvotes"}`]: increment(1)
            };
            if (currentVote) {
                updates[`${voteType === "upvote" ? "downvotes" : "upvotes"}`] = increment(-1);
            }

            await update(postRef, updates);
            setUserVotes(prevVotes => ({ ...prevVotes, [postId]: voteType }));
        } catch (error) {
            console.error("Error voting: ", error);
            alert("Failed to record your vote.");
        }
    };

    const handleComment = async (postId) => {
        if (!user || !user.email) return alert("Please log in to comment.");
        if (!comment[postId]) return;
        const newComment = {
            text: comment[postId],
            author: user.displayName || "Anonymous",
            createdAt: new Date().toISOString()
        };

        try {
            const postRef = ref(database, `posts/${postId}/comments`);
            const post = posts.find(post => post.id === postId);
            const updatedComments = [newComment, ...post.comments];

            await set(postRef, updatedComments);
            setComment(prevComments => ({ ...prevComments, [postId]: "" }));
        } catch (error) {
            console.error("Error commenting on post: ", error);
            alert("Failed to submit your comment. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
                <p className="ml-4 text-indigo-600 dark:text-indigo-400">Loading community posts...</p>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header />
            <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-20 overflow-hidden">

                <aside className="lg:col-span-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 sticky lg:top-24 lg:h-fit">
                    <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Filters/Tags</h2>
                    <select
                        value={filter.type}
                        onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="popularity">Popular</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Enter tags (comma separated)"
                        value={filter.tags}
                        onChange={(e) => setFilter({ ...filter, tags: e.target.value })}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                    />
                </aside>

                <main className="lg:col-span-6 max-h-[calc(100vh-150px)] overflow-y-auto"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onScroll={(e) => e.target.style.scrollbarGutter = "stable"}>
                    <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 py-2 z-10">
                        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">Community Posts</h1>
                    </div>
                    {filteredPosts.length === 0 ? (
                        <p className="text-center text-gray-600 dark:text-gray-400">No posts available</p>
                    ) : (
                        filteredPosts.map(post => (
                            <div key={post.id} className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                                    {user && (
                                        <div className="flex flex-col items-center sm:mr-6 mb-4 sm:mb-0">
                                            <button onClick={() => handleVote(post.id, "upvote")} className={`text-green-500 hover:text-green-700 transition ${userVotes[post.id] === "upvote" ? "font-bold" : ""}`}>
                                                ▲
                                            </button>
                                            <span>{post.upvotes - post.downvotes}</span>
                                            <button onClick={() => handleVote(post.id, "downvote")} className={`text-red-500 hover:text-red-700 transition ${userVotes[post.id] === "downvote" ? "font-bold" : ""}`}>
                                                ▼
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex-grow">
                                        <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">{post.title}</h2>

                                        {post.image && (
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full max-h-72 object-contain rounded-lg mb-4"
                                            />
                                        )}

                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.body}</p>
                                        <p className="text-gray-500 dark:text-gray-500 text-sm">
                                            By {post.author || "Anonymous"} | {formatTimeAgo(post.createdAt)}
                                        </p>

                                        <div className="mt-4">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add a comment"
                                                    value={comment[post.id] || ""}
                                                    onChange={(e) => setComment({ ...comment, [post.id]: e.target.value })}
                                                    className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                                                />
                                                <button
                                                    onClick={() => handleComment(post.id)}
                                                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={2}
                                                        stroke="currentColor"
                                                        className="w-5 h-5"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75h13.25m0 0l-6-6m6 6l-6 6" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => toggleCommentsVisibility(post.id)}
                                                className="text-gray-400 hover:text-gray-600 mt-4"
                                            >
                                                {post.comments.length} {commentsVisible[post.id] ? "Comment" : "Comment"}{post.comments.length !== 1 ? 's' : ''}
                                            </button>
                                            <hr className="border-t border-gray-300 dark:border-gray-600 mb-4" />

                                        </div>


                                        {commentsVisible[post.id] && (
                                            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto"
                                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                                onScroll={(e) => e.target.style.scrollbarGutter = "stable"}
                                            >
                                                {post.comments.length === 0 ? (
                                                    <p className="text-gray-600 dark:text-gray-400">No comments yet.</p>
                                                ) : (
                                                    post.comments.map((comment, index) => (
                                                        <div key={index} className="p-2  rounded-lg">
                                                            <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{comment.author}</p>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                                                            <p className="text-gray-500 text-sm">{formatTimeAgo(comment.createdAt)}</p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </main>



                <aside className="lg:col-span-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 sticky lg:top-24 lg:h-fit">
                    <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Create New Post</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2"
                    />
                    <textarea
                        placeholder="Body"
                        value={newPost.body}
                        onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2"
                        rows="3"
                    />
                    <input
                        type="text"
                        placeholder="Tags (comma separated)"
                        value={newPost.tags}
                        onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4"
                    />
                    <div className="relative w-full mb-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200"
                        >
                            Add Image
                        </label>
                    </div>

                    <button
                        onClick={handlePostCreation}
                        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Create Post
                    </button>
                </aside>
            </div>
            <Footer />
        </div>
    );
};

export default CommunityPage;
