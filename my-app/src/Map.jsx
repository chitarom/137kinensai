import { useState } from 'react';
import './Map.css'

function Map() {
    const [displayMap, setDisplayMap] = useState(1);
    const changeDisplayMap = [temp(0),temp(1),temp(2),temp(3),temp(4)];
    function temp(int) {
        return () => {setDisplayMap(int);}
    }
    return (
        <div className='map-parent'>
            <div className='map-list'>
                <canvas className={'map' + (displayMap == 0 ? ' showing' : '')} id='map-mogi'></canvas>
                <canvas className={'map' + (displayMap == 1 ? ' showing' : '')} id='map-floor1'></canvas>
                <canvas className={'map' + (displayMap == 2 ? ' showing' : '')} id='map-floor2'></canvas>
                <canvas className={'map' + (displayMap == 3 ? ' showing' : '')} id='map-floor3'></canvas>
                <canvas className={'map' + (displayMap == 4 ? ' showing' : '')} id='map-floor45'></canvas>
            </div>
            <div className='map-switches'>
                <button className={'map-switch' + (displayMap == 0 ? ' active' : '')} onClick={changeDisplayMap[0]}>模擬店</button>
                <button className={'map-switch' + (displayMap == 1 ? ' active' : '')} onClick={changeDisplayMap[1]}>1F</button>
                <button className={'map-switch' + (displayMap == 2 ? ' active' : '')} onClick={changeDisplayMap[2]}>2F</button>
                <button className={'map-switch' + (displayMap == 3 ? ' active' : '')} onClick={changeDisplayMap[3]}>3F</button>
                <button className={'map-switch' + (displayMap == 4 ? ' active' : '')} onClick={changeDisplayMap[4]}>4-5F</button>
            </div>
        </div>
    )
}

export default Map;