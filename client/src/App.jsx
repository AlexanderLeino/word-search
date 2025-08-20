import { useState, useEffect } from 'react'
import { TbSquareLetterWFilled } from "react-icons/tb";
import { TbSquareLetterW, TbSquareLetterO, TbSquareLetterR, TbSquareLetterD, TbSquareLetterSFilled, TbSquareLetterEFilled, TbSquareLetterAFilled, TbSquareLetterRFilled, TbSquareLetterCFilled, 
TbSquareLetterHFilled } from "react-icons/tb";
import { GiMagnifyingGlass } from "react-icons/gi";

import './App.css'

function App() {
  const [response, setResponse] = useState("")
  const [word, setWord] = useState("")


  const handleChange = async (e) => {
    e.preventDefault();
    let value = e.target.value;
    console.log(e.target.value)
    setWord(value)
  }

  const fetchResponse = async (e) => {
    try {
      e.preventDefault()
      let response = await fetch(`http://localhost:3000/${word}`)
        
      const data = await response.json()
      console.log(data)
      setResponse(data)
    } catch (e) {
      console.log(e)
    }
    
    
  }

  

  return (
    <>
  
    <div className='flex justify-items-center items-center justify-center flex-wrap'>
      <h1 className='text-red-300 text-5xl'><TbSquareLetterW /></h1>
      <h1 className='text-orange-300 text-5xl'><TbSquareLetterO /></h1>
      <h1 className='text-amber-300 text-5xl'><TbSquareLetterR /></h1>
      <h1 className='text-yellow-300 text-5xl'><TbSquareLetterD /></h1> 
    </div>

    <div className='flex justify-items-start items-start justify-start flex-wrap '>
      <h1 className='text-lime-300 text-5xl'> <TbSquareLetterSFilled /> </h1>
      <h1 className='text-green-300 text-5xl'> <TbSquareLetterEFilled /> </h1>
      <h1 className='text-emerald-300 text-5xl'> <TbSquareLetterAFilled /> </h1>
      <h1 className='text-teal-300 text-5xl'> <TbSquareLetterRFilled /> </h1>
      <h1 className='text-cyan-300 text-5xl'> <TbSquareLetterCFilled /> </h1>
      <h1 className='text-sky-300 text-5xl'> <TbSquareLetterHFilled /> </h1>


    </div>
    <form className='flex items-center justify-center mt-5 ' onSubmit={fetchResponse}>
      <input value={word} onChange={handleChange} className='p-2 bg-zinc-700 h-10 rounded-tl-bl border-r-1 border-gray-500' placeholder='Enter Your Word Here'/>
      <button className='rounded-tr-br outline-0 h-10 bg-zinc-700 text-xl border-l-4 border-amber-100 flex items-center justify-center'><span ><GiMagnifyingGlass />
        </span></button>      
    </form>
    </>
  )
}

export default App
