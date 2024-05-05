import { useNavigate } from "react-router-dom";
import logo from "../assets/KooChat_logo.png"

const Website = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        // URL for the login page that will be opened in the popup
        const loginUrl = `/login/2004094870?success_url=${encodeURIComponent(window.location.origin)}`; // Adjust this URL as needed
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

    return (
        <div style={{height: "100vh", display: "flex", flexDirection: "column"}}>
            <div style={{borderBottom: "1px solid lightgrey", padding: "15px"}}>
                <img src={logo} height="75px"/>
            </div>
            {/* <div style={{backgroundImage: "url(https://media.istockphoto.com/id/1156309024/vector/green-speech-and-thought-bubbles-with-quote-marks.jpg?s=612x612&w=0&k=20&c=LVRJRXHYKC2C30I4jKaLbXJZTKqKBZLSgEiot9An190=)", backgroundRepeat: "no-repeat", backgroundSize: "cover", height: "80vh"}}> */}
            <div style={{height: "80vh"}}>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <div style={{display: "flex", justifyContent: "space-around"}}>
                    <div>
                        <h1 style={{fontSize: "52px"}}>Welcome to KooChat.</h1>
                        <p style={{color: "grey", fontSize: "20px"}}>Your central hub for managing multiple chatbots.</p>
                    </div>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <button className="broadcast-button" style={{padding: "20px 50px", fontSize: "18px"}} onClick={handleLoginClick}><strong>Log in</strong></button>
                        <br/>
                        <br/>                        
                    </div>
                </div>
            </div>
            *Contact the administrator to receive/change log in credentials.
        </div>
    );
};

export default Website;