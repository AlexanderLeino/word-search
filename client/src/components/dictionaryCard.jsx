import React from 'react';

const DictionaryCard = ({ word, date, shortdefs, functionalLabel }) => {
    return (
        <div className=" flex-col bg-zinc-500 p-2 rounded-md shadow-md mt-3">
            <div className='flex justify-between mx-2'>
            <div>{word}</div>
            <div>{functionalLabel}</div>
            </div>
            
            <div className='flex-col'>{shortdefs.map((defintion, index) => {
                return (
                    <div>{index + 1}. {defintion}</div>
                )
            })}</div>
        </div>
    );
};

export default DictionaryCard;