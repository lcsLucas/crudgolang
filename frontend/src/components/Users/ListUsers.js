import React, { useContext } from 'react'

import { Context } from '../../Context/AuthContext'

import Header from "../geral/HeaderContent"

export default ({ users, onChangeStatusForm, refreshList }) => {

    const { authResponse, URLAPI } = useContext(Context)

    const ItemUser = ({ user }) => {

        const editUser = () => {
            onChangeStatusForm(user)
        }

        const removeUser = async () => {
            try {
                const url_request = `${URLAPI}/users/${user.id}`

                const req_remove = await fetch(url_request, {
                    method: "DELETE",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Credentials": "true",
                        "Authorization": `Bearer ${authResponse}`
                    }
                })

                if (req_remove.ok && req_remove.status === 204)
                    refreshList()

            } catch (e) {
                console.log(e);
            }
        }

        return (
            <tr>
                <td className="text-center">{user.id}</td>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td className="text-center">
                    <button onClick={editUser} className="btn btn-primary">
                        <svg width={`1em`} height={`1em`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z" ></path></svg>
                    </button>
                    <button onClick={removeUser} className="btn btn-danger ml-2">
                        <svg width={`1.1em`} height={`1.1em`} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" ><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" ></path></svg>
                    </button>
                </td>
            </tr>
        )
    }

    return (
        <div className="content">
            <Header className="header">
                <h3>Lista de Usuários</h3>
            </Header>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th className="border-top-0 text-center">ID</th>
                            <th className="border-top-0">Nome</th>
                            <th className="border-top-0">Email</th>
                            <th style={{minWidth: 190}} className="border-top-0 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 && <tr><td className="text-center" colSpan="4">Nenhum Usuário encontrado.</td></tr>}
                        {users.length > 0 && users.map((u, i) => <ItemUser user={u} key={i} />)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}