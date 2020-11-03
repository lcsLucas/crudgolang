import React, { useState, useContext } from 'react'
import $ from 'jquery';

import { Context } from '../../Context/AuthContext'

import EditorHTML from "../geral/EditorHTML"
import Header from "../geral/HeaderContent"

export default ({ titulo, data, conteudo, statusForm, changeStatusForm, postEdit, refreshList, changeTitulo, changeData, changeConteudo, initEditor, setInitEditor }) => {

    const { authResponse, URLAPI } = useContext(Context)

    const [alert, setAlert] = useState({})
    const [load, setLoad] = useState(false)
    const [clearEditor, setClearEditor] = useState(false)

    const handleChangeTitulo = (e) => {
        e.preventDefault()
        changeTitulo(e.target.value)
    }

    const handleChangeData = (e) => {
        e.preventDefault()
        changeData(e.target.value)
    }

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

            if (key === "id")
                value = +value

            if (key === "data_publicacao") {
                const date_curr = new Date()
                value = value + "T" + ("0" + date_curr.getHours()).substr(-2) + ":" + ("0" + date_curr.getMinutes()).substr(-2) + ":" + ("0" + date_curr.getSeconds()).substr(-2) + "Z"
            }

            if (key === "conteudo")
                changeConteudo(value)

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

            const url_request = `${URLAPI}/posts${statusForm === "edit" ? "/" + postEdit.id : ""}`

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
                msg: req_cad.error ? `Não foi possível realizar a operação (${req_cad.error})` : `Post ${statusForm === "novo" ? "cadastrado" : "alterado"} com sucesso`
            })

            if (!req_cad.error) {
                changeTitulo("")
                changeData("")
                changeConteudo("")
                changeStatusForm("novo")
                setClearEditor(true)
                setInitEditor(false)
                refreshList()

                $('html, body').animate({
                    scrollTop: 0
                }, 800);

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
        <>
            {
                alert.status &&
                <div className="alert alert-success alert-dismissible fade show mt-4" role="alert">
                    <strong>Sucesso!</strong> {alert.msg}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            }

            {
                alert.enabled && !alert.status &&
                <div className="alert alert-danger alert-dismissible fade show mt-4" role="alert">
                    <strong>Erro!</strong> {alert.msg}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            }
            <div className="content">
                <Header className="header">
                    <h3>{statusForm === "edit" ? `Editar Post "${postEdit.titulo}"` : "Gerenciar Posts"}</h3>
                </Header>
                <form onSubmit={onSubmitForm}>
                    <div className="row">
                        <div className="col-12 col-lg-9">
                            <div className="form-group">
                                <label>Título do Post:</label>
                                <input value={titulo} onChange={handleChangeTitulo} name="titulo" required className="form-control" />
                                {statusForm === "edit" ? <input name="id" type="hidden" defaultValue={postEdit.id} /> : undefined}
                            </div>
                        </div>
                        <div className="col-12 col-lg-3">
                            <div className="form-group">
                                <label>Data do Post:</label>
                                <input value={data} onChange={handleChangeData} type="date" name="data_publicacao" required className="form-control" />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group">
                                <label>Conteúdo do Post:</label>
                                <EditorHTML initEditor={initEditor} setInitEditor={(arg) => { setInitEditor(arg) }} clear={clearEditor} conteudo={conteudo} />
                            </div>
                        </div>
                        <div className="col-12">
                            <button disabled={load} className="btn btn-primary d-block ml-auto px-5 py-2 font-weight-bold text-uppercase">{statusForm === "edit" ? "Alterar" : "Cadastrar"}</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}