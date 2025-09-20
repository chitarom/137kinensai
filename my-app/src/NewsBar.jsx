import { parsePath, Link } from 'react-router-dom';
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
        let listLength = 5;
        if (newsList.length < 5) {
            listLength = newsList.length;
        }   
        if (listLength <= 0) return;
        const interval = setInterval(() => {
            setCurrentNews(prev => (prev + 1) % listLength);
        },7000);
        return () => clearInterval(interval);
    },[newsList])


    return (
        <div className="news-bar">
            <Link className="news-link"
            key={newsList[currentNews]?.id}
            to={newsList[currentNews]?.link || '/'}
            aria-label={newsList[currentNews]?.passage || "ニュースを読み込み中…"}
            >
            {newsList[currentNews]?.passage || "ニュースを読み込み中…"}
            </Link>
        </div>
        
    )
}

export default NewsBar;