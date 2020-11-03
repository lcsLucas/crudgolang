import React, { createContext, useState, useEffect } from 'react'

const Context = createContext();

const URLAPI = 'http://localhost:9000'

function AuthProvider({ children }) {

    const [authenticated, setAuthenticated] = useState({
        status: false,
        response: {}
    })

    const handleCheckToken = async () => {

        const token = localStorage.getItem("token")

        if (token) {
            try {

                const url_request = `${URLAPI}/check-token`

                const req_check = await fetch(url_request, {
                    method: "POST",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Credentials": "true",
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (req_check.ok && req_check.status === 200) {
                    setAuthenticated({
                        status: true,
                        response: token
                    })
                }

            } catch (error) {
                setAuthenticated({
                    status: false,
                    response: {}
                })
                console.log(error);
            }
        }

    }

    useEffect(() => {
        handleCheckToken()
    }, [])

    const handleLogin = async (form_json) => {

        try {
            const url_request = `${URLAPI}/login`

            const req_login = await (await fetch(url_request, {
                method: `POST`,
                headers: {
                    "Content-Type": "application/json"
                },
                body: form_json
            })).json()

            setAuthenticated({
                status: !req_login.error,
                response: req_login
            })

            if (!req_login.error) {
                localStorage.setItem("token", req_login)
            }

        } catch (error) {
            setAuthenticated({
                status: false,
                response: {
                    error: "Não foi possível fazer a requisição, tente novamente"
                }
            })
        }

    }

    const handleLogout = () => {
        setAuthenticated({
            status: false,
            response: {}
        })
        localStorage.removeItem("token")
    }

    return (
        <Context.Provider value={{ URLAPI, authenticated: authenticated.status, authResponse: authenticated.response, handleLogin, handleLogout }} >
            { children}
        </Context.Provider>
    )
}

export { Context, AuthProvider }