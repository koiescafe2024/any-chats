import axios from "axios"

const server_url2 = "http://localhost:1080";
const server_url = "https://definitelynotabank.com"

class IdentityService{
    signup = async (email, password) => {
        try {
            return await axios
                .post(`${server_url}/signup`, {
                    email: email,
                    password: password
                });
        } catch (err) {
            return console.log(err);
        }
    }

    async login(email, password){
        try {
            return await axios
                .post(`${server_url}/login`, {
                    email: email,
                    password: password,
                }, 
                { withCredentials: true }
                );
        } catch (err) {
            return console.log(err);
        }
    }

    async removeAuthCookie(){
        try {
            return await axios
                .post(`${server_url}/user/removeAuth`, {}, 
                { withCredentials: true }
                );
        } catch (err) {
            return console.log(err);
        }
    }

    async authenticate(email, password, login_id){
        try {
            return await axios
                .post(`${server_url}/authenticate`, {
                    email: email,
                    password: password,
                    login_id: login_id,
                }, 
                { withCredentials: true }
                );
        } catch (err) {
            return console.log(err);
        }
    }

    async getUser(user_id){
        try {
            return await axios
                .post(`${server_url}/user/get`, {
                    user_id: user_id
                },
                { withCredentials: true }
                );
        } catch (err) {
            return console.log(err);
        }
    }

    async getUserMerchants(user_id){
        try {
            return await axios
                .post(`${server_url}/user/merchants`, {
                    user_id: user_id
                },
                { withCredentials: true }
                );
        } catch (err) {
            return console.log(err);
        }
    }

    async setUserMerchant(user_id, merchant_id){
        try {
            return await axios
                .post(`${server_url}/user/merchant`, {
                    user_id: user_id,
                    merchant_id: merchant_id
                },
                { withCredentials: true }
                );
        } catch (err) {
            return console.log(err);
        }
    }

    async getMerchantById(merchant_id){
        try {
            return await axios
                .post(`${server_url}/merchant/get`, {
                    merchant_id: merchant_id
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
                { withCredentials: true });
        } catch (err) {
            return console.log(err);
        }
    }

    async registerMerchant(user_id, service_id, name){
        try {
            return await axios
                .post(`${server_url}/merchant/onboarding`, {
                    user_id: user_id,
                    service_id: service_id,
                    name: name,
                },
                { withCredentials: true }
                );
        } catch (err) {
            return console.log(err);
        }
    }

    async getRoles(user_id){
        try {
            return await axios
                .post(`${server_url}/user/roles/get`, {
                    user_id: user_id
                });
        } catch (err) {
            return console.log(err);
        }
    }

    async updateUser(user){
        try {
            return await axios
                .post(`${server_url}/user/update`, {
                    user: user,
                },
                { withCredentials: true }
                );
        } catch (err) {
            return console.log(err);
        }
    }

    async getAllMerchants(){
        try {
            return await axios
                .post(`${server_url}/merchants`, {
                },
                { withCredentials: true }
                );
        } catch (err) {
            return console.log(err);
        }
    }

    async integrateZettle(merchant_id, authorization_code){
        try {
            return await axios
                .post(`${server_url}/merchant/integrations/zettle`, {
                    merchant_id: merchant_id,
                    authorization_code: authorization_code
                },
                { withCredentials: true }
                );
        } catch (err) {
            return console.log(err);
        }
    }

    hasZettle = async (merchant_id) => {
        try {
            return await axios
                .post(`${server_url}/merchant/integrations/hasZettle`, {
                    merchant_id: merchant_id,
                },
                { withCredentials: true }
                );
        } catch (err) {
            return console.log(err);
        }
    }

    getMerchantRelationship = async (service_id, merchant_id, merchant_id2) => {
        try {
            return await axios
                .post(`${server_url}/merchant/relationship/get`, {
                    service_id: service_id,
                    merchant_id: parseInt(merchant_id),
                    merchant_id2: parseInt(merchant_id2),
                }, 
                { withCredentials: true });
        } catch (err) {
            return console.log(err);
        }
    }

    getMerchantRelationships = async (service_id, merchant_id, role) => {
        try {
            return await axios
                .post(`${server_url}/merchant/relationships/get`, {
                    service_id: service_id,
                    merchant_id: merchant_id,
                    role: role,
                }, 
                { withCredentials: true });
        } catch (err) {
            return console.log(err);
        }
    }

    getMerchantRelationshipsIn = async (service_id, merchant_id, role) => {
        try {
            return await axios
                .post(`${server_url}/merchant/relationships/in/get`, {
                    service_id: service_id,
                    merchant_id: merchant_id,
                    role: role,
                }, 
                { withCredentials: true });
        } catch (err) {
            return console.log(err);
        }
    }

    getMerchant = async (merchant_id) => {
        try {
            return await axios
                .post(`${server_url}/merchant/get`, {
                    merchant_id: parseInt(merchant_id)
                }, 
                { withCredentials: true });
        } catch (err) {
            return console.log(err);
        }
    }

    getMerchants = async (service_id) => {
        try {
            return await axios
                .post(`${server_url}/service/merchants`, {
                    service_id: service_id
                }, 
                { withCredentials: true });
        } catch (err) {
            return console.log(err);
        }
    } 

    getMerchantRelationshipsOut = async (service_id, merchant_id, role) => {
        try {
            return await axios
                .post(`${server_url}/merchant/relationships/out/get`, {
                    service_id: service_id,
                    merchant_id: merchant_id,
                    role: role,
                }, 
                { withCredentials: true });
        } catch (err) {
            return console.log(err);
        }
    }
    
    getBalance = async (node_id) => {
        try {
            return await axios
                .post(`${server_url}/merchant/balance/get`, {
                    node_id: parseInt(node_id),
                }, 
                { withCredentials: true });
        } catch (err) {
            return console.log(err);
        }
    }
    
    getServiceRelationships = async (service_id, role) => {
        try {
            return await axios
                .post(`${server_url}/service/relationships/get`, {
                    service_id: service_id,
                    role: role
                }, 
                { withCredentials: true });
        } catch (err) {
            return console.log(err);
        }
    }

    getRelationshipsById = async (relationship_ids) => {
        try {
            const response = await axios
                .post(`${server_url}/api/relationships/get`, {
                    relationship_ids: relationship_ids,
                })
            return response.data
        } catch (err) {
            return console.log(err);
        }
    }
}

export default new IdentityService()