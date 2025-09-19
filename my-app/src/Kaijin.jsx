import "./Kaijin.css"
import { useState } from "react";
import grouplist from "./JSON/KaijinList.json"

function Kaijin() {
    const [activeExplanation, setActiveExplanation] = useState(0)
    const [currentRule, setCurrentRule] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)


    return (
        <div className="kaijin-con">
            <div className="kj-title-con">
                <img src="/pictures/kaijinlogo.png" alt="" />
            </div>
            <div className="kj-explanation-con">
                <button className="kj-ex-button" onClick={() => setActiveExplanation(prev => (prev + 1) % 2)}>海神とは <span className="oo8cff">{activeExplanation === 1 ? '▲' : '▼'}</span></button>
                {activeExplanation == 1 && <p>
                    「海神」とは134周年創立記念祭から毎年日曜日の午後に開催されている東海高校1、2年による実況解説大会です。事前オーディションによって選ばれた出演者によって大迫力の戦いが繰り広げられます。実行委員から選出された実況、解説が出場者のプレイを彩り、記念祭を最後の最後まで盛り上げます。

                </p>}
            </div>
            <div className="kj-rule-con">
                <h2>{currentPage == 1 ? "パフォーマー一覧" : "ルール説明"}</h2>
                <div className="kj-rule-button-con">
                    <button className={`kj-rule-button ${currentRule != 0 ? "unselected" : ""}`} onClick={() => setCurrentRule(0)}>スマブラ</button>
                    <button className={`kj-rule-button ${currentRule != 1 ? "unselected" : ""}`} onClick={() => setCurrentRule(1)}>スプラ</button>
                </div>
                {currentPage == 0 && <>{currentRule == 0 && <div className="kj-rule-exp-con">
                    <div className="kj-rule-pas">
                        <p>・パフォーマーは8名</p>
                        <p>・トーナメント方式</p>
                        <p>・準々決勝、準決勝、決勝の計7戦</p>
                        <p>・1対1、全試合2本先取で行う。</p>
                        <p>・ストック制でストック数は3</p>
                        <p>・制限時間は7分</p>
                    </div>


                </div>}
                    {currentRule == 1 && <div className="kj-rule-exp-con">
                        <div className="kj-rule-pas">
                            <p>・パフォーマーは4チーム16名</p>
                            <p>・トーナメント方式</p>
                            <p>・対戦数は準決勝2戦と決勝の計3戦</p>
                            <p>・4人対4人、2本先取で行う。</p>
                            <p>・試合ルールはナワバリバトル以外を全て使用できる。</p>
                        </div>


                    </div>}</>}
                {currentPage == 1 && <>
                    <div className="kj-group-list-con">
                        {currentRule == 0 && <>
                            {grouplist.filter(item => item[0] === 'スマブラ').map(item => (
                                <div className="kj-group-con sumabura">
                                    <h2>{item[1]}</h2>
                                    <p>PN: {item[2]}</p>
                                </div>

                            ))}</>}
                        {currentRule == 1 && <>
                            {grouplist.filter(item => item[0] === 'スプラ').map(item => (
                                <div className="kj-group-con supura">
                                    <h2>{item[1]}</h2>
                                    <p>{item[2]}</p>
                                </div>

                            ))}</>}
                    </div>
                </>}



            </div>
            <button className="kj-change-button" onClick={() => setCurrentPage(prev => (prev + 1) % 2)}>{currentPage == 0 ? "パフォーマー一覧" : "ルール説明"}</button>

        </div>
    )
}

export default Kaijin;
