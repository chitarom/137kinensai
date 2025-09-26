import './Schedule.css';
import { useRef, useEffect, useState } from 'react';
import grouplist from './JSON/ProjectData.json'
import { useLocation } from 'react-router-dom';
import DisplayDetail from './DisplayDetail';
import { supabase } from './supabase';

function Schedule() {
    const location = useLocation();
    const scrollContainerRef = useRef(null);
    const boxRef = useRef(null);
    const [activeTab, setActiveTab] = useState('kodo');
    const [currentPage, setCurrentPage] = useState(1);
    let KodoGroupList = []
    let StageGroupList = []
    const [currentTab, setCurrentTab] = useState('kodo');
    const [displayingDetail, setDisplayingDetail] = useState(-1);
    const [displayDetailContents, setDisplayDetailContents] = useState(["", "", "", [], [], ""]);
    const [stage, setStage] = useState(false);

    // 倍数(設定済み)
    const multiplier = 2;
    // const [now, setNow] = useState(new Date());
    const [now, setNow] = useState(new Date()); // 現在時刻 もしテストしたいならここに時刻を入れる
    const [stageDelay, setStageDelay] = useState(0);
    const [kodoDelay, setKodoDelay] = useState(0);

    // タイムテーブル情報
    const dayConfigs = {
        sat: {
            label: "27(土)",
            date: "2025-09-27",
            startHour: 12,
            endHour: 16,
            hours: [12, 13, 14, 15, 16],  // 時刻の範囲
            borderCount: 5 * 3 - 1            // 線の数
        },
        sun: {
            label: "28(日)",
            date: "2025-09-28",
            startHour: 9,
            endHour: 15,
            hours: [9, 10, 11, 12, 13, 14, 15],
            borderCount: 7 * 3 - 1
        }
    };

    // 一定間隔で自動更新
    useEffect(() => {
        // return;
        const timer = setInterval(async () => {
            // setNow(new Date((new Date()).getTime() + (24 * 60 * 60 - 24 * 60) * 1000));
             setNow(new Date());
            // 遅延更新
            const { data, error } = await supabase
                .from("delay")
                .select("*")
                .order("id", { ascending: true })
                .limit(1);

            if (error) console.error("取得エラー", error);
            else {
                setStageDelay(parseInt(data[0].stage));
                setKodoDelay(parseInt(data[0].kodo));
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        console.log("Schedule mounted");

        const params = new URLSearchParams(window.location.search); // ← React Router依存回避
        console.log("search params:", params.toString());
        if (params.get("type") === "1") {
            console.log("currentTabをstageに変更");
            setCurrentTab('stage');
        }
    }, []);



    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return; // ← これが重要！

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const boxWidth = boxRef.current?.offsetWidth || 0;

            setActiveTab(scrollLeft < boxWidth / 2 ? 'kodo' : 'stage');
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [currentPage]);

    useEffect(() => { setStage(currentTab === 'stage'); }, [currentTab]);

    function truncateText(text, maxLength) {
        return text.length > maxLength
            ? text.substring(0, maxLength) + '…'
            : text;
    }





    const scrollToRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                left: scrollContainerRef.current.scrollWidth,
                behavior: 'smooth'
            });
        }
    };

    const scrollToLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        }
    };


    // const KodoGroupList = [
    //     { label: '団体1', day: 'sat', starthour: '12', startminute: '00', finishhour: '12', finishminute: '30' },
    //     { label: '団体3', day: 'sat', starthour: '13', startminute: '30', finishhour: '14', finishminute: '10' },
    //     { label: '七文字のバンド', day: 'sun', starthour: '9', startminute: '30', finishhour: '9', finishminute: '40' },
    //     { label: '六字のバンド', day: 'sun', starthour: '9', startminute: '40', finishhour: '9', finishminute: '50' }
    // ]

    function createList(list, newlist, length) {
        for (let i = 0; i < length; i++) {
            if ((list[i][0] == "講堂" && newlist == KodoGroupList) || (list[i][0] == "ステージ" && newlist == StageGroupList)) {
                const object = {
                    label: list[i][1],
                    day: list[i][7][0],
                    starthour: list[i][7][1],
                    startminute: list[i][7][2],
                    finishhour: list[i][7][3],
                    finishminute: list[i][7][4],
                    category: list[i][7][5],
                    category2: list[i][7][6],
                    subtitle: list[i][3],
                    images: list[i][5],
                    id: list[i][6],
                    "i": i,
                    ongoing: false
                };
                newlist.push(object);
            }


        }
        return newlist;
    }
    createList(grouplist, KodoGroupList, grouplist.length)
    createList(grouplist, StageGroupList, grouplist.length)





    // const StageGroupList = [
    //     { label: '団体2', day: 'sat', starthour: '13', startminute: '20', finishhour: '16', finishminute: '00' }
    // ]

    function calculateBoxSize(list) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].day == 'sat') {
                list[i].starttime = (parseInt(list[i].starthour) - 12) * 60 + parseInt(list[i].startminute)
                list[i].finishtime = (parseInt(list[i].finishhour) - 12) * 60 + parseInt(list[i].finishminute)
            } else {
                list[i].starttime = (parseInt(list[i].starthour) - 9) * 60 + parseInt(list[i].startminute)
                list[i].finishtime = (parseInt(list[i].finishhour) - 9) * 60 + parseInt(list[i].finishminute)
            }
            list[i].timelength = (list[i].finishtime - list[i].starttime);
        }
    }
    calculateBoxSize(KodoGroupList);
    calculateBoxSize(StageGroupList);

    const showDetail = (item) => {
        return () => {
            console.log("sdetail");
            setDisplayingDetail(item.i);
            setDisplayDetailContents([item.category + "・" + item.category2, item.label, item.subtitle, [], item.images, item.id]);
        }
    };

    const calcFontSize = (text, timelength, base = 22, coef1 = 1, coef2 = 1.1, shortCoef = 1) => {
        const length = text.length;
        let fontSize = base;
        // 十分長いなら問題なし
        if (timelength >= 20) return fontSize;

        // 文字数に応じた基本縮小
        if (length <= 8) fontSize *= 1;
        else if (length >= 15) fontSize *= 1 / (15 / 8) * coef2;
        else fontSize *= ((8 / length) * coef1);
        // timelength が 4 以下ならさらに倍率を掛ける
        if (timelength <= 4) {
            fontSize *= (timelength / 5) * shortCoef;
        }
        return fontSize;
    };

    const calcPadding = (timelength) => {
        if (timelength >= 5) {
            return 0;
        } else {
            return 0;
            return timelength * multiplier;
        }
    };


    // 現在時刻の縦位置を計算
    const getNowTopFor = (dayKey) => {
        const cfg = dayConfigs[dayKey];
        const totalMinutes = now.getHours() * 60 + now.getMinutes();
        const startBase = cfg.startHour * 60; // ← 12:00 や 9:00 を基準にする
        const relativeMinutes = totalMinutes - startBase;

        if (relativeMinutes < -8) return -8; // -8分許す
        if (relativeMinutes > (cfg.endHour - cfg.startHour) * 60 + 22) { // +22分許す
            return ((cfg.endHour - cfg.startHour) * 120 + 25 + 2) * multiplier;
        }

        return (relativeMinutes * 2 + 20 + 2) * multiplier;
    };


    // 現在時刻・赤線を表示するかどうか
    const shouldDisplayNowFor = (dayKey) => {
        const cfg = dayConfigs[dayKey];

        // 現在日時を "YYYY-MM-DD" 形式に整形
        const currentDateStr = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0"),
        ].join("-");

        // 日付チェック
        const isTargetDate = currentDateStr === cfg.date;
        // 時間チェック (開始-8分～終了+22分まで)
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const startMinutes = cfg.startHour * 60 - 8;   // 開始8分前
        const endMinutes = cfg.endHour * 60 + 22;      // 終了22分後

        return isTargetDate && nowMinutes >= startMinutes && nowMinutes <= endMinutes;
    };

    /*
    const scrollToNow = (val) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: val,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        if (!shouldDisplayNowFor('sat') || !shouldDisplayNowFor('sun')) return;
        if (displayingDetail || currentPage == 0) return;
        if (shouldDisplayNowFor('sat')) {
            scrollToNow(getNowTopFor('sat') - 6.2 * multiplier);
            return;
        }
        if (shouldDisplayNowFor('sun')) {
            scrollToNow(getNowTopFor('sun') - 6.2 * multiplier);
            return;
        }

    }, [displayingDetail, currentPage]); */

    const isOngoing = (item) => {
        const itemStart = item.starthour * 60 + item.starttime; // 分換算
        const itemEnd = item.finishhour * 60 + item.finishminute;
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        return currentMinutes >= itemStart && currentMinutes < itemEnd;
    };

    /*
    色の更新
    useEffect(() => {
        const updateList = (list) => {
            for (let i = 0; i < list.length; i++) {
                list[i].ongoing = isOngoing(list[i]);
                console.log(list[i].ongoing);
            }
        };
        updateList(KodoGroupList);
        updateList(StageGroupList);
    }, [now]);
    */

    const showDelay = (delay) => {
        if (delay == 0) return "遅れなし";
        else if (delay > 0 && delay < 60) return `${delay}分遅れ`;
        else if (delay < 0 && delay > -60) return `${delay * (-1)}分巻き`;
        else return null;
    };

    const shouldDisplayBlue = (dayKey, time) => {
        const cfg = dayConfigs[dayKey];

        // 現在日時を "YYYY-MM-DD" 形式に整形
        const currentDateStr = [
            time.getFullYear(),
            String(time.getMonth() + 1).padStart(2, "0"),
            String(time.getDate()).padStart(2, "0"),
        ].join("-");

        // 日付チェック
        const isTargetDate = currentDateStr === cfg.date;
        // 時間チェック (開始-8分～終了+22分まで)
        const nowMinutes = time.getHours() * 60 + time.getMinutes();
        const startMinutes = cfg.startHour * 60 - 8;   // 開始8分前
        const endMinutes = cfg.endHour * 60 + 22;      // 終了22分後

        return isTargetDate && nowMinutes >= startMinutes && nowMinutes <= endMinutes;
    };

    return (
        <div className="schedule-page">
            {(displayingDetail >= 0) &&
                (<DisplayDetail displayDetailContents={displayDetailContents} setDisplayingDetail={setDisplayingDetail} scheduled={true} displaystage={stage & false} />)
            }
            {
                <button className="page-changer" onClick={() => { setCurrentPage(prev => (prev + 1) % 2); setActiveTab("kodo"); }} >{currentPage === 0 ? '一覧表示' : 'タイムテーブル'}</button>
            }
            {currentPage == 0 && <>
                <div className="ko-or-st-con">
                    <div className="kodo-or-stage">
                        <button onClick={() => scrollToLeft()} className={`kodo-button ${activeTab === 'kodo' ? 'active' : ''}`} >
                            講堂企画
                        </button>

                        <button onClick={() => scrollToRight()} className={`kodo-button ${activeTab === 'stage' ? 'active' : ''}`} >
                            ステージ企画
                        </button>
                    </div>
                </div>

                <div className="schedule-page-con-con" ref={scrollContainerRef}>
                    {/* 土日・講堂ステージを完全にまとめたよ */}
                    {Object.entries(dayConfigs).map(([dayKey, config]) => (
                        <div key={dayKey}>


                            {/* 見出し */}
                            <div className={`sc-day-con ${dayKey}`}>
                                <h2>{config.label}</h2>
                            </div>

                            <div className="schedule-page-con">
                                <>
                                    {/* 仕切り線 */}
                                    <div className="row-border-con">
                                        {Array.from({ length: config.borderCount }).map((_, idx) => (
                                            <div key={idx} className={`row-border ${idx % 3 == 0 ? "main" : "sub"}`} />
                                        ))}
                                    </div>

                                    {/* 時間目盛り */}
                                    <div className="timesheet left">
                                        {config.hours.map((h) => (
                                            <h1 key={h}>{h}</h1>
                                        ))}

                                        {/* 現在時刻（赤字） */}
                                        {(shouldDisplayNowFor(dayKey) && displayingDetail === -1) && (
                                            (() => {
                                                const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
                                                    .getMinutes()
                                                    .toString()
                                                    .padStart(2, "0")}`;
                                                const oneCount = (timeStr.match(/1/g) || []).length; // '1'の出現回数(1は短いから)
                                                const leftOffset = oneCount * 1.5 + 2; // 1px * 1の出現数 + 2px

                                                let delta = 0;
                                                const basetop = getNowTopFor(dayKey) - 6.2 * multiplier;
                                                const nowminutes = now.getMinutes();
                                                let delayminutes = nowminutes;
                                                let delaytop;
                                                if (kodoDelay >= 0 && kodoDelay <= 3) {
                                                    delaytop = basetop - 14;
                                                    delayminutes -= 4;
                                                    delta -= 4 * 60 * 1000;
                                                }
                                                else if (kodoDelay < 0 && kodoDelay >= -3) {
                                                    delaytop = basetop + 18;
                                                    delayminutes += 5;
                                                    delta += 5 * 60 * 1000;
                                                }
                                                else {
                                                    delaytop = basetop - kodoDelay * multiplier * 2;
                                                    delayminutes -= kodoDelay;
                                                    delta -= kodoDelay * 60 * 1000;
                                                }
                                                // console.log(delayminutes);

                                                if ((delayminutes + 60) % 60 < 4 || (delayminutes + 60) % 60 > 60 - 4) {
                                                    const modify = 12;
                                                    if (delayminutes >= 0 && delayminutes <= 60) {
                                                        // 同じ側に
                                                        if (nowminutes >= delayminutes) delayminutes = 60 - modify;
                                                        if (nowminutes < delayminutes) delayminutes = modify;
                                                    }
                                                    else {
                                                        // 異なる側に
                                                        if (delayminutes < nowminutes) delayminutes = -1 * modify;
                                                        if (delayminutes >= nowminutes) delayminutes = 60 + modify;
                                                    }
                                                    delaytop = basetop + (delayminutes - nowminutes) * multiplier * 2;
                                                }

                                                /* 
                                                delayminutes=now.getMinutes()で初期化
                                                basetop=getNowTopFor(dayKey)-6.2*multiplierで初期化
                                                時間差が3巻きならdelaytop=basetop-14,(4min相当) delayminutes+=4
                                                そうでなくもし時間差が3遅れならdelaytop=basetop+18,(5min相当)delayminutes-=5
                                                そうでないならdelaytop=basetop-kododelay*multiplier*2

                                                このときのdelayminutesについて
                                                重なっていないならそのまま
                                                そうでなくもし、nowとdelayがおなじ側にあるなら±9分固定
                                                */


                                                return (
                                                    // true はずして
                                                    (true || shouldDisplayBlue(dayKey, new Date(now.getTime() + delta))) && (<>
                                                        <h4
                                                            className="current-time-h4"
                                                            style={{
                                                                // 遅れを反映(1分 = 2px * multiplier)
                                                                top: `${basetop}px`,
                                                                left: `${leftOffset}px`
                                                            }}
                                                        >
                                                            {timeStr}
                                                        </h4>
                                                        <p
                                                            className="current-time-delay"
                                                            style={{
                                                                top: `${delaytop}px`, // h4の少し下に表示
                                                                left: `${leftOffset}px`
                                                            }}
                                                        >
                                                            {showDelay(kodoDelay)}
                                                        </p>
                                                    </>)
                                                );
                                            })()
                                        )}
                                    </div>

                                    {/* 時間目盛り */}
                                    <div className="timesheet right">
                                        {config.hours.map((h) => (
                                            <h1 key={h}>{h}</h1>
                                        ))}

                                        {/* 現在時刻（赤字） */}
                                        {(shouldDisplayNowFor(dayKey) && displayingDetail === -1) && (
                                            (() => {
                                                const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
                                                    .getMinutes()
                                                    .toString()
                                                    .padStart(2, "0")}`;
                                                const oneCount = (timeStr.match(/1/g) || []).length; // '1'の出現回数(1は短いから)
                                                const leftOffset = oneCount * 1.5 + 2; // 1px * 1の出現数 + 2px

                                                return (
                                                    <>
                                                        <h4
                                                            className="current-time-h4"
                                                            style={{
                                                                top: `${getNowTopFor(dayKey) - 6.2 * multiplier}px`,
                                                                right: `${leftOffset}px`
                                                            }}
                                                        >
                                                            {timeStr}
                                                        </h4>
                                                        <p
                                                            className="current-time-delay"
                                                            style={{
                                                                top: `${getNowTopFor(dayKey) - 6.2 * multiplier - (Math.abs(stageDelay) > 2 ? kodoDelay * multiplier * 2 
                                                                    : (stageDelay < 0 ? -18 : 14))}px`,
                                                                right: `${leftOffset}px`
                                                            }}
                                                        >
                                                            {showDelay(stageDelay)}
                                                        </p>
                                                    </>
                                                );
                                            })()
                                        )}
                                    </div>

                                    {/* 赤線 */}
                                    {(shouldDisplayNowFor(dayKey) && displayingDetail === -1) && (
                                        <div className={`row-border-now-con rbn-con-${dayKey}`}>
                                            <div
                                                className="row-border-now basis"
                                                style={{
                                                    top: `${getNowTopFor(dayKey) - 2.2 * multiplier}px`,
                                                    left: '0px', height: '2px', zIndex: 1000,
                                                    backgroundColor: 'rgb(255, 0, 0)'
                                                }}
                                            />
                                            <div
                                                className="row-border-now left"
                                                style={{
                                                    top: `${getNowTopFor(dayKey) - 2.2 * multiplier + 0.5 - kodoDelay * multiplier * 2}px`,
                                                    left: '0px', height: '1px', zIndex: 1000,
                                                    backgroundColor: 'rgb(0, 0, 255)'
                                                }}
                                            />
                                            <div
                                                className="row-border-now right"
                                                style={{
                                                    top: `${getNowTopFor(dayKey) - 2.2 * multiplier + 0.5 - 0.3 - stageDelay * multiplier * 2}px`,
                                                    right: '109px', height: `${1 + (kodoDelay == stageDelay ? 0 : 0.3)}px`, zIndex: 1000,
                                                    backgroundColor: 'rgb(0, 0, 255)'
                                                }}
                                            />
                                        </div>
                                    )}

                                </>
                                {/* 講堂 + ステージ各種企画 */}
                                {["kodo", "stage"].map((type) => {
                                    const list = type === "kodo" ? KodoGroupList : StageGroupList;
                                    return (
                                        <div
                                            key={type}
                                            className={`schedule-con sc-con-${type} sc-con-${dayKey}`}
                                            ref={type === "kodo" ? boxRef : null} // 講堂だけ ref 付与
                                        >
                                            {list
                                                .filter((item) => item.day === dayKey)
                                                .map((item) => {
                                                    const fontSize = calcFontSize(item.label, item.timelength);
                                                    const paddingY = calcPadding(item.timelength);
                                                    return (
                                                        <a
                                                            onClick={showDetail(item)}
                                                            key={item.label}
                                                            className={`schedule-box box-${type}`}
                                                            style={{
                                                                height: `${(item.timelength * 2) * multiplier}px`,
                                                                top: `${(item.starttime * 2 + 20) * multiplier}px`,
                                                                paddingTop: `${paddingY}px`,
                                                                paddingBottom: `${paddingY}px`,
                                                                backgroundColor: (isOngoing(item) & false)
                                                                    ? 'rgba(120, 200, 255, 0.95)' // 濃い色
                                                                    : 'rgba(197, 232, 255, 0.95)'   // 通常色
                                                            }}
                                                        >
                                                            <p className="group-name" style={{ fontSize: `${fontSize}px` }}>
                                                                {item.label}
                                                            </p>
                                                            <p className="group-time">
                                                                {item.starthour}:{item.startminute}～{item.finishhour}:{item.finishminute}
                                                            </p>
                                                        </a>
                                                    );
                                                })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}


                </div></>}
            {currentPage == 1 && <>
                <div className="ko-or-st-con">
                    <div className="kodo-or-stage">
                        <button onClick={() => setCurrentTab("kodo")} className={`kodo-button ${currentTab === 'kodo' ? 'active' : ''}`} disabled={displayingDetail !== -1}>
                            講堂企画
                        </button>

                        <button onClick={() => setCurrentTab("stage")} className={`kodo-button ${currentTab === 'stage' ? 'active' : ''}`} disabled={displayingDetail !== -1}>
                            ステージ企画
                        </button>
                    </div>
                </div>


                {currentTab == "kodo" && <>
                    <div className="sc-day-con"><h2>27(土)</h2></div>
                    {KodoGroupList.filter(item => item.day === 'sat').map(item => (
                        <div onClick={showDetail(item)} role="button" key={item.label} className="row-con" style={{ '--bg-image': `url(/pictures/${item.images[0]})` }}>
                            <div className="time-con">
                                <p>{item.starthour}:{item.startminute}</p>
                                <p>～</p>
                                <p>{item.finishhour}:{item.finishminute}</p>
                            </div>
                            <div className="group-detail-con">
                                <p>{item.category}・{item.category2}</p>
                                <h2>{item.label}</h2>
                                <p className="subtitle">{truncateText(item.subtitle, 16)}</p>
                            </div>
                        </div>

                    ))}
                    <div className="sc-day-con sun"><h2>28(日)</h2></div>
                    {KodoGroupList.filter(item => item.day === 'sun').map(item => (
                        <div onClick={showDetail(item)} role="button" key={item.label} className="row-con" style={{ '--bg-image': `url(/pictures/${item.images[0]})` }}>
                            <div className="time-con">
                                <p>{item.starthour}:{item.startminute}</p>
                                <p>～</p>
                                <p>{item.finishhour}:{item.finishminute}</p>
                            </div>
                            <div className="group-detail-con">
                                <p>{item.category}・{item.category2}</p>
                                <h2>{item.label}</h2>
                                <p className="subtitle">{truncateText(item.subtitle, 16)}</p>
                            </div>
                        </div>

                    ))}</>}
                {currentTab == 'stage' && <>
                    <div className="sc-day-con"><h2>27(土)</h2></div>
                    {StageGroupList.filter(item => item.day === 'sat').map(item => (
                        <div onClick={showDetail(item)} role="button" key={item.label} className="row-con" style={{ '--bg-image': `url(/pictures/${item.images[0]})` }}>
                            <div className="time-con">
                                <p>{item.starthour}:{item.startminute}</p>
                                <p>～</p>
                                <p>{item.finishhour}:{item.finishminute}</p>
                            </div>
                            <div className="group-detail-con">
                                <p>{item.category}・{item.category2}</p>
                                <h2>{item.label}</h2>
                                <p className="subtitle">{truncateText(item.subtitle, 16)}</p>
                            </div>
                        </div>

                    ))}
                    <div className="sc-day-con sun"><h2>28(日)</h2></div>
                    {StageGroupList.filter(item => item.day === 'sun').map(item => (
                        <div onClick={showDetail(item)} role="button" key={item.label} className="row-con" style={{ '--bg-image': `url(/pictures/${item.images[0]})` }}>
                            <div className="time-con">
                                <p>{item.starthour}:{item.startminute}</p>
                                <p>～</p>
                                <p>{item.finishhour}:{item.finishminute}</p>
                            </div>
                            <div className="group-detail-con">
                                <p>{item.category}・{item.category2}</p>
                                <h2>{item.label}</h2>
                                <p className="subtitle">{truncateText(item.subtitle, 16)}</p>
                            </div>
                        </div>

                    ))}</>}
            </>}


        </div>

    )
}

export default Schedule;
