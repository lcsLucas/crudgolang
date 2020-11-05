import React, { useState, useContext } from 'react'

import { Context } from '../../Context/AuthContext'

import Header from "../geral/HeaderContent"

export default ({ nome, email, senha, statusForm, userEdit, changeNome, changeEmail, changeSenha, changeStatusForm, refreshList }) => {
    const { authResponse, URLAPI } = useContext(Context)

    const [alert, setAlert] = useState({})
    const [load, setLoad] = useState(false)

    const onSubmitForm = (e) => {
        e.preventDefault()
        setLoad(true)
        enviarForm(e.target)
    }

    const formToJSON = (elem) => {
        let current, entries, item, key, output, value;
        output = {};
        entries = new FormData(elem).entries();
        // Iterate over values, and assign to item.
        while (item = entries.next().value) {
            // assign to variables to make the code more readable.
            key = item[0];
            value = item[1];

            // Check if key already exist
            if (Object.prototype.hasOwnProperty.call(output, key)) {
                current = output[key];
                if (!Array.isArray(current)) {
                    // If it's not an array, convert it to an array.
                    current = output[key] = [current];
                }
                current.push(value); // Add the new value to the array.
            } else {
                output[key] = value;
            }
        }
        return JSON.stringify(output);
    }

    const enviarForm = async (form) => {
        try {

            const url_request = `${URLAPI}/users${statusForm === "edit" ? "/" + userEdit.id : ""}`

            const req_cad = await (await fetch(url_request, {
                method: `${statusForm === "novo" ? 'POST' : 'PUT'}`,
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "true",
                    "Authorization": `Bearer ${authResponse}`
                },
                body: formToJSON(form)
            })).json()

            setAlert({
                enabled: true,
                status: req_cad.error ? false : true,
                msg: req_cad.error ? `Não foi possível realizar a operação (${req_cad.error})` : `Usuário ${statusForm === "novo" ? "cadastrado" : "alterado"} com sucesso`
            })

            if (!req_cad.error) {
                changeNome("")
                changeEmail("")
                changeSenha("")
                changeStatusForm("novo")
                refreshList()
            }

        } catch (e) {
            setAlert({
                enabled: true,
                status: false,
                msg: `Não foi possível realizar a operação (${e})`
            })
        }

        setLoad(false)
    }

    return (
        <div className="content">
            <Header className="header">
                <h3>{statusForm === "edit" ? `Editar Usuário "${userEdit.nome}"` : "Gerenciar Usuários"}</h3>
            </Header>
            <form onSubmit={onSubmitForm} >
                <div className="row">
                    <div className="col-12 col-lg-12">
                        <div className="form-group">
                            <label>Nome do Usuário:</label>
                            <input value={nome} onChange={(e) => { e.preventDefault(); changeNome(e.target.value) }} name="nome" required className="form-control" />
                            {statusForm === "edit" ? <input name="id" type="hidden" defaultValue={userEdit.id} /> : undefined}
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="form-group">
                            <label>Email do Usuário:</label>
                            <input value={email} onChange={(e) => { e.preventDefault(); changeEmail(e.target.value) }} type="email" name="email" required className="form-control" />
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="form-group">
                            <label>Senha do Usuário:</label>
                            <input value={senha} onChange={(e) => { e.preventDefault(); changeSenha(e.target.value) }} type="password" name="senha" required className="form-control" />
                        </div>
                    </div>
                    <div className="col-12">
                        <button disabled={load} className="btn btn-primary d-block ml-auto px-5 py-2 font-weight-bold text-uppercase">{statusForm === "edit" ? "Alterar" : "Cadastrar"}</button>
                    </div>
                </div>
            </form>
        </div>
    )
}