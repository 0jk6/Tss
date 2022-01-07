const fs = require("fs");
const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (req, res)=>{
    res.send("<a href='/stream'>click here for video streaming</a>")
    //res.end();
});

app.get("/stream", (req, res)=>{
    let range = req.headers.range;

    if(!range){
        range = 'bytes=0-'
    }

    const videoPath = "rickroll.mp4";
    const videoSize = fs.statSync(videoPath).size;

    const CHUNK_SIZE = 10 ** 6; //1 MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize-1);

    //create headers for the partial content
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range" : `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges" :  "bytes",
        "Content-Length" : contentLength,
        "Content-Type" : "video/mp4"
    }

    //206 - partial content header code
    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, {start, end});

    videoStream.pipe(res);
    console.log(`sent a chunk with start: ${start} and end: ${end}`);
});

app.listen(PORT, ()=>{
    console.log(`Listening on port ${3000}`)
})