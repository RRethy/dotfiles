nnoremap / /\v
nnoremap <silent> n :call g:MoveNext('n')<CR>
nnoremap <silent> N :call g:MoveNext('N')<CR>

" if has("autocmd")
"   augroup searchnext_autocmd
"     autocmd!
"     autocmd CmdlineLeave * call g:MaybeHi()
"   augroup END
" endif

hi searchnext guibg=#0c4260 gui=bold

" fun! g:MaybeHi() abort
"   if getcmdtype() =~# '\v[/?]'
"     let l:searchPattern = getcmdline()
"     silent! call matchadd("searchnext", '\V\(\k\*\%#\k\*\)\&' . l:searchPattern)
"   else
"   endif
" endf

fun! g:MoveNext(direction) abort
  try
    exe 'norm!' . a:direction . 'zz'
  catch /E486/
    echom 'No matched found :('
  endtry
  silent! call matchadd("searchnext", '\V\(\k\*\%#\k\*\)\&' . @/)
endf
