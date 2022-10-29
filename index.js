const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;
const cheerio = require('cheerio');
app.use(cors())

const images = []
const names = []
const blogs = []
async function scrapeData() {
    
    const {data} = await axios.get('https://allmovieshub.website/');
    const $ = cheerio.load(data);
    const movies = $("article .blog-entry-inner .thumbnail a img");
    movies.each((index,el)=>{
        images.push(el.attribs.src);
        //console.log(el.attribs);
    })
    const titles = $("article .blog-entry-inner .blog-entry-header .blog-entry-title a")
    titles.each((index,el)=>{
        //console.log(el.children[0].data);
        names.push(el.children[0].data);
    })
    while(blogs.length >0){
        blogs.pop()
    }
    for (let index = 0; index < names.length; index++) {
        const movie = {
            'name': names[index],
            'img': images[index]
        }
        
        blogs.push(movie);
    }
}

app.get('/',(req,res)=>{
    scrapeData();
    res.send(blogs);
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
