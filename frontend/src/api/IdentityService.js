import axios from "axios"

const server_url = "https://olll-cha-ts-backend.6o1yzt.easypanel.host";
//const server_url = "https://definitelynotabank.com"
// const server_url = "http://ec2-13-215-184-19.ap-southeast-1.compute.amazonaws.com:1080"

class IdentityService {

    async requestAuth(success_url){
        try {
            return await axios
                .post(`${server_url}/requestAuth`, {
                    success_url: success_url,
                });
        } catch (err) {
            return console.log(err);
        }
    }

    async requestReg(success_url){
        try {
            return await axios
                .post(`${server_url}/requestReg`, {
                    success_url: success_url,
                });
        } catch (err) {
            return console.log(err);
        }
    }

    isAuth = async (current_user_id, current_profile_id) => {
         try {
            return await axios
                .post(`${server_url}/user/isAuth`, {
                    current_user_id: current_user_id,
                    current_profile_id: current_profile_id
                }, 
                { withCredentials: true }
                );
         } catch (err) {
             return console.log(err);
         }
    }

    isAuth2 = async () => {
        const token = localStorage.getItem('authToken');
         try {
            return await axios
                .post(`${server_url}/user/isAuth2`, {},
                {
                    withCredentials: true, 
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      }
                }
                );
         } catch (err) {
             return console.log(err);
         }
    }
}


export default new IdentityService()