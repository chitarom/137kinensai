import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useRef, useState, useEffect } from 'react';
import DetailImageSlider from './SearchComponents/DetailImageSlider';
import { supabase } from './supabase';

const DisplayDetail = ({ displayDetailContents, setDisplayingDetail, scheduled }) => {

    const [favoriteSwitch, setFavoriteSwitch] = useState(false);
    const [CommentList, setCommentList] = useState([]);
    const [CurrentCommmentList, setCurrentCommentList] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [modalState, setModalState] = useState(null);
    const [isFading, setIsFading] = useState(false);

    const hideDDetail = () => {
        setDisplayingDetail(-1);
    }

    const getList = (cats) => {
        const list = [];
        for (let i = 0; i < cats.length; i++) {
            list.push(<div className='filter inactive' key={uuidv4()}>{cats[i]}</div>);
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

    // 草稿保存用
    const localStorageKey = `draftComment-${displayDetailContents[1]}`;

    // マウント時に保存済みコメントを読み込む
    useEffect(() => {
        const saved = localStorage.getItem(localStorageKey);
        if (saved) setNewComment(saved);
    }, [localStorageKey]);

    // localStorage に保存
    useEffect(() => {
        if (newComment.trim()) {
            localStorage.setItem(localStorageKey, newComment);
        } else {
            localStorage.removeItem(localStorageKey);
        }
    }, [newComment, localStorageKey]);

    const handleRequestSend = () => {
        if (!newComment.trim()) return;
        setModalState("confirm");
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

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
            localStorage.removeItem(localStorageKey);
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

    return (
        <div className='detail-wrap'>
            <div className='dw-margin' onClick={hideDDetail}></div>
            <div className='detail-tag'>
                <div className='detail-head'>
                    <div className='detail-place'>{displayDetailContents[0]}</div>
                    <div className='detail-title'>{displayDetailContents[1]}</div>
                    <button className={'detail-favorite' + (scheduled ? ' hidden' : '')} onClick={toggleSwitch}>{scheduled ? "" : star}</button>
                </div>
                <div className='filter-wrap-wrap'>
                    <div className='filter-wrap'>
                        <div className='filter-list' key={uuidv4()}>
                            {getList(displayDetailContents[3])}
                        </div>
                    </div>
                </div>
                <DetailImageSlider imagelist={displayDetailContents[4]} />
                <div className='detail'>{displayDetailContents[2]}</div>
                <div className='detail-comments'>
                    {CurrentCommmentList.length > 0 ? (
                        CurrentCommmentList.map((comment) => (
                            <div key={comment.id} className='comment-item'>
                                {comment.passage}
                            </div>
                        ))
                    ) : (
                        <p className='no-comment'>まだコメントはありません</p>
                    )}
                </div>
                <div className="add-comment-section">
                    <textarea
                        className="add-comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="コメントを書く..."
                        rows={4} // 初期設定したい行数
                    />
                    <button
                        className="comment-submit"
                        onClick={handleRequestSend}
                        disabled={!newComment.trim()}
                    >送信する</button>
                </div>
                {modalState && (
                    <div className={`modal-overlay ${isFading ? "fade-out" : ""}`}>
                        <div className="modal-content">
                            {modalState === "confirm" && (
                                <>
                                    <p>この内容で送信してもよろしいですか？</p>
                                    {/*<p className="confirm-comment">{newComment}</p>/**/}
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
            </div>
        </div>
    )
}

export default DisplayDetail;