import React, { useContext } from 'react'

import { Context } from '../../Context/AuthContext'

import Header from "../geral/HeaderContent"

export default ({ posts, refreshList, onChangeStatusForm }) => {

    const { authResponse, URLAPI } = useContext(Context)


    const ItemData = ({ data }) => {
        let str_data = ''
        let parts_data = data.split("T")

        let parts_date = parts_data[0].split("-")
        str_data += parts_date[2] + "/" + parts_date[1] + "/" + parts_date[0]

        str_data += " " + parts_data[1].substr(0, 8)

        return str_data
    }

    const ItemPost = ({ post }) => {

        const editPost = () => {
            onChangeStatusForm(post)
        }

        const removePost = async () => {

            try {
                const url_request = `${URLAPI}/posts/${post.id}`

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
                <td className="text-center">{post.id}</td>
                <td>{post.titulo}</td>
                <td><ItemData data={post.data_publicacao} /></td>
                <td>{post.usuario.nome}</td>
                <td className="text-center">
                    <button onClick={editPost} className="btn btn-primary">
                        <svg width={`1em`} height={`1em`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z" ></path></svg>
                    </button>
                    <button onClick={removePost} className="btn btn-danger ml-2">
                        <svg width={`1.1em`} height={`1.1em`} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" ><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" ></path></svg>
                    </button>
                </td>
            </tr>
        )
    }

    return (
        <div className="content">
            <Header className="header">
                <h3>Lista de Post</h3>
            </Header>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th className="border-top-0 text-center">ID</th>
                        <th className="border-top-0">Título</th>
                        <th className="border-top-0">Data Publicação</th>
                        <th className="border-top-0">Autor</th>
                        <th width={190} className="border-top-0 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.length === 0 && <tr><td className="text-center" colSpan="4">Nenhum Post encontrado.</td></tr>}
                    {posts.length > 0 && posts.map((p, i) => <ItemPost post={p} key={i} />)}
                </tbody>
            </table>
        </div>
    )
}