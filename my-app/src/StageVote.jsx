import "./StageVote.css"
import grouplist from "./JSON/ProjectData.json"
import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function StageVote() {
    const [selectedGroup, setSelectedGroup] = useState()
    const [voted, setVoted] = useState()
    const [currentPage, setCurrentPage] = useState(0)
    const [userIP, setUserIP] = useState(null)
    const [existIP, setExistIP] = useState(false)
    const today = new Date();
    const startDate = new Date(2025, 8, 27, 12); // 0〜11 → 9月は「8」
    const endDate = new Date(2025, 8, 28, 14);


    const getIP = async () => {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        console.log("あなたのIP:", data.ip);
        setUserIP(data.ip);
        return data.ip;
    };

    const fetchIPs = async () => {
        let ips = [];
        const { data, error } = await supabase
            .from("vote")
            .select("ip")
            .order('id', { ascending: true });
        if (error) {
            console.error("取得エラー:", error);
        } else {
            ips = data.map(item => item.ip);
            console.log("取得したIPリスト:", ips);
        }
        return ips;
    };

    useEffect(() => {
        const checkIP = async () => {
            const iplist = await fetchIPs();
            const userIP = await getIP();
            console.log("このIPは既に投票済み？", existIP);
            setExistIP(iplist.includes(userIP));
        };
        checkIP();
    }, []);


    useEffect(() => {
        const value = localStorage.getItem("selectedGroup")
        setSelectedGroup(value)
        const value2 = localStorage.getItem("voted")
        setVoted(value2)
    }, [])

    useEffect(() => {
        if (selectedGroup && today >= endDate && voted != "voted") {
            handleVoted(selectedGroup)

        }
    }, [])

    useEffect(() => { console.log(today); }, []); // 確認用

    const handleSelect = (groupName) => {
        localStorage.setItem("selectedGroup", groupName);
        alert(`${groupName} に投票候補を保存しました`);
        setSelectedGroup(groupName);
    };

    const handleVoted = async (groupName) => {

        const { error } = await supabase
            .from("vote")
            .insert([{
                name: groupName,
                ip: userIP

            }]);
        if (error) {
            console.error("追加エラー:", error);
        } else {
            console.log("追加成功！");
            localStorage.setItem("voted", "voted");
            alert(`${groupName} に投票しました`);
            setVoted("voted");
            setCurrentPage(0);
        }
    };

    const checkSelected = (groupName) => {
        return groupName === selectedGroup;
    }

    return (
        <div className="vote-con">
            <div className="vote-title-con">
                <h2>STAGE</h2>
                <div className="vote-title-exp">
                    <p>　東海生の東海生による東海生のための個性の祭典。 今年度は、例年大きな盛り上がりを見せるTKI48やジャグリング部など、過去最多17組のパフォーマーが出演。年に一度のどこよりも自由な大会が幕を開ける。
                        <br />投票可能期間　:　9/27(土)　12:00　～　9/28(日)　14:27
                    </p>
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
                    <h4>{voted == "voted" || existIP ? "投票完了" : "選択中"}:{selectedGroup}</h4>
                </div>

            </div>

            <div className="sc-day-con"><h2>27(土)</h2></div>
            {grouplist.filter(item => item[0] === 'ステージ' && item[7][0] === 'sat' && item[7][6] !== "クイズ" && item[7][6] !== "合奏").map(item => (
                <div role="button" key={item[1]} className="row-con" style={{ '--bg-image': `url(/pictures/${item[5][0]})` }}>
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
            {grouplist.filter(item => item[0] === 'ステージ' && item[7][0] === 'sun' && item[7][6] !== "クイズ" && item[7][6] !== "合奏").map(item => (
                <div role="button" key={item[1]} className="row-con" style={{ '--bg-image': `url(/pictures/${item[5][0]})` }}>
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
            {/*正確にはこうなりそう*/}
            {today < startDate ? <>
                <div className="vote-button">
                    <button className="unchecked" disabled={true}>投票は27日(土)12:00～</button>
                </div>
            </> : today > endDate ? <>
                <div className="vote-button">
                    <button className="unchecked" disabled={true}>投票は終了しました</button>
                </div>
            </> : voted == "voted" || existIP ? null : <>
                <div className="vote-button">
                    <button className={selectedGroup ? "checked" : "unchecked"} onClick={() => {
                        if (selectedGroup) {
                            setCurrentPage(1);
                            window.scrollTo({ top: 100, behavior: "smooth" });
                        }
                    }}>投票する！</button>
                </div>
                {currentPage != 0 && <div className="vote-attention-con" onClick={() => setCurrentPage(0)}>
                    <div className="vote-attention" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedGroup}</h2>
                        <p>に投票します</p>
                        <h3>※投票はやり直せません！</h3>
                        <button onClick={() => { handleVoted(selectedGroup) }}>投票する</button>
                        <button onClick={() => { setCurrentPage(0) }}>やり直す</button>
                    </div>

                </div>}
            </>
            }

        </div>

    )
}

export default StageVote;