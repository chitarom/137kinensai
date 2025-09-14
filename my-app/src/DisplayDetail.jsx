import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useRef, useState, useEffect } from 'react';
import DetailImageSlider from './SearchComponents/DetailImageSlider';
import { supabase } from './supabase';

const DisplayDetail = ({ displayDetailContents, setDisplayingDetail }) => {

    const [favoriteSwitch, setFavoriteSwitch] = useState(false);
    const [CommentList, setCommentList] = useState([]);
    const [CurrentCommmentList, setCurrentCommentList] = useState([]);

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

    // コメントに関して
    useEffect(() => {
        const fetchComments = async () => {
            const { data, error } = await supabase
                .from("comment")
                .select("*")
                .order("created_at", { ascending: true }) // 最新のものは後ろに来る
                .eq("check", true); // 検閲済み
            if (error) {
                console.error("取得エラー:", error);
            } else {
                setCommentList(data);
            }
        }
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

    return (
        <div className='detail-wrap'>
            <div className='dw-margin' onClick={hideDDetail}></div>
            <div className='detail-tag'>
                <div className='detail-head'>
                    <div className='detail-place'>{displayDetailContents[0]}</div>
                    <div className='detail-title'>{displayDetailContents[1]}</div>
                    <button className='detail-favorite' onClick={toggleSwitch}>{star}</button>
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
            </div>
        </div>
    )
}

export default DisplayDetail;