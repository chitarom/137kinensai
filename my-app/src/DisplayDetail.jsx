import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import DetailImageSlider from './SearchComponents/DetailImageSlider';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import './displaydetail.css';

const DisplayDetail = ({ displayDetailContents, setDisplayingDetail, scheduled, displaystage }) => {

    const [favoriteSwitch, setFavoriteSwitch] = useState(false);
    const [CommentList, setCommentList] = useState([]);
    const [CurrentCommmentList, setCurrentCommentList] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [modalState, setModalState] = useState(null);
    const [isFading, setIsFading] = useState(false);
    const [isCommentTooLong, setCommentTooLong] = useState(false);
    const [draftCommentKey] = useState(`draftComment-${displayDetailContents[1]}`);
    const [commentCountKey] = useState(`commentCount-${displayDetailContents[1]}`);
    const [commentCount, setCommentCount] = useState(0);
    const navigate = useNavigate();
    displaystage = displaystage || false;

    const hideDDetail = () => {
        setDisplayingDetail(-1);
    }

    const getList = (cats) => {
        const list = [];
        for (let i = 0; i < cats.length; i++) {
            list.push(<div className='filter inactive' key={uuidv4()}>{
                cats[i] === "整理券有(a)" ? "整理券有(α)" : cats[i] === "整理券有(b)" ? "整理券有(β)" : cats[i]
                }</div>);
        }
        return list;
    }

    if (localStorage.getItem("favorites") == undefined) localStorage.setItem("favorites", "[]");
    var favorites = JSON.parse(localStorage.getItem("favorites"));

    var star = favorites.includes(displayDetailContents[5]) ? "★" : "☆";

    const toggleSwitch = () => {
        if (!favorites.includes(displayDetailContents[5]))
            favorites.push(displayDetailContents[5]);
        else
            favorites = favorites.slice(0, favorites.indexOf(displayDetailContents[5])).concat(favorites.slice(favorites.indexOf(displayDetailContents[5]) + 1));
        localStorage.setItem("favorites", JSON.stringify(favorites));
        setFavoriteSwitch(!favoriteSwitch);
    }

    // 以下、コメントに関して
    const fetchComments = async () => {
        const { data, error } = await supabase
            .from("comment")
            .select("*")
            .order("created_at", { ascending: false }) // 最新のものは上に来る
            .eq("check", true); // 検閲済み
        if (error) {
            console.error("取得エラー:", error);
        } else {
            setCommentList(data);
        }
    }

    useEffect(() => {
        fetchComments();
    }, []);

    useEffect(() => {
        if (CommentList.length <= 0) return;
        const data = CommentList.filter(
            (item) => item.name === displayDetailContents[1]
        );
        setCurrentCommentList(data);
        // console.log("Filtered");
        // console.log(data);
    }, [CommentList, displayDetailContents]);

    // 保存済みコメントとカウントをマウント時に読み込む
    useEffect(() => {
        const saved = localStorage.getItem(draftCommentKey);
        if (saved) setNewComment(saved);

        const count = parseInt(localStorage.getItem(commentCountKey)) || 0;
        setCommentCount(count);
    }, [draftCommentKey, commentCountKey]);

    // コメント入力が変化したら文字数チェック
    useEffect(() => {
        setCommentTooLong(newComment.length > 1000);
    }, [newComment]);

    const handleRequestSend = () => {
        if (!newComment.trim()) return;
        setModalState("confirm");
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        if (commentCount >= 3) {
            alert("この企画に対するコメントはもう送信できません");
            return;
        }
        if (newComment.length > 1000) {
            alert("コメントは1000文字以内で入力してください");
            return;
        }

        const { data, error } = await supabase
            .from("comment")
            .insert([
                {
                    name: displayDetailContents[1],
                    passage: newComment,
                    check: false // 未検閲
                }
            ]);

        if (error) {
            console.error("追加エラー:", error);
        } else {
            setNewComment(""); // 入力欄をクリア
            localStorage.removeItem(draftCommentKey);

            const newCount = commentCount + 1;
            setCommentCount(newCount);
            localStorage.setItem(commentCountKey, newCount);

            fetchComments();
            setModalState("toast");

            setTimeout(() => {
                setIsFading(true);
                setTimeout(() => {
                    setModalState(null);
                    setIsFading(false);
                }, 1200);
            }, 4000);
        }
    };

    const hasReachedCommentLimit = (commentCount >= 3);

    const tyugaku = (S) => {
        return S?.includes("中学") || S?.includes("中高");
    };

    const rts = [
        "1A"
    ];

    const matchHighSchoolClassProject = (S) => {
        if (!S || S.length !== 3) return null;
        if (S[0] !== '高' || S[2] < 'A' || S[2] > 'J') return null;
        return S[1] + S[2];
    };

    return (
        <div className='detail-wrap'>
            <div className='dw-margin' onClick={hideDDetail}></div>
            <div className='detail-tag'>
                <div className='detail-head'>
                    <div className='detail-left'>
                        <div className='detail-place'>{displayDetailContents[0]}</div>
                        <div className='detail-title'>{displayDetailContents[1]}</div>
                        <div className='filter-wrap-wrap' style={displayDetailContents[5].split("-")[0] == "S" ? {} : { width: "calc(100vw - 30px)" }}>
                            <div className='filter-wrap'>
                                <div className='filter-list' key={uuidv4()}>
                                    {getList(displayDetailContents[3])}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='detail-right'>
                        <button
                            className={'detail-favorite' + (scheduled ? ' hidden' : '')}
                            onClick={toggleSwitch}
                        >
                            {scheduled ? "" : star}
                        </button>
                        {(displayDetailContents[0] === "ステージ" || displaystage) ? (
                            <button className='navigate-to vote' onClick={() => navigate("/stagevote")}>
                                投票する！<br />(投票ページへ)
                            </button>
                        ) : displayDetailContents[1]?.includes("海神") ? (
                            <button className='navigate-to kaijin' onClick={() => navigate("/kaijin")}>
                                特設ページへ
                            </button>
                        ) : !scheduled && displayDetailContents[0] === "講堂" ? (
                            <button className='navigate-to schedule' onClick={() => navigate("/schedule")}>
                                予定表を見る
                            </button>
                            /* この下のfalseをとると表示されます */
                        ) : matchHighSchoolClassProject(displayDetailContents[0]) && false && (
                            <button className='navigate-to article' onClick={() => navigate("/article", { state: { title: matchHighSchoolClassProject(displayDetailContents[0]) } })}>
                                記事を見る
                            </button>
                        )}
                    </div>
                </div>

                <DetailImageSlider imagelist={displayDetailContents[4]} />
                <div className='detail'>{displayDetailContents[2]}</div>
                {(displayDetailContents[0][0] !== 'J' &&
                    !tyugaku(displayDetailContents[0]) &&
                    !tyugaku(displayDetailContents[1])) ||
                    displayDetailContents[1] === "交通研究同好会" ? <>
                    {/*
                        <div className='comment-header'>
                            <hr className="comment-divider" />
                            <span className="comment-title">この企画に寄せられたコメント</span>
                            <hr className="comment-divider" />
                        </div>
                        <div className='detail-comments'>
                            {CurrentCommmentList.length > 0 ? (
                                CurrentCommmentList.map((comment) => (
                                    <div key={comment.id} className='comment-item'>
                                        {comment.passage}
                                    </div>
                                ))
                            ) : (<></>)}
                        </div>
                        <div className="comment-footer">
                            <hr className='comment-divider'></hr>
                        </div>
                    */}
                    {/*
                    <div className="add-comment-section">
                        <textarea
                            className="add-comment"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="コメント・感想を残す..."
                            rows={4} // 初期設定したい行数
                            disabled={hasReachedCommentLimit}
                        />
                        {hasReachedCommentLimit ? (
                            <button className="comment-submit" disabled>
                                この企画に対する<br />コメントはこれ以<br />上送信できません
                            </button>
                        ) : isCommentTooLong ? (
                            <button className="comment-submit" disabled>
                                コメントが長すぎます
                            </button>
                        ) : (
                            <button
                                className="comment-submit"
                                onClick={handleRequestSend}
                                disabled={!newComment.trim()}
                            >送信する</button>
                        )}
                    </div>
                    {modalState && (
                        <div className={`modal-overlay ${isFading ? "fade-out" : ""}`}>
                            <div className="modal-content">
                                {modalState === "confirm" && (
                                    <>
                                        <p>この内容で送信してもよろしいですか？</p>
                                        
                                        <div className="confirm-buttons">
                                            <button onClick={handleAddComment} className="confirm-send">送信</button>
                                            <button onClick={() => setModalState(null)} className="confirm-cancel">キャンセル</button>
                                        </div>
                                    </>
                                )}
                                {modalState === "toast" && (
                                    <>
                                        <span>コメントの送信が完了しました！<br />ありがとうございます！！</span>
                                        <button className="toast-close" onClick={() => setModalState(null)}>×</button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    */}
                </> : <></>
                }
            </div>
        </div>
    )
}

export default DisplayDetail;