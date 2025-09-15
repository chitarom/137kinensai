import React, { useState } from 'react'

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

  const changeDDetail = () => {
    ddetail(id);
    setDDC([classname,projdata[1],projdata[3],projdata[4],projdata[5],projdata[6]]);
  }

  var favorites = [];
  if (localStorage.getItem("favorites") == undefined)
    localStorage.setItem("favorites","[]");
  else favorites = JSON.parse(localStorage.getItem("favorites"));

  var star = "☆";
  if (favorites.includes(projdata[6])) star = "★";

  const [favoriteSwitch,setFavoriteSwitch] = useState(false);
  const toggleSwitch = () => {
    favorites = JSON.parse(localStorage.getItem("favorites"));
    if (star == "☆")
      favorites.push(projdata[6]);
    else 
      favorites = favorites.slice(0, favorites.indexOf(projdata[6])).concat(favorites.slice(favorites.indexOf(projdata[6]) + 1));
    localStorage.setItem("favorites", JSON.stringify(favorites));
    setFavoriteSwitch(!favoriteSwitch);
  }
  
  hidden = (filter[2] && !favorites.includes(projdata[6])) ? true : hidden;

  var ticketcl = "";
  if (hidden) ticketcl = " hidden";

  var cn = classname.split("");
  if (cn[0] == "J") cn[0] = "中";
  cn = cn.join("");

  return (
    <div className={"ticket" + ticketcl}>
        <div className={"p" + projdata[2] + " proj-type"} onClick={changeDDetail}><div className='type'>{type}</div></div>
        <div className='class' onClick={changeDDetail}>{cn}</div>
        <div className='title' onClick={changeDDetail}>{projdata[1]}</div>
        <div className='categories-wrap' onClick={changeDDetail}><div className='categories'>{category_list}</div></div>
        <div className='ticket-right'>
          <div className='terms' onClick={changeDDetail}>
            <div className='term'>7:14～14:17</div>
            <div className='seiriken-term'>7:14～14:17</div>
          </div>
          <div className='favorite-wrap'>
            <div className='fw-margin' onClick={changeDDetail}></div>
            <button className='favorite' onClick={toggleSwitch}>{star}</button>
          </div>
        </div>
    </div>
  )
}

export default Ticket;
