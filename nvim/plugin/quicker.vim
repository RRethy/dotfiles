command! -bar -nargs=+ Keep call s:keep(<f-args>)
command! -bar -nargs=+ Discard call s:discard(<f-args>)

fun! s:discard(...) abort
   let list = getqflist()
   for word in a:000
      let list = filter(list, 'bufname(v:val.bufnr) !~# "\^\.\*'.word.'\.\*\$"')
   endfor
   call setqflist(list)
endf

fun! s:keep(...) abort
   let list = getqflist()
   for word in a:000
      let list = filter(list, 'v:val.text =~# "\^\.\*'.word.'\.\*\$"')
   endfor
   call setqflist(list)
endf
