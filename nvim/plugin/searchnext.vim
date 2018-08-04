nnoremap / /\v
" nnoremap <silent> n :call g:MoveNext('n')<CR>
" nnoremap <silent> N :call g:MoveNext('N')<CR>
" nnoremap <silent> <Leader>n :call g:StopdatHi()<bar>:nohls<CR>
nnoremap <silent> <Leader>n :nohls<CR>

" cnoremap <silent> <CR> <CR>:call Foo()<CR>

" if has("autocmd")
"   augroup searchnext_autocmd
"     autocmd!
"     autocmd CmdlineLeave * call g:MaybeHi()
"   augroup END
" endif

hi searchnext guibg=#0c4260 gui=bold

fun! Foo() abort
  try
    silent! call matchdelete(1997)
  catch /\v(E803|E802)/
  endtry
  silent! call matchadd("searchnext", '\V\(\k\*\%#\k\*\)\&' . @/, 10, 1997)
endf

" fun! g:MaybeHi() abort
"   if getcmdtype() =~# '\v[/?]'
"     let l:searchPattern = getcmdline()
"   else
"   endif
" endf

fun! g:StopdatHi() abort
  try
    silent! call matchdelete(1997)
  catch /\v(E803|E802)/
  endtry
endf

fun! g:MoveNext(direction) abort
  try
    exe 'norm!' . a:direction . 'zz'
  catch /E486/
    echom 'No matched found :('
  endtry
  silent! call matchadd("searchnext", '\V\(\k\*\%#\k\*\)\&' . @/, 10, 1997)
endf
