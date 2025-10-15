import { useState, useEffect } from 'react'
import { TbSquareLetterW, TbSquareLetterO, TbSquareLetterR, TbSquareLetterD, TbSquareLetterSFilled, TbSquareLetterEFilled, TbSquareLetterAFilled, TbSquareLetterRFilled, TbSquareLetterCFilled, 
TbSquareLetterHFilled } from "react-icons/tb";
import { GiMagnifyingGlass } from "react-icons/gi";
import DictionaryCard from './components/dictionaryCard.jsx'

import './App.css'

function App() {
  const [response, setResponse] = useState([])
  const [word, setWord] = useState("")
  let backgroundIndex = 0
  const staticBackgroundColors = ["bg-red-300", "bg-orange-300", "bg-amber-300", "bg-yellow-300", "bg-lime-300", "bg-green-300", "bg-emerald-300", "bg-teal-300", "bg-cyan-300", "bg-sky-300"]


  const assignBackgroundColor = async (data, backgroundIndex) => {
  
  if(data) {
     return data.map((wordAndDefinition) => {
          if(backgroundIndex > 9) {
            backgroundIndex = 0 
            wordAndDefinition.backgroundColor = staticBackgroundColors[backgroundIndex]
            backgroundIndex++
          } else {
            wordAndDefinition.backgroundColor = staticBackgroundColors[backgroundIndex]
            backgroundIndex++
          }
        })

  } else {
    console.log("We didnt find any data")
  }
   
       
       
  }


  const handleChange = async (e) => {
    e.preventDefault();
    let value = e.target.value;
    setWord(value)
  }

  const fetchResponse = async (e) => {
    try {
      e.preventDefault()
      let response = await fetch(`http://localhost:3000/${word}`)
        
      const data = await response.json()
      console.log("Found Data", data)
      await assignBackgroundColor(data, backgroundIndex)
      setResponse(data)

    } catch (e) {
      console.log(e)
    }
    
    
  }

  


  const addWord = async (e) => {
    await fetch("http://localhost:3000/add-word-definition", {
      method: "PUT"
    })
  }

  return (
    <>
  
    <div className='flex justify-items-center items-center justify-center flex-wrap'>
      <h1 className='text-red-300 text-5xl'><TbSquareLetterW /></h1>
      <h1 className='text-orange-300 text-5xl'><TbSquareLetterO /></h1>
      <h1 className='text-amber-300 text-5xl'><TbSquareLetterR /></h1>
      <h1 className='text-yellow-300 text-5xl'><TbSquareLetterD /></h1> 
    </div>

    <div className='flex justify-center flex-wrap '>
      <h1 className='text-lime-300 text-5xl'> <TbSquareLetterSFilled /> </h1>
      <h1 className='text-green-300 text-5xl'> <TbSquareLetterEFilled /> </h1>
      <h1 className='text-emerald-300 text-5xl'> <TbSquareLetterAFilled /> </h1>
      <h1 className='text-teal-300 text-5xl'> <TbSquareLetterRFilled /> </h1>
      <h1 className='text-cyan-300 text-5xl'> <TbSquareLetterCFilled /> </h1>
      <h1 className='text-sky-300 text-5xl'> <TbSquareLetterHFilled /> </h1>


    </div>
  <div className='flex flex-col'>
    <a href='http://localhost:3000/auth'>HELLO CLICK ME~</a>
    <a href="http://localhost:3000/sheet-data">Click me for sheet Data</a>
    <button onClick={addWord}>CLICK ME OT ADD WORD</button>
  </div>
    
    <form className='flex items-center justify-center mt-5 ' onSubmit={fetchResponse}>
      <input value={word} onChange={handleChange} className='p-2 bg-zinc-700 h-10 rounded-tl-bl border-r-1 border-gray-500' placeholder='Enter Your Word Here'/>
      <button className='rounded-tr-br outline-0 h-10 bg-zinc-700 text-xl border-l-4 border-amber-100 flex items-center justify-center'><span ><GiMagnifyingGlass />
        </span></button>      
    </form>
    {
      response.map((wordData, index) => {
        return (
          <DictionaryCard 
            key={index} 
            word={wordData.meta.id} 
            functionalLabel={wordData.fl} 
            shortdefs={wordData.shortdef} 
            date={wordData.date}
            backgroundColor = {wordData.backgroundColor}
          />
        )
      })
    }
  </> 
  )}

export default App
