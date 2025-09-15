import "./StageVote.css"
import grouplist from "./JSON/ProjectData.json"
import { useState, useEffect } from "react";

function StageVote() {
    const [selectedGroup, setSelectedGroup] = useState()
    const [voted, setVoted] = useState()
    const [currentPage, setCurrentPage] = useState(0)
    const today = new Date();
    const month = today.getMonth(); // 0〜11 → 9月は「8」
    const date = today.getDate()

    useEffect(() => {
        const value = localStorage.getItem("selectedGroup")
        setSelectedGroup(value)
        const value2 = localStorage.getItem("voted")
        setVoted(value2)
    })


    const handleSelect = (groupName) => {
        localStorage.setItem("selectedGroup", groupName);
        alert(`${groupName} に投票候補を保存しました`);
        setSelectedGroup(groupName);
    };

    const handleVoted = (groupName) => {
        localStorage.setItem("voted", "voted");
        alert(`${groupName} に投票候補を保存しました`);
        setVoted("voted")
    };

    const checkSelected = (groupName) => {
        return groupName === selectedGroup;
    }

    return (
        <div className="vote-con">
            <div className="vote-title-con">
                <h2>STAGE</h2>
                <div className="vote-title-exp">
                    <p>　東海生の東海生による東海生のための個性の祭典。 今年度は、例年大きな盛り上がりを見せるTKI48やジャグリング部など、過去最多17組のパフォーマーが出演。年に一度のどこよりも自由な大会が幕を開ける。</p>
                    <img src="/pictures/stageposter.png" alt="加治屋の画像" />

                </div>

            </div>
            <div className="vote-subtitle-con">
                <div className="vote-subtitle">
                    <h4>どのパフォーマーが一番良かったか投票しよう！</h4>

                </div>
                <div className="vote-subtitle red">
                    <h4>※一度投票したら変更はできません！</h4>
                </div>
                <div className="vote-subtitle reverse">
                    <h4>{voted == "voted" ? "投票完了" : "選択中"}:{selectedGroup}</h4>
                </div>

            </div>

            <div className="sc-day-con"><h2>27(土)</h2></div>
            {grouplist.filter(item => item[0] === 'ステージ' && item[7][0] === 'sat').map(item => (
                <div role="button" key={item[1]} className="row-con" style={{ backgroundImage: `url(${item[4]})` }}>
                    <div className="time-con">
                        <p>{item[7][1]}:{item[7][2]}</p>
                        <p>～</p>
                        <p>{item[7][3]}:{item[7][4]}</p>
                    </div>
                    <div className="group-detail-con">
                        <p>{item[7][5]}・{item[7][6]}</p>
                        <h2>{item[1]}</h2>
                        <p className="subtitle">{item[3]}</p>
                    </div>

                    {voted != "voted" && <div className="vote-check-box">
                        <h6>選択する</h6>

                        <div className="vote-check-box">
                            <button onClick={() => handleSelect(item[1])}>{checkSelected(item[1]) ? "■" : "□"}</button>
                        </div>

                    </div>}
                </div>
            ))}
            <div className="sc-day-con sun"><h2>28(日)</h2></div>
            {grouplist.filter(item => item[0] === 'ステージ' && item[7][0] === 'sun').map(item => (
                <div role="button" key={item[1]} className="row-con" style={{ backgroundImage: `url(${item[4]})` }}>
                    <div className="time-con">
                        <p>{item[7][1]}:{item[7][2]}</p>
                        <p>～</p>
                        <p>{item[7][3]}:{item[7][4]}</p>
                    </div>
                    <div className="group-detail-con">
                        <p>{item[7][5]}・{item[7][6]}</p>
                        <h2>{item[1]}</h2>
                        <p className="subtitle">{item[3]}</p>
                    </div>
                    <div className="vote-check-box">
                        <button onClick={() => handleSelect(item[1])}>{checkSelected(item[1]) ? "■" : "□"}</button>
                    </div>
                </div>
            ))}
            {voted != "voted" && month > 8 && date > 26 && <>
                <div className="vote-button">
                    <button className={selectedGroup ? "checked" : "unchecked"} onClick={() => {
                        if (selectedGroup) {
                            setCurrentPage(1);
                        }
                    }}>投票する！</button>
                </div>
                {currentPage != 0 && <div className="vote-attention-con" onClick={() => setCurrentPage(0)}>
                    <div className="vote-attention" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedGroup}</h2>
                        <p>に投票します</p>
                        <h3>※投票はやり直せません！</h3>
                        <button onClick={handleVoted}>投票する</button>

                    </div>

                </div>}
            </>}


        </div>

    )
}

export default StageVote;