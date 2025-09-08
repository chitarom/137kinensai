import "./Login.css"
import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import { Link } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState("");
    const [watchable, setWatchable] = useState(0);
    const [passage, setPassage] = useState("");
    const [newsList, setNewsList] = useState([])

    const handleLogin = async (e) => {
        e.preventDefault(); // ページリロード防止

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("username", username)
            .eq("password", password); // 完全一致で照合

        if (error) {
            console.error("取得エラー:", error);
            setResult("エラーが発生しました");
        } else if (data.length > 0) {
            setWatchable(1)
        } else {
            setResult("一致するユーザーが見つかりません");
        }
    };

    const handleAddNews = async (e) => {
        e.preventDefault(); // ページリロード防止
        if (passage.length > 22) {
            setResult("長すぎます")
            return;
        }
        setResult("");


        const { error } = await supabase
            .from("news")
            .insert([{ passage }])


        if (error) {
            console.error("取得エラー:", error);
            setResult("エラーが発生しました");
        } else {
            setResult("送信成功");
        }
    };

    const handleDelete = async (id) => {
        const { error } = await supabase
            .from("news")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("削除エラー:", error);
        } else {
            console.log("削除成功！");
            // 表示を更新するならここで再取得 or フィルタ
            setNewsList(prev => prev.filter(item => item.id !== id));
        }
    };


    useEffect(() => {
        const fetchNews = async () => {
            const { data, error } = await supabase
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

    }, [])


    return (
        <>
            {watchable == 0 && <form className="login-con" onSubmit={handleLogin}>
                <h2>管理者用サインイン</h2>
                <input
                    className="input-box"
                    type="text"
                    placeholder="ユーザー名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="input-box"
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="login" type="submit">ログイン</button>
                <p>{result}</p>
            </form>}
            {watchable == 1 && <div className="ad-con">
                <button className="ad-button" onClick={() => setWatchable(2)}>コメント検閲</button>
                <button className="ad-button" onClick={() => setWatchable(3)}>ニュース管理</button>
            </div>}
            {watchable > 1 && <div className="ad-con">
                <button className="ad-button back-button" onClick={() => setWatchable(1)}>戻る</button>
            </div>}
            {watchable == 3 && <div className="ad-interior-con">
                <form className="add-news-con-con" onSubmit={handleAddNews}>
                    <div className="add-news-con">
                        <input
                            className="input-news"
                            type="text"
                            placeholder="ニュースを入力(20文字前後)"
                            value={passage}
                            onChange={(e) => setPassage(e.target.value)}
                        />
                        <button className="add-button" type="submit">追加</button>
                    </div>
                    <p>{result}</p>
                </form>
                <div className="news-list-con">
                    <h3>ニュース一覧</h3>
                    {newsList.map(item => (
                        <div className="news-box">
                            <p>{item.passage}</p>
                            <button className="delete-button" onClick={() => handleDelete(item.id)}>delete</button>
                        </div>
                    ))}

                </div>

            </div>}


        </>
    )
}

export default Login;