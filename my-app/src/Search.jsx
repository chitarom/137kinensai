import './Search.css'
import data from './JSON/ProjectData.json'
import categories from './JSON/Categories.json'
import FilterButton from './SearchComponents/FilterButton.jsx';
import TicketList from './SearchComponents/TicketList.jsx'; import { useState } from 'react';
'./TicketList.jsx';

function Search() {
    //FavoriteかどうかはlocalStorageに保存
    const [isPopUp, setPopUp] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [filter, setFilter] = useState([[], 10]);
    const search = (e) => { setKeyword(e.target.value); }
    const changeFilterList = [template(10), template(11), template(7), template(8), template(9)];
    function template(int) { return () => { setFilter([filter[0], int]); } };
    const setFilterList = [];
    categories.map((category) => setFilterList.push(temp(category)));
    function temp(str) {
        //filter[0] (categories) の中身を変更する関数のテンプレート
        return () => {
            console.log("filter: " + filter);
            var filt0 = filter[0].includes(str) ? filter[0].slice(0, filter[0].indexOf(str)).concat(filter[0].slice(filter[0].indexOf(str) + 1)) : false;
            if (!filt0) { filt0 = filter[0]; filt0.push(str); }
            setFilter([filt0, filter[1]]);
        };
    }

    const filterButton = (str, id) => {
        return <button className={'filter' + (filter[0].includes(str) ? '' : ' inactive')} id={id} onClick={setFilterList[id - 1]}>{str}</button>;
    }
    const list = [];
    for (let i = 0; i < categories.length; i++)
        list.push(filterButton(categories[i], (i + 1)));

    const togglePopUp = () => {
        setPopUp(!isPopUp);
    }

    return (
        <div>
            <div className='search-wrap'>
                <input className='search-box2' type="text" id='keyword' onChange={search} placeholder='キーワードを入力...' />
            </div>
            <div className='filter-wrap'>
                <div className='filter-list'>
                    <button className='first-filter filter' id='0' onClick={togglePopUp}>絞り込む</button>
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
                    <TicketList keyword={keyword} filter={filter} />
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
                                {list}
                            </div>
                        </div>
                        <div className='cpw-margin2' onClick={togglePopUp}></div>
                    </div>
                    <div className='cpw-margin1' onClick={togglePopUp}></div>
                </div>)
            }
        </div>
    );
}

export default Search;