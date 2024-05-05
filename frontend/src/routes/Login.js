import { useState, useEffect } from "react"
import IdentityService from "../api/IdentityService.js"

const Login = () => {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    const handleLoginClick = () => {
        // URL for the login page that will be opened in the popup
        const loginUrl = `login_window/2004091082?success_url=${encodeURIComponent(window.location.origin)}`; // Adjust this URL as needed
        // const loginUrl = `https://master.drkcd9ol0en6z.amplifyapp.com/login/1708286357796?success_url=${encodeURIComponent(window.location.origin)}`; // Adjust this URL as needed
        const windowFeatures = 'width=600,height=700,left=200,top=200';

        const loginWindow = window.open(loginUrl, '_blank', windowFeatures);

        // Function to handle message from the popup
        const receiveMessage = (event) => {
            // Make sure the message is from a trusted source
            // if (event.origin !== "EXPECTED_ORIGIN") return;

            if (event.data && event.data.token) {
                console.log('Data received:', event.data);
                // Here you can handle the token, e.g., store it in localStorage
                localStorage.setItem('authToken', event.data.token);
                // Close the login popup
                loginWindow.close();
                window.location.href = `/${event.data.user.user_id}/${event.data.merchant.MERCHANT.id}`;
            }
        };

        // Add event listener to listen for messages from the popup
        window.addEventListener('message', receiveMessage, false);
    };

    return(
        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <button onClick={handleLoginClick}>Login</button>
        </div>
    )

}

export default Login