fun! utils#errm(msg) abort
    echohl Error | echom a:msg | echohl None
endfun

fun! utils#infom(msg) abort
    echohl MoreMsg | echom a:msg | echohl None
endfun
