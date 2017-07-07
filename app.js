const express = require('express');
const bodyParser = require('body-parser')
const cors = require('CORS')
const mongoose = require('mongoose')
const bing = require('node-bing-api')({ accKey: "db63791f74064c3ca3a65570902162f5" });
//Extracted from youtube tutorial's account key
const port = 3000
const app = express()

var History = require('./models/history')

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/image_search', {
    useMongoClient: true,
})

app.use(bodyParser.json())
app.use(cors())

app.get('/api/image/:searchVal*', function(req, res){
    var searchStr = req.params.searchVal;
    var offset = req.query.offset; 
    //query are the parameters contained in the url string
    console.log(offset)
    
    var newSearch = History({
        searchStr: searchStr
    })

    //saving the keywords
    newSearch.save(function(err){
        if(err){
            console.log(err)
        }
        //{ input: searchStr, querynumber: ((query) ? query : 0) }
    })

   //the variable offset is like the page number, hence we implement the logic as follows
   var skipValue = ( !offset || offset == 1) ? 0 : (10 * (offset - 1));


    bing.images(searchStr, {
        top: 10,   // Number of results (max 50) 
        skip: skipValue    // Skip first 3 result 
    }, function(error, rez, body){ 
        //not folllowing format naming it as res. we want to use the res from outside this function.
        //if we name it res instead of rez here, the code line before will give error res.json() is not a function.
        res.json(body.value.map(function(item){
            var result =[{contentUrl: item.contentUrl},
                        {name: item.name},
                        {contentSize: item.contentSize},
                        {datePublished: item.datePublished}]
                        
            return result;
        }));
    });
})

//Try to sort them from the most recent to the earliest
app.get('/api/latest/imagesearch', (req, res) => {
    History.find({}, function(err, docs){
        res.json(docs.reverse())
    })
})

app.listen(process.env.PORT || port, function(){
    console.log('Server listening on port ' + port)
})
