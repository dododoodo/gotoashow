import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Redirect() {
    const navigate = useNavigate();
    const search = window.location.search;
    const param = new URLSearchParams(search);
    const code = param.get("code");
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!code) return;
    
        console.log("인가 코드:", code);
        
        axios.get("https://show-server.vercel.app/kakao", { params: { code } })
        .then((res) => {
            console.log("카카오 로그인 응답 데이터:", res.data);
            const { access_token, properties, kakao_account } = res.data;

            const userData = {
                nickname: properties?.nickname || kakao_account?.profile?.nickname,
                email: kakao_account?.email || '-', 
                phone: kakao_account?.phone_number || '-',
                loginType: '카카오'
            };

            window.sessionStorage.setItem("access", access_token);
            window.sessionStorage.setItem("user", JSON.stringify(userData));
            window.sessionStorage.setItem("isLoggedIn", "true");

            setUser(userData);
            navigate("/home");
        })
        .catch(error => {
            console.error("카카오 로그인 오류:", error);
        });

    }, [code, navigate]);
    


    return <div>{user ? user.nickname : "준비중..."}</div>;
}

export default Redirect;
