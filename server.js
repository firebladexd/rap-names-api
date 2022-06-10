//const { response } = require('express')
//const express = require('express')
//const app = express()
//const cors = require('cors')
//const PORT = 8000
//
//app.use(cors())
//
//const rappers = {
//    '21 savage': {
//        'age': 29,
//        'birthName': 'Sheyaa Bin Abraham-Joseph',
//        'birthLocation': 'London, England'
//    },
//    'chance the rapper': {
//        'age': 29,
//        'birthName': 'Chancelor Bennett',
//        'birthLocation': 'Chicago, Illinois'
//    },
//    'unknown': {
//        'age': 0,
//        'birthName': 'unknown',
//        'birthLocation': 'unkown'
//    }
//}
//
//app.get('/', (request, response) => {
//    response.sendFile(__dirname + '/index.html')
//})
//
//app.get('/api/:name', (request, response) => {
//    const rapperName = request.params.name.toLowerCase()
//    if( rappers[rapperName] ){
//        response.json(rappers[rapperName])
//    }else{
//        response.json(rappers['unknown'])
//    }
//})
//
//app.listen(process.env.PORT || PORT, () => {
//    console.log(`The server is now running on port ${PORT}! Betta go catch it!`)
//})


const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const cors = require('cors')
const PORT = 2121
require('dotenv').config()

app.get(cors())


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'rap-names'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',(request, response)=>{
    db.collection('rappers').find().sort({likes: -1}).toArray()
    .then(data => {
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})

app.post('/addRapper', (request, response) => {
    db.collection('rappers').insertOne({stageName: request.body.stageName,
    birthName: request.body.birthName, likes: 0})
    .then(result => {
        console.log('Rapper Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/addOneLike', (request, response) => {
    db.collection('rappers').updateOne({stageName: request.body.stageNameS, birthName: request.body.birthNameS,likes: request.body.likesS},{
        $set: {
            likes:request.body.likesS + 1
          }
    },{
        sort: {_id: -1},
        upsert: true
    })
    .then(result => {
        console.log('Added One Like')
        response.json('Like Added')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteRapper', (request, response) => {
    db.collection('rappers').deleteOne({stageName: request.body.stageNameS})
    .then(result => {
        console.log('Rapper Deleted')
        response.json('Rapper Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})