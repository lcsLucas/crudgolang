import React, { useEffect, useState, useContext } from 'react'
import $ from 'jquery';

import { Context } from '../Context/AuthContext'

import FormUser from './Users/FormUser'
import ListUsers from './Users/ListUsers'

export default () => {

    const { URLAPI } = useContext(Context)

    const [statusForm, setStatusForm] = useState("novo") // novo, atualizar
    const [list_users, setListUsers] = useState([])

    const [userEdit, setUserEdit] = useState({})
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    const onChangeForm = (user) => {
        setStatusForm("edit")
        setNome(user.nome)
        setEmail(user.email)
        setSenha("")
        setUserEdit(user)

        $('html, body').animate({
            scrollTop: 0
        }, 800);

    }

    const getUsers = async () => {
        const url_request = `${URLAPI}/users`

        try {
            const list_req = await (await fetch(url_request, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })).json()

            setListUsers(list_req)

        } catch (error) { }
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <>
            <FormUser nome={nome} email={email} senha={senha} changeNome={setNome} changeEmail={setEmail} changeSenha={setSenha} statusForm={statusForm} changeStatusForm={setStatusForm} userEdit={userEdit} refreshList={getUsers} />
            <ListUsers onChangeStatusForm={onChangeForm} users={list_users} refreshList={getUsers} />
        </>
    )
}