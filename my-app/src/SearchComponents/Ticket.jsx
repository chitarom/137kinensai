import React from 'react'

function Ticket ({keyword,filter,projdata,ddetail,id,setDDC}) {
  const classname = projdata[0].replace("H-","");
  var type = "謎の企画";
  var num = 0;
  switch (projdata[2]) {
    case 0:
    case 1:
      type = "クラス企画";
      num = 11;
      break;
    case 7:
      type = "ステージ";
      num = 7;
      break;
    case 8:
      type = "講　　堂";
      num = 8;
      break;
    case 9:
      type = "有　　志";
      num = 9;
      break;
  }

  var category_list = [];
  for (let i=0;i<projdata[4].length;i++)
    category_list.push(<div key={i} className='category'>{projdata[4][i]}</div>);

  var hidden = true;

  var cl = projdata[0];
  var title = projdata[1];
  if (title.search(keyword) >= 0 || cl.search(keyword) >= 0) hidden = false;

  //console.log(num,filter[1]);

  //カテゴリ選別
  if (num != filter[1] && filter[1] != 10) hidden = true;

  for (let i=0;i<filter[0].length;i++)
    if (!projdata[4].includes(filter[0][i])) hidden = true;

  //console.log(keyword,hidden);

  var ticketcl = "";
  if (hidden) ticketcl = " hidden";

  const changeDDetail = () => {
    ddetail(id);
    setDDC([classname,projdata[1],projdata[3],projdata[4],projdata[5]]);
  }
  return (
    <div className={"ticket" + ticketcl} onClick={changeDDetail}>
        <div className={"p" + projdata[2] + " proj-type"}><div className='type'>{type}</div></div>
        <div className='class'>{classname}</div>
        <div className='title'>{projdata[1]}</div>
        <div className='categories-wrap'><div className='categories'>{category_list}</div></div>
        <div className='ticket-right'>
          <div className='terms'>
            <div className='term'>7:14～14:17</div>
            <div className='seiriken-term'>7:14～14:17</div>
          </div>
          <div className='favorite-wrap'><button className='favorite'>☆</button></div>
        </div>
    </div>
  )
}

export default Ticket;
