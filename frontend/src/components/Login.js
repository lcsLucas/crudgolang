import React, { useContext } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'

import Header from "./geral/HeaderContent"

import { Context } from '../Context/AuthContext'

const validate = values => {
    const errors = {};

    if (!values.senha) {
        errors.senha = "Esse campo é obrigatório";
    }

    if (!values.email) {
        errors.email = "Esse campo é obrigatório";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "O email informado é inválido";
    }

    return errors;
};

export default () => {
    const { authenticated, authResponse, handleLogin } = useContext(Context)

    const onSubmit = values => {
        handleLogin(JSON.stringify(values))
    }

    return (
        <>
            {
                !authenticated && authResponse.error &&
                <div className="alert alert-danger alert-dismissible fade show mt-4" role="alert">
                    <strong>Erro!</strong> {authResponse.error}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            }
            <div className="content">
                <Header className="header">
                    <h3>Login</h3>
                </Header>
                <Formik
                    initialValues={{
                        email: "",
                        senha: ""
                    }}
                    validate={validate}
                    onSubmit={onSubmit}
                >
                    <Form>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <Field name="email" type="email" required className="form-control" />
                            <span className="error">
                                <ErrorMessage name="email" />
                            </span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="senha">Senha:</label>
                            <Field name="senha" type="password" required className="form-control" />
                            <span className="error">
                                <ErrorMessage name="senha" />
                            </span>
                        </div>
                        <button className="btn btn-primary d-block ml-auto px-5 py-2 font-weight-bold text-uppercase">Login</button>
                    </Form>
                </Formik>
            </div>
        </>
    )
}