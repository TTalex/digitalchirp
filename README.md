# Digital Chirp
<p>Digital chirp plays notes based on tweets posted in real time.</p>
<p>It reads tweets and looks for the following content:</p>
<ul>
    <li>Notes (<span style='color: red; font-weight: bold'>do</span>, <span style='color: red; font-weight: bold'>ré</span>, <span style='color: red; font-weight: bold'>mi</span>, <span style='color: red; font-weight: bold'>fa</span>, <span style='color: red; font-weight: bold'>sol</span>, <span style='color: red; font-weight: bold'>la</span>, <span style='color: red; font-weight: bold'>si</span>) to be played</li>
    <li>Numbers (<span style='color: blue; font-weight: bold'>1</span> to <span style='color: blue; font-weight: bold'>7</span>) for the octave</li>
    <li>The character <span style='color: green; font-weight: bold'>#</span> to decide if the note is sharp or not</li>
    <li>The length of the tweet to decide how long the note is played</li>
</ul>
<p> If a tweet contains multiple matches, multiple notes are played.</p>
<p>Tweets are displayed in realtime, and elements considered are highlighted</p>

## Installation
It uses the twitter API, so you need to create an App and add your token as an env variable

```
export twitterToken="<TOKEN>"
```

Then installation can be done

```
npm install
```

It runs on a express server, serving files on port 3000, start it with

```
npm run start
```
