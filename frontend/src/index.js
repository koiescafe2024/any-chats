import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './routes/Home';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Website from './routes/Website';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
        <Route path="*" element={<Navigate to="/login" replace />} />
      

        {/* <Route path="/" element={<Website />}/> */}
        <Route path="/login" element={<Login />}/>
        {/* <Route path="/signup" element={<Signup />}/> */}

        <Route path="/" element={<Website />} />
        <Route path="/" element={<App />}>
          <Route path="/:user_id/:profile_id" element={<Home />}/>
        </Route>

        {/* <Route path="/" element={<App />}>
          <Route path="/:user_id/:profile_id" element={<Home />}/>
          <Route path="/:user_id/:profile_id/upwork" element={<Upwork/>}/>
          <Route path="/:user_id/:profile_id/comment" element={<Comment/>}/>
          <Route path="/:user_id/:profile_id/comment/control" element={<CommentControl/>}/>
          <Route path="/:user_id/:profile_id/hire" element={<Hire />}/>
          <Route path="/:user_id/:profile_id/work" element={<Work />}/>
        </Route>

        <Route path="/" element={<App3 />}>
            <Route path="/:user_id/:profile_id/:master_id/comment" element={<AssistantComment />}/>
        </Route> */}
        
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
