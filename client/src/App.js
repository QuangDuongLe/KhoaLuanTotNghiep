import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import Default from './Components/defaut';
import Footer from './Components/Footer/footer';
import { isJsonString } from './ultil';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateUser } from './redux/Slide/userSlice';
import Default2 from './Components/default2';
function App() {
  const dispatch = useDispatch();
  const axiosJWT = axios.create();
  useEffect(() => {
    const { storageData, decoded } = handleDecoded()
    if (decoded.id) {
      handleGetDetails(decoded.id, storageData)
    }
  }, [])
  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decoded = jwt_decode(storageData);
    }
    return { decoded, storageData }
  }
  const refresh_token = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh-token`, {}, {
        withCredentials: true
      })
      return res.data
    } catch (error) {
      console.error('Lỗi khi lấy refresh_token:', error);
    }
  };

  axiosJWT.interceptors.request.use(async function (config) {
    const currentTime = new Date();
    const { decoded } = handleDecoded();

    if (decoded?.exp < currentTime.getTime() / 1000) {
      const data = await refresh_token();
      config.headers['token'] = `Bearer ${data.access_Token}`;
    }

    return config;
  }, function (error) {
    console.error("Lỗi khi gửi request:", error);
    return Promise.reject(error);
  });



  const handleGetDetails = async (id, access_Token) => {
    try {
      const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-Detail/${id}`, {
        headers: {
          token: `Bearer ${access_Token}`,
        }
      })
      dispatch(updateUser({ ...res.data.data, access_token: access_Token }))
    } catch (err) {
      console.log('Lỗi:', err);
    }
  }
  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Layout = route.isShowHeader ? Default : Fragment;
            const Page = route.page;
            const Layout2 = route.isShowFooter ? Default2 : Fragment;
            return (
              <Route key={route.path} path={route.path} element={
                <>
                  <Layout />
                  <Page />
                  <Layout2 />
                </>
              } />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
