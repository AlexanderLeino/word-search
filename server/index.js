const express = require('express')
const { google } = require("googleapis")
var cors = require('cors')
require("dotenv").config()
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));

const oauth2Client = new google.auth.OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL // e.g. "http://localhost:3000/oauth2callback"
);

const scopes = ["https://www.googleapis.com/auth/spreadsheets"];

// 1️⃣ Route to start the OAuth flow




app.get("/auth", (req, res) => {

  console.log("AUTH")
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // get refresh_token
    scope: scopes,
  });
  res.redirect(url);
});

// 2️⃣ Redirect URL (callback)
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code; // comes from Google after user grants access

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // save tokens for later use (e.g., in your DB or .env)
    res.send("Authentication successful! You can now use the Sheets API.");
  } catch (err) {
    // if error occurs just simply getting a new token generated. 
    const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // get refresh_token
    scope: scopes,
  });
  res.redirect(url);
  }
});

// 3️⃣ Example route that uses Sheets API
app.get("/sheet-data", async (req, res) => {

  const sheets = google.sheets({ version: "v4", auth: oauth2Client });
  console.log(oauth2Client)
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    range: "Sheet1",
  });

  res.json(response.data);
});


app.put("/add-word-definition", async (req, res) => {
  
  try {

    
    const sheets = google.sheets({version: "v4", auth: oauth2Client})


    const values = [
      ["Values", "Alex", "BILLY GOAT"], 
      ["Nascar", "Hawii"]
    ]

    const resource = {
      values
    }
        
    

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: "Sheet1!A10:C6",
      valueInputOption: "RAW",
      resource  
  })
  
   res.json(response)
  } catch (e) {
    console.log(e)
  }
 

})







function getAudioUrl(audio) {
  const base = "https://media.merriam-webster.com/audio/prons/en/us/mp3";
  let subdir;

  if (audio.startsWith("bix")) {
    subdir = "bix";
  } else if (audio.startsWith("gg")) {
    subdir = "gg";
  } else if (/^[0-9_]/.test(audio)) {
    subdir = "number";
  } else {
    subdir = audio[0];
  }

  return `${base}/${subdir}/${audio}.mp3`;
}

function cleanMWData(data, preserveFormatting = false) {
  const tagMap = {
    it: ['<em>', '</em>'],
    sup: ['<sup>', '</sup>'],
    inf: ['<sub>', '</sub>'],
    sc: ['<span style="font-variant: small-caps;">', '</span>'],
    bc: [': ', ''],
    b: ['<strong>', '</strong>']
  };

  if (typeof data === 'string') {
    let output = data;

    if (preserveFormatting) {
      output = output.replace(/\{\/?([^{}]+)\}/g, (match, tagName) => {
        const isClosing = tagName.startsWith('/');
        const cleanTag = isClosing ? tagName.slice(1) : tagName;
        if (tagMap[cleanTag]) {
          return isClosing ? tagMap[cleanTag][1] : tagMap[cleanTag][0];
        }
        return '';
      });
    } else {
      output = output.replace(/\{[^{}]*\}/g, '');
    }

    return output.replace(/\s+/g, ' ').trim();
  }

  if (Array.isArray(data)) {
    return data.map(item => cleanMWData(item, preserveFormatting));
  }

  if (data && typeof data === 'object') {
    const cleanedObj = {};
    for (const key in data) {
      cleanedObj[key] = cleanMWData(data[key], preserveFormatting);
    }
    return cleanedObj;
  }

  return data;
}

async function getTopThreeDefinitionsAllEntries(data, format = "html") {

  const allDefinitions = [];
  let audioUrl = null;
  let dateStr = null;
  let wordId = null;

  for (const entry of data) {
    if (!wordId && entry.meta?.id) {
      wordId = entry.meta.id;
    }

    if (!audioUrl && entry.hwi?.prs) {
      const firstAudio = entry.hwi.prs.find(pron => pron.sound?.audio);
      if (firstAudio) {
        audioUrl = getAudioUrl(firstAudio.sound.audio);
      }
    }

    if (!dateStr && entry.date) {
      dateStr = cleanMWData(entry.date, false);
    }

    if (entry.def) {
      for (const defBlock of entry.def) {
        for (const sseqItem of defBlock.sseq) {
          for (const inner of sseqItem) {
            if (inner[0] === "sense" && inner[1]?.dt) {
              const definitionText = inner[1].dt
                .filter(dtItem => dtItem[0] === "text")
                .map(dtItem => cleanMWData(dtItem[1], format === "html"))
                .join(" ");

              allDefinitions.push({
                definition: definitionText,
                sn: inner[1].sn || null
              });
            }
          }
        }
      }
    }
  }
  console.log( dateStr, audioUrl, allDefinitions.slice(0,3))
  return {
    word: wordId || word,
    date: dateStr || '',
    audio: audioUrl,
    definitions: allDefinitions.slice(0, 3)
  };
}


app.get('/:word', async (req, res) => {

  try {
  let response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${req.params.word}?key=${process.env.DICTIONARY_API_KEY}`)


  let data = await response.json()
  console.log("DATA", data)
  // data = getTopThreeDefinitionsAllEntries(data)
  res.send(data)
  } catch (e) {
    console.log(e)
    res.send(e)
  }
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
