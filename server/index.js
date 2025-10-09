const express = require('express')
var cors = require('cors')
require("dotenv").config()
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));

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
