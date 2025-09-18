import "./Mogiten.css"
import { useState } from "react";
import grouplist from "./JSON/Mogiten.json"

function Mogiten() {
    const [displayTab, setDisplayTab] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    return (
        <div className="mogi-wrapper">
            <img className="mogi-title" src="/pictures/mogi.png" alt="" />
            <div className="mogi-con">
                <p>高校3年生による模擬店で、研究と努力を積み重ねて作られた様々な食品が出品されます。熱中症予防として飲料販売も行われます。正門から入って左手にあるよ！</p>
                {grouplist.map(item => (
                    <div className="mogi-box">
                        <div className="mogi-box-title">
                            <p>{item[0]}</p>
                            <h2>{item[1]}</h2>
                            <button onClick={() => setDisplayTab(prev => {
                                const newTab = [...prev]; 
                                newTab[item[4]] = (newTab[item[4]] + 1) % 2;     
                                return newTab;
                            })}>{displayTab[item[4]] != 0 ? "x" : "v"}</button>
                        </div>
                        {displayTab[item[4]] != 0 && <div className="mogi-box-passage">
                            <h4>販売商品：{item[2]}</h4>
                            <p>{item[3]}</p>

                        </div>}
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Mogiten;