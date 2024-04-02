import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';
import googleIcon from "../../images/google.png";

export const Login = ({ handleGoogleLogin, redirect, isLogged }) => {
    return (
        <div>
            {redirect || isLogged ? (
                <Navigate to="/" />
            ) : (
                <div className='col-8 mx-auto text-center'>
                    <button className="buttonPlaylist mt-3" onClick={handleGoogleLogin}>
                        <span>Login</span>
                        <img src={googleIcon} className='log-img ms-3' />
                    </button>
                </div>
            )}
        </div>
    )
}

export default Login;