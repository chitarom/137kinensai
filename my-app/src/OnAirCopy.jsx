import './OnAirCopy.css'
import link from '/pictures/link.png'
import map from '/pictures/map.png'
import schedule from '/pictures/schedule.png'

function OnAirCopy() {
    return (
        <div className="onair-con">
            <div className="stage type-stage">
                <div className="left-part">
                    <h3> ステージ企画</h3>
                    <h4>12:40~13:00</h4>
                    <h2 className="group-name">横転</h2>
                    <h2 className="subtitle">～ドカ笑い～</h2>
                    <p><span className="blue">NEXT>></span>外れ値</p>
                    <p className="next-time">13:00~13:20</p>
                </div>
                <div className="right-part">
                    <h2 className="live">@LIVE</h2>
                    <button className="button">特設ページ<img src={link}/></button>
                    <br />
                    <button className="button">予定表を見る<img src={schedule}/></button>
                    <br />
                    <button className="button">ステージに行く<img src={map}/></button>
                </div>




            </div>


        </div>


    )
}

export default OnAirCopy;