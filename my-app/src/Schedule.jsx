import './Schedule.css';
import { useRef, useEffect, useState } from 'react';
import grouplist from './JSON/ProjectData.json'
import { useLocation } from 'react-router-dom';
import DisplayDetail from './DisplayDetail';

function Schedule() {
    const location = useLocation();
    const scrollContainerRef = useRef(null);
    const boxRef = useRef(null);
    const [activeTab, setActiveTab] = useState('kodo');
    const [currentPage, setCurrentPage] = useState(1)
    const KodoGroupList = []
    const StageGroupList = []
    const [currentTab, setCurrentTab] = useState('kodo');
    const [displayingDetail, setDisplayingDetail] = useState(-1);
    const [displayDetailContents, setDisplayDetailContents] = useState(["", "", "", [], [], ""]);

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
                const object = { label: list[i][1], day: list[i][7][0], starthour: list[i][7][1], startminute: list[i][7][2], finishhour: list[i][7][3], finishminute: list[i][7][4], category: list[i][7][5], category2: list[i][7][6], subtitle: list[i][3], images: list[i][5], id: list[i][6], "i": i };
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
            list[i].timelength = list[i].finishtime - list[i].starttime
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


    return (
        <div className="schedule-page">
            {(displayingDetail >= 0) &&
                (<DisplayDetail displayDetailContents={displayDetailContents} setDisplayingDetail={setDisplayingDetail} scheduled={true} />)
            }
{/*             <button className="page-changer" onClick={() => { setCurrentPage(prev => (prev + 1) % 2); setActiveTab("kodo"); }} >{currentPage === 0 ? '一覧表示' : 'タイムテーブル'}</button> */}
            {currentPage == 0 && <>
                <div className="ko-or-st-con">
                    <div className="kodo-or-stage">
                        <button onClick={() => scrollToLeft()} className={`kodo-button ${activeTab === 'kodo' ? 'active' : ''}`}>
                            講堂企画
                        </button>

                        <button onClick={() => scrollToRight()} className={`kodo-button ${activeTab === 'stage' ? 'active' : ''}`}>
                            ステージ企画
                        </button>
                    </div>
                </div>

                <div className="schedule-page-con-con" ref={scrollContainerRef}>
                    <div className="sc-day-con"><h2>27(土)</h2></div>
                    <div className="schedule-page-con" >
                        <div className="row-border-con">
                            <div className="row-border" />
                            <div className="row-border" />
                            <div className="row-border" />
                            <div className="row-border" />
                            <div className="row-border" />
                            <div className="row-border" />
                        </div>
                        <div className="timesheet">
                            <h1>12</h1>
                            <h1>13</h1>
                            <h1>14</h1>
                            <h1>15</h1>
                            <h1>16</h1>
                            <h1>17</h1>



                        </div>

                        <div className="schedule-con" ref={boxRef}>
                            {KodoGroupList.filter(item => item.day === 'sat').map(item => (
                                <a onClick={showDetail(item)} key={item.label} className="schedule-box  box-kodo" style={{ height: `${item.timelength * 2 - 4}px`, top: `${item.starttime * 2 + 20 + 2}px` }}>
                                    <p className="group-name">{item.label}</p>
                                    <p className="group-time">{item.starthour}:{item.startminute}～{item.finishhour}:{item.finishminute}</p>
                                </a>
                            ))}
                        </div>
                        <div className="schedule-con sc-con-stage">
                            {StageGroupList.filter(item => item.day === 'sat').map(item => (
                                <a onClick={showDetail(item)} key={item.label} className="schedule-box  box-stage" style={{ height: `${item.timelength * 2 - 4}px`, top: `${item.starttime * 2 + 20 + 2}px` }}>
                                    <p className="group-name">{item.label}</p>
                                    <p className="group-time">{item.starthour}:{item.startminute}～{item.finishhour}:{item.finishminute}</p>
                                </a>
                            ))}
                        </div>

                    </div>
                    <div className="sc-day-con sun"><h2>28(日)</h2></div>
                    <div className="schedule-page-con" ref={scrollContainerRef}>
                        <div className="row-border-con">
                            <div className="row-border" />
                            <div className="row-border" />
                            <div className="row-border" />
                            <div className="row-border" />
                            <div className="row-border" />
                            <div className="row-border" />
                            <div className="row-border" />
                        </div>
                        <div className="timesheet">
                            <h1>9</h1>
                            <h1>10</h1>
                            <h1>11</h1>
                            <h1>12</h1>
                            <h1>13</h1>
                            <h1>14</h1>
                            <h1>15</h1>


                        </div>

                        <div className="schedule-con sc-con-sun" ref={boxRef}>
                            {KodoGroupList.filter(item => item.day === 'sun').map(item => (
                                <a onClick={showDetail(item)} key={item.label} className="schedule-box  box-kodo" style={{ height: `${item.timelength * 2 - 4}px`, top: `${item.starttime * 2 + 20 + 2}px` }}>
                                    <p className="group-name">{item.label}</p>
                                    <p className="group-time">{item.starthour}:{item.startminute}～{item.finishhour}:{item.finishminute}</p>
                                </a>
                            ))}
                        </div>
                        <div className="schedule-con sc-con-stage sc-con-sun">
                            {StageGroupList.filter(item => item.day === 'sun').map(item => (
                                <a onClick={showDetail(item)} key={item.label} className="schedule-box  box-stage" style={{ height: `${item.timelength * 2 - 4}px`, top: `${item.starttime * 2 + 20 + 2}px` }}>
                                    <p className="group-name">{item.label}</p>
                                    <p className="group-time">{item.starthour}:{item.startminute}～{item.finishhour}:{item.finishminute}</p>
                                </a>
                            ))}
                        </div>

                    </div>
                </div></>}
            {currentPage == 1 && <>
                <div className="ko-or-st-con">
                    <div className="kodo-or-stage">
                        <button onClick={() => setCurrentTab("kodo")} className={`kodo-button ${currentTab === 'kodo' ? 'active' : ''}`}>
                            講堂企画
                        </button>

                        <button onClick={() => setCurrentTab("stage")} className={`kodo-button ${currentTab === 'stage' ? 'active' : ''}`}>
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
