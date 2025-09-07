import "./Login.css"
import { useState } from "react"
import { supabase } from "./supabase"

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState("");

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
            window.open("/administrator", '_top');
        } else {
            setResult("一致するユーザーが見つかりません");
        }
    };


    return (
        <form className="login-con" onSubmit={handleLogin}>
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
        </form>
    )
}

export default Login;