import './OnAir.css'

function OnAir() {
    return (
        <div className="onair-con">
            <h6>ー 🔥 熱 演 中 🔥 ー</h6>
            <h5>ー N E X T ー</h5>
            <div className="stage type-stage">
                <div className="stage-title">
                    <h3>ステージ</h3>
                </div>
                <h2>王点</h2>
                <h4>～ドカ笑い～</h4>
                <div className="row-border"/>
                <h4>13:00~</h4>
                <h2>外れ値</h2>
                <h4>～This is Tokai!～</h4>
            </div>
            {/* <div className="columm-border"/> */}
            <div className="stage type-kodo">
                <div className="kodo-title">
                    <h3>講堂</h3>
                </div>
                <h2>てるみどおる</h2>
                <h4>♪ピースサイン</h4>
                <div className="row-border"/>
                <h4>13:10~</h4>
                <h2>Rebit</h2>
                <h4>♪紅</h4>
            </div>
        </div>


    )
}

export default OnAir;