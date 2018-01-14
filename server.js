const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require ('mongodb').MongoClient

const port = process.env.port || 3000
const URL = 'mongodb://localhost:27017/'
const dbName = "BlogData"

const app = express()

let posts = [{
    id: 1,
    title: 'hello world',
    body: 'Cupidatat et exercitation in fugiat nostrud esse fugiat consequat pariatur proident in aliquip dolor.'
},
{
    id: 2,
    title: 'hello world',
    body: 'Cupidatat et exercitation in fugiat nostrud esse fugiat consequat pariatur proident in aliquip dolor.'
}
]


MongoClient.connect(URL, (err, client) => {
    if (err) throw err

    let db = client.db(dbName)
    
    db.collection('Posts').insert(posts, (err, res) => {
       db.collection('Posts').find({title : "hello world"}).toArray( (err, docs) => {
        console.log(docs)
       })
    })
    console.log('mongo server connected')
})

//const isLogin = true


app.listen(port, (req, res) => {
    console.log(`App listening on port ${port}!`)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index', {
        posts
    })
})

app.get('/post', (req, res) => {
    res.redirect('/post/get')
})

app.get('/post/get', (req, res) => {
    res.json({
        status: 200,
        timestamp: new Date(),
        posts
    })
})

app.get('/post/form', (req, res) => {
    res.render('editor', {
        posts
    })
})

app.post('/post/add', (req, res) => {
    posts.push({
        id: posts.length + 1,
        title: req.body.title,
        body: req.body.post_body
    })
    console.log(`${posts[posts.length - 1].title} added`)
    res.redirect('/')
})

app.get('/post/get/:id', (req, res) => {
    if (req.params.id === 0) {
        res.redirect('getpost/')
    } else if (posts[req.params.id - 1] != null) {
        res.json({
            status: 200,
            timestamp: new Date(),
            post: posts[req.params.id - 1]
        })
    } else {
        res.json({
            status: 404
        })
    }
})

app.post('/post/delete/:id', (req, res) => {
    if (isLogin) {
        console.log(req.params.id)
        posts.splice(req.params.id - 1, 1)
        posts.forEach((post) => {
            if (post.id > req.params.id) {
                post.id--
            }
        })
        res.redirect('/')
    }else
        res.redirect('/')
})

app.get('*', (req, res) => {
    res.json({
        status:404
    })
})