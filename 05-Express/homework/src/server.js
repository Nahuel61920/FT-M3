// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [
    {   
        id: 1,
        author: "Nahuel",
        title: "First post",
        content: "This is the first post",
    }
];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

// TODO: your code to handle requests
let id = 2;

// GET
server.get("/posts", (req, res) => {
    const {term} = req.query
    if (term) {
        const filteredPosts = posts.filter(post => post.title.includes(term) || post.content.includes(term))
        filteredPosts.length > 0 ? res.json(filteredPosts) : res.status(404).json({message: `No posts found for ${term}`})
    } else {
        res.send(posts)
    }
})

server.get("/posts/:author", (req, res) => {
    const {author} = req.params

    if (author) {
        const filteredPosts = posts.filter(post => post.author.toLowerCase() === author.toLowerCase())
        filteredPosts.length > 0 ? res.json(filteredPosts) : res.status(STATUS_USER_ERROR).json({message: `No existe ningun post del autor: ${author}`})
    } else {
        res.send(posts)
    }
})

server.get("/posts/:author/:title", (req, res) => {
    let {title, author} = req.params

    author = author.trim()
    title = title.trim()

    if (title && author) {
        const filteredPosts = posts.filter(post => post.title.toLowerCase() === title.toLowerCase() && post.author.toLowerCase() === author.toLowerCase())
        filteredPosts.length > 0 ? res.json(filteredPosts) : res.status(STATUS_USER_ERROR).json({message: `No existe ningun post del autor: ${author} con el titulo: ${title}`})
    } else {
        res.send(posts)
    }
})

//POST
server.post('/posts', (req, res) => {
    const {author, title, content} = req.body;
    if (!author || !title || !content) {
        return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para crear el Post"});
    }

    const newPost = {
        id: id++,
        author,
        title,
        content
    };

    posts.push(newPost);
    res.status(201).json(newPost);
});

server.post('/posts/author/:author', (req, res) => {
    const {title, content} = req.body;
    const {author} = req.params;
    if (!author || !title || !content) {
        return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para crear el Post"});
    }

    const newPost = {
        id: id++,
        author,
        title,
        content
    };

    posts.push(newPost);
    res.status(201).json(newPost);
})

//PUT
server.put("/posts", (req, res) => {
    const {id, title, content} = req.body;
    if (!id || !title || !content) {
        return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para crear el Post"});
    } else {
        const post = posts.find(post => post.id === id);
        if (post) {
            post.title = title;
            post.content = content;
            res.status(200).json(post);
        } else {
            res.status(404).json({error: `No existe ningun post con el id: ${id}`});
        }
    }
})

//DELETE
server.delete("/posts", (req, res) => {
    const {id} = req.body;
    if (!id) {
        return res.status(STATUS_USER_ERROR).json({error: "No le pasaste el id del post a eliminar"});
    } else {
        posts = posts.filter(post => post.id !== id);
        res.status(200).json({suvvess: true});
    }
})

server.delete("/author", (req, res) => {
    const {author} = req.body;
    if (!author) {
        return res.status(STATUS_USER_ERROR).json({error: "No le pasaste el autor del post a eliminar"});
    } else {
        posts = posts.filter(post => post.author !== author);
        res.status(200).json({suvvess: true});
    }
})

module.exports = { posts, server };
