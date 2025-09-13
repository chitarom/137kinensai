
import './Search.css'
import data from './JSON/ProjectData.json'
import categories from './JSON/Categories.json'
import FilterButton from './SearchComponents/FilterButton.jsx';
import TicketList from './SearchComponents/TicketList.jsx';
import DetailImageSlider from './SearchComponents/DetailImageSlider.jsx';
import React from 'react';
import { useRef, useState, useEffect } from 'react';
import DisplayDetail from './DisplayDetail.jsx';
var pictures = [];
for (let i = 0; i < data.length; i++) {
    var list = [];
    for (let a = 0; a < data[i][5].length; a++) {
        list.push(import('/pictures/' + data[i][5][a]));
    }
    pictures.push(list);
}

function Search() {
    //FavoriteかどうかはlocalStorageに保存
    const [queried, setQueried] = useState(false);
    const [isPopUp, setPopUp] = useState(false);
    const [displayingDetail, setDisplayingDetail] = useState(-1);
    const [displayDetailContents, setDisplayDetailContents] = useState(["", "", "", [], [], ""]);
    console.log(displayDetailContents);
    //["場所","企画名","説明文",[カテゴリー],[スライド用画像],"企画ID"]
    const [keyword, setKeyword] = useState("");
    const [filter, setFilter] = useState([[], 10, false]);
    const search = (e) => { setKeyword(e.target.value); }
    const changeFilterList = [template(10), template(11), template(7), template(8), template(9)];
    function template(int) { return () => { setFilter([filter[0], int, filter[2]]); } };
    const setFilterList = [];
    /*
    if (window.location.href.indexOf("?") >= 0 && !queried) {
        var projectid = window.location.href.split("?")[1].split("id=")[1].split("&")[0];
        for (let i = 0; i < data.length; i++) {
            if (data[i][6] == projectid) {
                setDisplayingDetail(i);
                setDisplayDetailContents([data[i][0],data[i][1],data[i][3],data[i][4],data[i][5],data[i][6]]);
                setQueried(true);
            }
        }
    }
    */
    categories.map((category) => setFilterList.push(temp(category)));
    function temp(str) {
        //filter[0] (categories) の中身を変更する関数のテンプレート
        return () => {
            console.log("filter: " + filter);
            var filt0 = filter[0].includes(str) ? filter[0].slice(0, filter[0].indexOf(str)).concat(filter[0].slice(filter[0].indexOf(str) + 1)) : false;
            if (!filt0) { filt0 = filter[0]; filt0.push(str); }
            setFilter([filt0, filter[1], filter[2]]);
        };
    }

    const filterButton = (str, id) => {
        return <button className={'filter' + (filter[0].includes(str) ? '' : ' inactive')} id={id} onClick={setFilterList[id - 1]} key={id}>{str}</button>;
    }
    const list = [];
    for (let i = 0; i < categories.length; i++)
        list.push(filterButton(categories[i], (i + 1)));

    const togglePopUp = () => {
        setPopUp(!isPopUp);
    }

    const toggleFavorite = () => {
        setFilter([filter[0], filter[1], !filter[2]]);
    }

    if (localStorage.getItem("favorites") == undefined) localStorage.setItem("favorites", "[]");
    var favorites = JSON.parse(localStorage.getItem("favorites"));

    var star = favorites.includes(displayDetailContents[5]) ? "★" : "☆";

    return (
        <div>
            <div className='search-wrap'>
                <input className='search-box2' type="text" id='keyword' onChange={search} placeholder='キーワードを入力...' />
            </div>
            <div className='filter-wrap'>
                <div className='filter-list'>
                    <button className='first-filter filter' id='0' onClick={togglePopUp}>絞り込む</button>
                    <button className={'filter' + (filter[2] ? "" : " inactive")} id='-1' onClick={toggleFavorite}>お気に入り</button>
                    {list}
                </div>
            </div>
            <div className='content'>
                <div className='tabs'>
                    <button className={"tab" + (filter[1] == 10 ? " active" : "")} onClick={changeFilterList[0]}>すべて</button>
                    <button className={"tab" + (filter[1] == 11 ? " active" : "")} onClick={changeFilterList[1]}>クラス企画</button>
                    <button className={"tab" + (filter[1] == 7 ? " active" : "")} onClick={changeFilterList[2]}>ステージ</button>
                    <button className={"tab" + (filter[1] == 8 ? " active" : "")} onClick={changeFilterList[3]}>講堂</button>
                    <button className={"tab" + (filter[1] == 9 ? " active" : "")} onClick={changeFilterList[4]}>有志</button>
                </div>
                <div className='tickets'>
                    <TicketList keyword={keyword} filter={filter} ddetail={setDisplayingDetail} setDDC={setDisplayDetailContents} />
                </div>
            </div>
            {isPopUp &&
                (<div className='category-popup-wrap'>
                    <div className='cpw-margin1' onClick={togglePopUp}></div>
                    <div className='category-popup-wrap2'>
                        <div className='cpw-margin2' onClick={togglePopUp}>×</div>
                        <div className='category-popup'>
                            <div className='category-popup-title'>絞り込み</div>
                            <div className='category-popup-categories'>
                                <button className={'filter' + (filter[2] ? "" : " inactive")} id='-1' onClick={toggleFavorite}>お気に入り</button>
                                {list}
                            </div>
                        </div>
                        <div className='cpw-margin2' onClick={togglePopUp}></div>
                    </div>
                    <div className='cpw-margin1' onClick={togglePopUp}></div>
                </div>)
            }
            {(displayingDetail >= 0) &&
                (<DisplayDetail displayDetailContents={displayDetailContents} setDisplayingDetail={setDisplayingDetail} />)
            }
        </div>
    );
}

export default Search;