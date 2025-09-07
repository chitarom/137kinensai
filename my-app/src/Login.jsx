import "./Login.css"
import { useState } from "react"
import { supabase } from "./supabase"

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState("");

    return (
        <div>
            <form action=""></form>
        </div>
    )
}

export default Login;