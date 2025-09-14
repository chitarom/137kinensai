import "./StageVote.css"
import grouplist from "./JSON/ProjectData.json"

function StageVote() {
    return (
        <div className="vote-con">
            <div className="vote-title-con">
                <h2>STAGE</h2>
                <div className="vote-title-exp">
                    <p>　東海生の東海生による東海生のための個性の祭典。 今年度は、例年大きな盛り上がりを見せるTKI48やジャグリング部など、過去最多20組のパフォーマーが出演。年に一度のどこよりも自由な大会が幕を開ける。</p>
                    <img src="/pictures/stageposter.png" alt="加治屋の画像" />

                </div>

            </div>
            <div className="vote-subtitle">
                <h4>どのパフォーマーが一番良かったか投票しよう！</h4>
                
            </div>
            <div className="vote-subtitle red">
                <h4>※一度投票したら再投票はできません</h4>
            </div>
            {grouplist.filter((item => item[0] === 'ステージ') || (item => item[7][0] === 'sat')).map(item => (
                        <div role="button" key={item[1]} className="row-con">
                            <div className="time-con">
                                <p>{item[7][1]}:{item[7][2]}</p>
                                <p>～</p>
                                <p>{item[7][3]}:{item[7][4]}</p>
                            </div>
                            <div className="group-detail-con">
                                <p>{item[7][6]}・{item[7][7]}</p>
                                <h2>{item[1]}</h2>
                                <p className="subtitle">{item[3]}</p>
                            </div>
                        </div>

                    ))}
        </div>

    )
}

export default StageVote;