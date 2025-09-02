import React, { useState } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp} from "react-icons/md";
const DictionaryCard = ({ date, shortdefs, functionalLabel, meta,  }) => {

    const [ isExpanded, setIsExpanded ] = useState(false);


    return (
        <div className=" flex-col bg-zinc-500 p-1 rounded-md shadow-md mt-3" onClick={() => setIsExpanded(!isExpanded)} >
            <div className='flex justify-between mx-2'>
            <div className='text-2xl font-bold text-left capitalize'>{meta.stems[0]}</div>
            <div className='font-bold italic'>{functionalLabel}</div>
            </div>
            
            <div className='flex-col text-left'>{shortdefs.map((defintion, index) => {
                return (
                    <div className='mt-1 mx-3'>{index + 1}.) {defintion}</div>
                )
            })}</div>
            <div className='flex justify-center align-center items-center mx-3 mt-1'>
                {
                    isExpanded ? <>
                        <div className='text-sm italic'>Click to collapse</div> 
                        <MdKeyboardArrowUp className='text-center text-2xl'/>
                    </>: <>
                    <div className='text-sm italic'>Click to expand</div>
                     <MdKeyboardArrowDown className='text-center text-2xl'/>
                    </>
                }
               
            </div>
            
        </div>
    );
};

export default DictionaryCard;