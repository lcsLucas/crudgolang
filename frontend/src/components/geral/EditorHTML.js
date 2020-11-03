import React, { useRef, useEffect } from 'react'
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle'
import "summernote/dist/summernote.css"
import "summernote/dist/summernote"


export default ({ clear, conteudo, initEditor, setInitEditor }) => {
  const refSummer = useRef(null)
  let $_refSummer = null

  useEffect(() => {

    if (!initEditor) {
      setInitEditor(true)

      window.jQuery = $;
      window.jquery = $;
      window.$ = $;

      const $_refSummer = $(refSummer.current);

      let textArea = document.createElement('textarea');
      textArea.innerHTML = conteudo;

      $_refSummer.val(textArea.innerText)

      if (clear || $_refSummer) {
        $_refSummer.summernote('destroy');
      }

      $_refSummer.summernote({
        height: 200,
        lang: "pt-BR"
      });
    }

    return function destroySummerNote() {
      if ($_refSummer)
        $_refSummer.summernote('destroy');
    }

  })

  return (
    <textarea ref={refSummer} id="summernote" name="conteudo"></textarea>
  )
}