import "./Login.css"
import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import { Link } from "react-router-dom";
import pagelist from "./JSON/PageList.json";
import groupList from "./JSON/ProjectData.json";

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
    const [voteList, setVoteList] = useState([[]]);
    const [voteCounts, setVoteCounts] = useState({});
    const [voteView, setVoteView] = useState("list");

    const [delayList, setDelayList] = useState([]);
    const [stageValue, setStageValue] = useState("");
    const [kodoValue, setKodoValue] = useState("");
    const [stageResult, setStageResult] = useState("");
    const [kodoResult, setKodoResult] = useState("");

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
        if (passage.length > 25) {
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

    const fecthVotes = async () => {
        const { data, error } = await supabase
            .from("vote")
            .select("id, created_at, name")
            .order("created_at", { ascending: false });
        if (error) {
            console.error("取得エラー:", error);
        } else {
            setVoteList(data);
        }
    };


    useEffect(() => {
        if (watchable == 4) console.log(voteList);
    }, [watchable]);

    const stageGroups = groupList.filter(
        item => (item[0] === "ステージ" &&
            item[7][6] !== "クイズ" &&
            item[7][6] !== "合奏"
        )
    );

    useEffect(() => {
        const counts = {};
        stageGroups.forEach(([_, groupName]) => {
            counts[groupName] = voteList.filter(v => v.name === groupName).length;
        });
        setVoteCounts(counts);
    }, [voteList]);

    const handleDeleteVote = async (id) => {
        const { error } = await supabase
            .from("vote")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("削除エラー:", error);
        } else {
            alert("消しますよ");
            console.log("削除成功！");
            setVoteList(prev => prev.filter(item => item.id !== id));
        }
    }

    const fetchDelay = async () => {
        const { data, error } = await supabase
            .from("delay")
            .select("*")
            .order("id", { ascending: true }) // idの昇順 → 最小の1件が先頭にくる
            .limit(1); // 1件だけ取得

        if (error) {
            console.error("取得エラー:", error);
        } else {
            setDelayList(data);

            // フォームに初期値をセット
            if (data.length > 0) {
                setDelayList(data);
            }
        }
    };

    useEffect(() => {
        fetchNews();
        fetchComments();
        fecthVotes();
        fetchDelay();
    }, []);


    // Stageだけ更新
    const handleUpdateDelay = async (e, target) => {
        e.preventDefault();
        if (delayList.length === 0) return;

        const str = target == 'stage' ? stageValue : kodoValue;
        let message = "";

        if (!str) message = "入力してください";
        else if (isNaN(str)) message = "正しく書いてください";

        if (message !== "") {
            target === 'stage' ? setStageResult(message) : setKodoResult(message);
            return;
        }

        const num = parseFloat(str);

        if (!Number.isInteger(num)) message = "正しく書いてください";
        else if (num > 240) message = "数字が大きすぎます";
        else if (num < -240) message = "数字が小さすぎます";

        if (message !== "") {
            target === 'stage' ? setStageResult(message) : setKodoResult(message);
            return;
        }

        const targetId = delayList[0].id;

        const { error } = await supabase
            .from("delay")
            .update(target === 'stage' ? { stage: num } : { kodo: num })
            .eq("id", targetId);

        if (error) {
            console.error("更新エラー:", error);
            target === 'stage' ? setStageResult("ステージ更新失敗") : setKodoResult("講堂更新失敗");
        } else {
            if (target === 'stage') {
                setStageResult("ステージ更新成功！");
                setStageValue("");
            }
            else {
                setKodoResult("講堂更新成功！");
                setKodoValue("");
            }
            fetchDelay();
        }
    };


    useEffect(() => {
        if (watchable !== 5) return;
        setKodoResult("");
        setStageResult("");
    }, [watchable]);


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
                <div className="ad-con">
                    <button className="ad-button" onClick={() => { localStorage.clear(); alert("削除しました"); }}>データ全削除</button>
                    <button className="ad-button" onClick={() => setWatchable(4)}>投票結果一覧</button>
                </div>
                <div className="ad-con">
                    <button className="ad-button" onClick={() => setWatchable(5)}>企画遅延反映</button>
                </div>
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
                                            disabled={true}
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
                            placeholder="ニュースを入力(MAX24文字)"
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
            {watchable == 4 && <div className="ad-interior-con">
                <div className="votes-con">
                    <div className="votes-filter-buttons">
                        <button
                            className={`filter-button ${voteView === "list" ? "active" : ""}`}
                            onClick={() => setVoteView("list")}
                        >投票結果一覧</button>
                        <button
                            className={`filter-button ${voteView === "count" ? "active" : ""}`}
                            onClick={() => setVoteView("count")}
                        >団体別得票数</button>
                    </div>
                    {voteView === "list" && (
                        <div className="votes-list-con">
                            <h3>投票一覧</h3>
                            {voteList.map((item) => {
                                const date = new Date(item.created_at);
                                const formatted = date.toLocaleString("ja-JP", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                });
                                return (
                                    <div className="vote-box" key={item.id}>
                                        <p className="vote-time">{formatted}</p>
                                        <p className="vote-name">{item.name}</p>
                                        <button className="delete-button"
                                            onClick={() => handleDeleteVote(item.id)}
                                            disabled={false} /* 消したいならtrueにして */
                                        >
                                            delete
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {voteView === "count" && (
                        <div className="votes-list-con">
                            <h3>団体別得票数</h3>
                            {Object.entries(voteCounts).map(([name, count]) => (
                                <div className="vote-count-box" key={name}>
                                    <span className="vote-count-name">{name}</span>
                                    <span className="vote-count-number">{count} 票</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>}
            {watchable == 5 && (
                <div className="ad-interior-con">
                    <div className="delay-list-con">
                        <div className="delay-attention">
                            <p>
                            ※更新するときは「遅れ」なら〇〇、<br/>「巻き」なら-〇〇、
                            「遅れなし」なら0、<br/>と入れてください (半角・分単位で)
                        </p></div>
                        
                    </div>
                    
                    <form className="add-delay-con-con" onSubmit={(e) => handleUpdateDelay(e, 'kodo')}>
                        <div className="add-delay-con">
                            <input
                                className="input-delay"
                                type="text"
                                placeholder="講堂の遅れを入力..."
                                value={kodoValue}
                                onChange={(e) => setKodoValue(e.target.value)}
                            />
                            <button className="add-delay-button" type="submit">講堂更新</button>
                        </div>
                        <p>{kodoResult}</p>
                    </form>

                    <form className="add-delay-con-con" onSubmit={(e) => handleUpdateDelay(e, 'stage')}>
                        <div className="add-delay-con">
                            <input
                                className="input-delay"
                                type="text"
                                placeholder="ステージの遅れを入力..."
                                value={stageValue}
                                onChange={(e) => setStageValue(e.target.value)}
                            />
                            <button className="add-delay-button" type="submit">ステージ更新</button>
                        </div>
                        <p>{stageResult}</p>
                    </form>

                    {/* 現在の値を表示 */}
                    <div className="delay-list-con">
                        <h3>現在の遅れ</h3>
                        {delayList.length > 0 ? (
                            <div className="delay-box">
                                <p className="delay-kodo">講堂: {delayList[0].kodo}</p>
                                <p className="delay-stage">ステージ: {delayList[0].stage}</p>
                            </div>
                        ) : (
                            <p>データがありません</p>
                        )}
                    </div>
                </div>
            )}


        </>
    )
}

export default Login;