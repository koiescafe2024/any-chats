import { useState } from "react"
import IdentityService from "../api/IdentityService.js"
import { useParams, useNavigate } from "react-router-dom"

const _login = () => {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    let params = useParams();
    const navigate = useNavigate();

    const handleLogin = () => {
        IdentityService.authenticate(email, password, params.login_id)
        .then(resp => {

            // if (no user profile)
            // if (no merchant profile)
            // localStorage.setItem('authToken', resp.data.token);
            const urlParams = new URLSearchParams(window.location.search);
            const success_url = urlParams.get("success_url");

            navigate(`/${resp.data.user.user_id}`, {state: {user: resp.data.user, success_url: success_url, token: resp.data.token} }) 
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const success_url = urlParams.get("success_url");

    return(
        <div className="card">
            <div className="card-header">
                <h1 style={{color: "#333", textAlign: "center"}}>You are identifying with: <br/> KooChat</h1>
            </div>
            <div className="card-body">  
                <div style={{width: "100%", color: "#333"}}><strong>Email</strong></div>
                <input 
                    type="text"
                    className="text-input"
                    placeholder="Email..."
                    onChange={e => setEmail(e.target.value)}
                />
                <div style={{width: "100%", color: "#333"}}><strong>Password</strong></div>
                <input 
                    type="password"
                    className="text-input"
                    placeholder="Password..."
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <div className="card-footer">
                <button className="button" onClick={() => handleLogin() }>Log in</button>
                <p style={{color: "#4CAF50"}}>Forgot password?</p>
            </div>
        </div>
    )

}

export default _login