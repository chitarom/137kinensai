import './Schedule.css';
import { useRef, useEffect, useState } from 'react';




function Schedule() {
    const scrollContainerRef = useRef(null);
    const boxRef = useRef(null);
    const [activeTab, setActiveTab] = useState('kodo');
    const [currentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const scrollLeft = scrollContainerRef.current.scrollLeft;
            const boxWidth = boxRef.current.offsetWidth;

            // 例：講堂とステージがそれぞれ containerWidth 分の幅を持つ場合
            if (scrollLeft < boxWidth / 2) {
                setActiveTab('kodo');
            } else {
                setActiveTab('stage');
            }
        };

        const container = scrollContainerRef.current;
        container.addEventListener('scroll', handleScroll);

        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

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


    const KodoGroupList = [
        { label: '団体1', day: 'sat', starthour: '12', startminute: '00', finishhour: '12', finishminute: '30' },
        { label: '団体3', day: 'sat', starthour: '13', startminute: '30', finishhour: '14', finishminute: '10' },
        { label: '七文字のバンド', day: 'sun', starthour: '9', startminute: '30', finishhour: '9', finishminute: '40' },
        { label: '六字のバンド', day: 'sun', starthour: '9', startminute: '40', finishhour: '9', finishminute: '50' }
    ]

    const StageGroupList = [
        { label: '団体2', day: 'sat', starthour: '13', startminute: '20', finishhour: '16', finishminute: '00' }
    ]

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


    return (
        <div className="schedule-page">
            <button className="page-changer" onClick={() => setCurrentPage(prev => (prev + 1) % 2)}>{currentPage === 0 ? '一覧表示' : 'タイムテーブル'}</button>
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
                                <a key={item.label} className="schedule-box  box-kodo" style={{ height: `${item.timelength * 2 - 4}px`, top: `${item.starttime * 2 + 20 + 2}px` }}>
                                    <p className="group-name">{item.label}</p>
                                    <p className="group-time">{item.starthour}:{item.startminute}～{item.finishhour}:{item.finishminute}</p>
                                </a>
                            ))}
                        </div>
                        <div className="schedule-con sc-con-stage">
                            {StageGroupList.filter(item => item.day === 'sat').map(item => (
                                <a key={item.label} className="schedule-box  box-stage" style={{ height: `${item.timelength * 2 - 4}px`, top: `${item.starttime * 2 + 20 + 2}px` }}>
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
                                <a key={item.label} className="schedule-box  box-kodo" style={{ height: `${item.timelength * 2 - 4}px`, top: `${item.starttime * 2 + 20 + 2}px` }}>
                                    <p className="group-name">{item.label}</p>
                                    <p className="group-time">{item.starthour}:{item.startminute}～{item.finishhour}:{item.finishminute}</p>
                                </a>
                            ))}
                        </div>
                        <div className="schedule-con sc-con-stage sc-con-sun">
                            {StageGroupList.filter(item => item.day === 'sun').map(item => (
                                <a key={item.label} className="schedule-box  box-stage" style={{ height: `${item.timelength * 2 - 4}px`, top: `${item.starttime * 2 + 20 + 2}px` }}>
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
                        <button onClick={() => scrollToLeft()} className={`kodo-button ${activeTab === 'kodo' ? 'active' : ''}`}>
                            講堂企画
                        </button>

                        <button onClick={() => scrollToRight()} className={`kodo-button ${activeTab === 'stage' ? 'active' : ''}`}>
                            ステージ企画
                        </button>
                    </div>
                </div>
            </>}


        </div>

    )
}

export default Schedule;