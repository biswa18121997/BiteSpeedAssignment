import React, { useState } from 'react'
//a simolpe card component
function Cards({message}) {
    //let [message, setMessage] = useState('');
//for handling drag and drop operations
    const handleDragStart = (e) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify(message));
    e.dataTransfer.effectAllowed = 'move';
  };
  return (
    <div draggable onDragStart={handleDragStart} className='w-full h-fit flex flex-col border m-2 p-2 rounded-4xl'>
        <h1 className='h-1/4'>Send Message</h1>
        <div className='flex justify-between items-center'>
          <p className='h-3/4'>{message.message}</p>
          <span>O</span>
        </div>
        
      
    </div>
  )
}

export default Cards
