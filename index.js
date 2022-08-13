import express from 'express'
import { Server } from "socket.io"
import http from 'http'
import path from 'path'
import { Client, auth } from "twitter-api-sdk";

const __dirname = path.resolve();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const twitterClient = new Client(process.env.twitterToken);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');
});

const noteReg = / (do|re|mi|fa|sol|la|si) /g
const numberReg = /[1-7]/
const noteToHz = {
    "do": 261.6,
    "do#": 277.183,
    "re": 293.7,
    "re#": 311.127,
    "mi": 329.6,
    "fa": 349.2,
    "fa#": 369.994,
    "sol": 392,
    "sol#": 415.305,
    "la": 440,
    "la#": 466.164,
    "si": 493.9
}
async function main() {
    const stream = twitterClient.tweets.sampleStream({
        "tweet.fields": ["created_at", "public_metrics"],
        expansions: ["author_id"],
        "user.fields": ["name", "username", "profile_image_url"]
    });
    for await (const tweet of stream) {
      let matches = tweet.data.text.toLowerCase().match(noteReg)
      if (matches) {
          // scatter a little bit the tweets to reduce pauses in feed
          await new Promise(r => setTimeout(r, 100));
          // console.log(matches)

          let numberMatch = tweet.data.text.match(numberReg)
          let factor = 1
          if (numberMatch) {
              // console.log(numberMatch[0])
              factor = Math.pow(2, parseInt(numberMatch[0]) - 4)
          }
          let hashMatch = tweet.data.text.match(/#/)
          let notes = matches.map(_note => {
              let note = _note.trim()
              let shouldFlat = hashMatch && noteToHz[note + "#"]
              if (shouldFlat)
                  return noteToHz[note + "#"] * factor
              return noteToHz[note.trim()] * factor
          })
          console.log("notes", notes)
          io.emit('note', {notes: notes, tweet: tweet})
      }
    }
}

main()
server.listen(3000, () => {
    console.log('listening on *:3000');
});
