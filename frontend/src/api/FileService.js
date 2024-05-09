import axios from "axios"

const server_url = "https://any-chats-back-end-chat.yi9ne2.easypanel.host/files";
// const server_url = "https://f9ff-37-152-145-152.ngrok-free.app/files";
//const server_url = "https://definitelynotabank.com:9000/files";
// const server_url = "http://ec2-13-215-184-19.ap-southeast-1.compute.amazonaws.com:9000/files";





class LineService{
    uploadFile = async (formData) => {
        try {
            const response = await axios.post(`${server_url}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            // Handle the error if needed
            console.error('Error uploading file:', error);
            throw error; // Re-throw the error to propagate it to the caller
        }
    };

    getFiles = async (profile_id) => {
        try {
            return await axios
                .post(`${server_url}`, {
                    profile_id: profile_id
                }); 
        } catch (err) {
            return console.log(err);
        }
    }

    removeFile = async (fileName) => {
        try {
            return await axios
                .post(`${server_url}/remove`, {
                    fileName: fileName
                }); 
        } catch (err) {
            return console.log(err);
        }
    }
}

export default new LineService()