const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

const port = process.env.port || 3000
const URL = 'mongodb://localhost:27017/'
const dbName = "BlogData"


/*

TODO:
    -make a functional crud to monngodb
    -prevent mutiple instance of data
*/


const app = express()

GetData = (coll, query, cb) => {
    MongoClient.connect(URL, (err, client) => {
        db = client.db(dbName)
        db.collection(coll).find(query).toArray((err, docs) => {
            cb(docs)
        })
    })
}

InsertData = (coll, data) => {
    MongoClient.connect(URL, (err, client) => {
        db = client.db(dbName)
        db.collection(coll).insert(data ,() => {
            db.collection(coll).find({}).toArray((err, docs) => {
                //console.log(docs)
            })
            //console.log('data inserted')
        })
    })
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.set('view engine', 'pug')

app.listen(port, () => {
    GetData('Posts', {}, (docs) => {
        console.log(docs.length)
    })
    console.log(`listening to ${port}`)
})

app.get('/', (req, res) => {
    InsertData('Posts',{
        title : 'hello world',
        post : 'lorem lorem lorem'
    })

    
    GetData('Posts', {} , (docs) => {
        res.render('index', { posts : docs })
    })
})

app.get('/post', (req, res) => {
    res.redirect('/post/get')
})

app.get('/post/get', (req, res) => {
    res.json({
        status : 200,
        posts : GetData('Posts')
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
    } else
        res.redirect('/')
})

app.get('*', (req, res) => {
    res.json({
        status: 404
    })
})









