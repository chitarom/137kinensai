import { parsePath } from 'react-router-dom';
import './NewsBar.css'
import { supabase } from './supabase';
import { useEffect, useState } from 'react';

function NewsBar() {
    const [newsList, setNewsList] = useState([]);
    const [currentNews,setCurrentNews] = useState(0);
    useEffect(() => {
        const fetchNews = async () => {
            const {data, error} = await supabase
                .from("news")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) {
                console.error("取得エラー:", error);
            } else {
                setNewsList(data);
            }
        }
        fetchNews();
    },[]);

    useEffect(() => {
        const listLength = newsList.length;
        if (listLength <= 0) return;
        const interval = setInterval(() => {
            setCurrentNews(prev => (prev + 1) % listLength);
        },10000);
        return () => clearInterval(interval);
    },[newsList])


    return (
        <div className="news-bar">
            <p key={newsList[currentNews]?.id}>{newsList[currentNews]?.passage || "ニュースを読み込み中…"}</p>
        </div>
        
    )
}

export default NewsBar;