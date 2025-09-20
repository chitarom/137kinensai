import "./Login.css"
import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import { Link } from "react-router-dom";
import pagelist from "./JSON/PageList.json";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState("");
    const [watchable, setWatchable] = useState(0);
    const [passage, setPassage] = useState("");
    const [pagelink, setPageLink] = useState("");
    const [newsList, setNewsList] = useState([]);
    const [commentList, setCommentList] = useState([]);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [commentFilter, setCommentFilter] = useState("all");

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
    };

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from("comment")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            console.error("取得エラー:", error);
        } else {
            setCommentList(data);
        }
    };
    
    const handleAddNews = async (e) => {
        e.preventDefault(); // ページリロード防止
        if (!passage) {
            setResult("入力してください");
            return;
        }
        if (passage.length > 22) {
            setResult("長すぎます");
            return;
        }

        setResult("");
        const link = '/' + pagelink;
        const page = pagelist.find(page => page.path === link);
        if (!page) {
            setResult("有効なリンクではありません");
            return;
        }
        const { error } = await supabase
            .from("news")
            .insert([{ passage, link }]);

        if (error) {
            console.error("取得エラー:", error);
            setResult("エラーが発生しました");
        } else {
            setResult("送信成功！");
            setPassage("");
            setPageLink("");
        }
        fetchNews();
    };

    const handleDeleteNews = async (id) => {
        alert("消しますよ");
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
        fetchNews();
        fetchComments();
    }, []);

    const handleDeleteComment = async (id) => {
        const { error } = await supabase
            .from("comment")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("削除エラー:", error);
        } else {
            console.log("削除成功！");
            // stateを更新して削除されたコメントを即座に反映
            setCommentList(prev => prev.filter(item => item.id !== id));
        }
    };

    const handleToggleApproval = async (id, currentCheck) => {
        const { error } = await supabase
            .from("comment")
            .update({ check: !currentCheck })
            .eq("id", id);

        if (error) {
            console.error("承認切替エラー:", error);
        } else {
            console.log("承認状態切替成功！");
            setCommentList(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, check: !currentCheck } : item
                )
            );
        }
    };

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
            {watchable == 1 && <>
                <div className="ad-con">
                    <button className="ad-button" onClick={() => setWatchable(2)}>コメント検閲</button>
                    <button className="ad-button" onClick={() => setWatchable(3)}>ニュース管理</button>
                </div>
                <button className="ad-button" onClick={() => { localStorage.clear(); alert("削除しました"); }}>データ全削除</button>
            </>}
            {watchable > 1 && <div className="ad-con">
                <button className="ad-button back-button" onClick={() => setWatchable(1)}>戻る</button>
            </div>}
            {watchable == 2 && <div className="ad-interior-con">
                <div className="comment-list-con">
                    <h3>コメント一覧</h3>
                    <div className="comment-filter-buttons">
                        <button
                            className={commentFilter === "all" ? "filter-button active" : "filter-button"}
                            onClick={() => setCommentFilter("all")}
                        >全て</button>
                        <button
                            className={commentFilter === "approved" ? "filter-button active" : "filter-button"}
                            onClick={() => setCommentFilter("approved")}
                        >承認済み</button>
                        <button
                            className={commentFilter === "pending" ? "filter-button active" : "filter-button"}
                            onClick={() => setCommentFilter("pending")}
                        >未承認</button>
                    </div>
                    {commentList.length === 0 && <p>コメントがありません</p>}
                    {commentList
                        .filter(item => {
                            if (commentFilter === "approved") return item.check;
                            if (commentFilter === "pending") return !item.check;
                            return true;
                        })
                        .map(item => (
                            <div className="comment-box" key={item.id}>
                                <div className="comment-name">{item.name}</div>
                                <p className="comment-passage">{item.passage}</p>
                                <div className="comment-actions">
                                    {item.check ? (
                                        <button
                                            className="toggle-button cancel-button"
                                            onClick={() => handleToggleApproval(item.id, item.check)}
                                        >承認取り消し</button>
                                    ) : (
                                        <button
                                            className="toggle-button approve-button"
                                            onClick={() => {
                                                if (deleteConfirmId === item.id) {
                                                    setDeleteConfirmId(null);
                                                } else {
                                                    handleToggleApproval(item.id, item.check);
                                                }
                                            }}
                                        >{deleteConfirmId === item.id ? "やめとく" : "承認"}</button>
                                    )}
                                    <button className="delete-button" disabled={true}
                                        onClick={() => {
                                            if (deleteConfirmId === item.id) {
                                                handleDeleteComment(item.id);
                                                setDeleteConfirmId(null);
                                            } else {
                                                setDeleteConfirmId(item.id);
                                            }
                                        }}
                                    >{deleteConfirmId === item.id ? "削除する？" : "削除"}</button>
                                </div>
                            </div>
                        ))}
                </div>
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
                    <div className="add-news-con">
                    <input
                        className="input-link"
                        type="text"
                        placeholder="リンクを入力(' / ' なし、正確に) ※書かないとHomeになります"
                        value={pagelink}
                        onChange={(e) => setPageLink(e.target.value)}
                    />
                    </div>
                    <p>{result}</p>
                </form>
                <div className="news-list-con">
                    <h3>ニュース一覧</h3>
                    {newsList.map(item => (
                        <div className="news-box">
                            <p className="news-passage">{item.passage}</p>
                            <p className="news-link">{item.link}</p>
                            <button className="delete-button" onClick={() => handleDeleteNews(item.id)}>delete</button>
                        </div>
                    ))}

                </div>

            </div>}


        </>
    )
}

export default Login;