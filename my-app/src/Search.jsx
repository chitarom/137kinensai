import './Search.css'
import data from './JSON/ProjectData.json'
import TicketList from './SearchComponents/TicketList.jsx';import { useState } from 'react';
 './TicketList.jsx';

function Search() {
    //FavoriteかどうかはlocalStorageに保存
    const [keyword,setKeyword] = useState("");
    const [filter,setFilter] = useState([[],10]);
    const search = (e) => {setKeyword(e.target.value);}
    const changeFilterAll = () => {setFilter([[],10]);}
    const changeFilterClass = () => {setFilter([[],11]);}
    const changeFilterStage = () => {setFilter([[],7]);}
    const changeFilterKodo = () => {setFilter([[],8]);}
    const changeFilterYusi = () => {setFilter([[],9]);}
    return (
        <div>
            <div className='search-wrap'>
                <input className='search-box2' type="text" id='keyword' onChange={search} placeholder='キーワードを入力...' />
            </div>
            <div className='filter-wrap'>
                <div className='filter-list'>
                    <button className='filter inactive' id='0'>フィルタ0</button>
                    <button className='filter inactive' id='1'>フィルタ1</button>
                    <button className='filter inactive' id='2'>フィルタ2</button>
                    <button className='filter inactive' id='3'>フィルタ3</button>
                    <button className='filter inactive' id='4'>フィルタ4</button>
                </div>
            </div>
            <div className='content'>
                <div className='tabs'>
                    <button className={"tab" + (filter[1] == 10 ? " active" : "")} onClick={changeFilterAll}>すべて</button>
                    <button className={"tab" + (filter[1] == 11 ? " active" : "")} onClick={changeFilterClass}>クラス企画</button>
                    <button className={"tab" + (filter[1] == 7 ? " active" : "")} onClick={changeFilterStage}>ステージ</button>
                    <button className={"tab" + (filter[1] == 8 ? " active" : "")} onClick={changeFilterKodo}>講堂</button>
                    <button className={"tab" + (filter[1] == 9 ? " active" : "")} onClick={changeFilterYusi}>有志</button>
                </div>
                <div className='tickets'>
                    <TicketList keyword={keyword} filter={filter} />
                </div>
            </div>
        </div>
    );
}

export default Search;