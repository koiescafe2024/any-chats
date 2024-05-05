import { useState, useEffect, createContext } from "react"
import './App.css';
import './styles.css';
import { Outlet, Link, useParams } from "react-router-dom";
import IdentityService from "./api/IdentityService";
import AppContext from './AppContext';

function App() {
  let params = useParams();
  const [user, setUser] = useState({})
  const [userMerchant, setUserMerchant] = useState({})
  
  useEffect( () => {
    IdentityService.isAuth2()
    .then(resp => {
      
      const user = resp.data.user;
      // const user_merchant = resp.data.user_merchant;
     setUser(user)
      // setProfile(user_merchant)
      
      
      
    })
    .catch(err => {
      console.log(err);
      if (window.location.href !== "http://localhost:3000/login"){
        window.location.href ="/"
      }
    })

    // IdentityService.isAuth(params.user_id, params.profile_id)
    //   .then( resp => {
    //     setUser(resp.data.user)
    //     setUserMerchant(resp.data.user_merchant)
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     // if (window.location.href !== "http://localhost:3002/login"){
    //     //   window.location.href ="/login"
    //     // }
    //   })
  }, [])

  return (
    <AppContext.Provider value={{user, userMerchant}}>
      <Outlet/>
    </AppContext.Provider>
  );
}

export default App;
