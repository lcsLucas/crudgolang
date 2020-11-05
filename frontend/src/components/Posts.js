import React, { useEffect, useState, useContext } from 'react'
import $ from 'jquery';

import { Context } from '../Context/AuthContext'

import FormPost from './Posts/FormPost'
import ListPosts from './Posts/ListsPosts'

export default () => {

    const { URLAPI } = useContext(Context)

    const [statusForm, setStatusForm] = useState("novo") // novo, atualizar
    const [list_posts, setListPosts] = useState([])

    const [postEdit, setPostEdit] = useState({})
    const [titulo, setTitulo] = useState("")
    const [data, setData] = useState("")
    const [conteudo, setConteudo] = useState("")
    const [initEditor, setInitEditor] = useState(false)

    const onChangeForm = (post) => {
        setStatusForm("edit")
        setTitulo(post.titulo)
        setData(post.data_publicacao.substr(0, 10))
        setConteudo(post.conteudo)
        setPostEdit(post)
        setInitEditor(false)

        $('html, body').animate({
            scrollTop: 0
        }, 800);

    }

    const getPosts = async () => {
        const url_request = `${URLAPI}/posts`

        try {
            const list_req = await (await fetch(url_request, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })).json()

            setListPosts(list_req)

        } catch (error) { }
    }

    useEffect(() => {
        getPosts()
    }, [])

    return (
        <>
            <FormPost titulo={titulo} data={data} conteudo={conteudo} changeTitulo={setTitulo} changeData={setData} changeConteudo={setConteudo} statusForm={statusForm} changeStatusForm={setStatusForm} postEdit={postEdit} refreshList={getPosts} initEditor={initEditor} setInitEditor={setInitEditor} />
            <ListPosts onChangeStatusForm={onChangeForm} refreshList={getPosts} posts={list_posts} />
        </>
    )
}