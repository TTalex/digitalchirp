function highlight(text) {
    return text
        .replaceAll(/ (do|re|mi|fa|sol|la|si) /g, "<span style='color: red; font-weight: bold'>$1</span> ")
        .replace(/([1-7])/, "<span style='color: blue; font-weight: bold'>$1</span>")
        .replace(/#/, "<span style='color: green; font-weight: bold'>#</span>")
}
function format(notes, tweet) {
    const author = tweet.includes.users[0]
    return `
        <div class="tweet-wrap">
          <div class="tweet-header">
            <img src="${author.profile_image_url}" alt="" class="avator">
            <div class="tweet-header-info">
              ${author.name} <span>@${author.username}</span><span>. ${new Date(tweet.data.created_at).toLocaleString()}</span>
              <p>${highlight(tweet.data.text)}</p>
            </div>
          </div>
          <div class="tweet-img-wrap"></div>
          <div class="tweet-info-counts">
            <div class="comments">
              <svg class="feather feather-message-circle sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              <div class="comment-count">${tweet.data.public_metrics.reply_count}</div>
            </div>
            <div class="retweets">
              <svg class="feather feather-repeat sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
              <div class="retweet-count">${tweet.data.public_metrics.retweet_count}</div>
            </div>
            <div class="likes">
              <svg class="feather feather-heart sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <div class="likes-count">
                ${tweet.data.public_metrics.like_count}
              </div>
            </div>
            <div class="message">
              <svg class="feather feather-send sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" version="1.0" width="20" height="20" viewBox="0 0 95 95" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M 23.7,87.9 C 18.1,82.8 21.2,74.7 30.4,69.9 C 33.5,68.4 35.8,67.7 39.8,67.8 C 42.3,67.9 45.1,69.3 45.1,69.3 C 45.1,51.2 45.0,17.0 45.0,0.2 C 46.0,0.2 46.7,0.1 48.1,0.1 C 48.1,1.1 48.1,1.9 48.1,2.7 C 48.1,3.6 48.1,4.1 48.2,4.7 C 49.2,11.0 50.6,13.5 57.6,21.2 C 66.5,31.1 69.1,37.0 69.1,44.9 C 69.0,52.3 62.5,68.1 61.1,67.5 C 63.1,61.9 65.9,55.9 66.6,50.9 C 67.5,44.8 65.0,36.2 61.0,31.7 C 57.8,27.9 50.2,24.6 48.1,24.6 C 48.1,24.6 48.0,61.0 48.0,74.8 C 48.0,77.1 45.9,81.2 44.7,82.6 C 39.2,89.2 28.5,92.2 23.7,87.9 z"/></svg>
              <div class="likes-count">
                ${notes.map(note => note + "Hz").join(",")}
              </div>
            </div>
          </div>
        </div>
    `
}
var socket = io();
const content = document.querySelector('#content')
let tweets = ["", "", "", "", ""]
let synth = null
socket.on('note', (msg) => {
    if (!synth || document.querySelector('button').textContent === "Play") {
        return
    }
    console.log(msg)
    synth.triggerAttackRelease(msg.notes, msg.tweet.data.text.length/255)
    tweets.unshift(format(msg.notes, msg.tweet))
    tweets.pop()
    content.innerHTML = tweets.join("\n")
})
document.querySelector('button')?.addEventListener('click', async () => {
    if (document.querySelector('button').textContent === "Stop") {
        document.querySelector('button').textContent = "Play"
    } else {
        document.querySelector('button').textContent = "Stop"
    }
    await Tone.start()
    console.log('audio is ready')
    const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination().start();
    synth = new Tone.PolySynth(Tone.AMSynth).connect(chorus);

})
