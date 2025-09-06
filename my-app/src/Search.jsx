import './Search.css'
import TicketList from './SearchComponents/TicketList.jsx'; './TicketList.jsx';

function Search() {
    //FavoriteかどうかはlocalStorageに保存
    return (
        <div>
            <div className='search-wrap'>
                <input className='search-box2' type="text" id='keyword' />
                <button className='search'>検索</button>
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
            <div className='tickets'>
                <TicketList />
            </div>
        </div>
    );
}

export default Search;