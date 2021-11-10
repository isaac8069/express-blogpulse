let express = require('express')
let db = require('../models')
const article = require('../models/article')
let router = express.Router()

// POST /articles - create a new post
router.post('/', (req, res) => {
  db.article.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId
  })
  .then((post) => {
    res.redirect('/')
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// GET /articles/new - display form for creating new articles
router.get('/new', (req, res) => {
  db.author.findAll()
  .then((authors) => {
    res.render('articles/new', { authors: authors })
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// GET /articles/:id - display a specific post and its author
router.get('/:id', (req, res) => {
  db.article.findOne({
    where: { id: req.params.id },
    include: [db.author, db.comment]
  })
  .then((article) => {
    if (!article) throw Error()
    console.log('this is the article\n', article)
    res.render('articles/show', { article: article })
  })
  .catch((error) => {
    console.log(error)
    res.status(400).render('main/404')
  })
})

//POST ==> /articles/:id:comments --> this willl add a new comment
//req.body is coming from the form in show.ejs
//req.params is referring the url
router.post('/:id/comments', (req,res) => {
  db.comment.create({
    name: req.body.name,
    content: req.body.content,
    articleId: req.params.id
  })
  .then(resPost => {
    console.log('created comment\n', resPost)
    res.redirect(`/articles/${req.params.id}`)
  })
  .catch(err => {
    res.status(404).render('main/404')
  })
})

module.exports = router