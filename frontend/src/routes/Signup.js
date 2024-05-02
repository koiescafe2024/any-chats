import { useState, useEffect } from "react"
import IdentityService from "../api/IdentityService.js"

const Signup = () => {

    useEffect( () => {       
         let success_url = `http://localhost:1001`;
        //let success_url = `https://master.drkcd9ol0en6z.amplifyapp.com/`;
        
        IdentityService.requestReg(success_url).then(resp => window.location.href=resp.data)    
    }, [])

    return(
        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        </div>
    )

}

export default Signup