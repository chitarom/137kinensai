import React from 'react'

function Ticket ({projdata}) {
  const classname = projdata[0].replace("H-","");
  return (
    <div className='ticket'>
        <div className='class'>{classname}</div>
        <div className='proj-type'>{projdata[2]}</div>
        <div className='favorite-wrap'><button className='favorite'>⊕追加する</button></div>
        <div className='title'>{projdata[1]}</div>
        <div className='detail'>詳しく見る</div>
        <div className='margin'></div>
    </div>
  )
}

export default Ticket;
