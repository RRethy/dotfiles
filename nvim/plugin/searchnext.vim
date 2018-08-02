nnoremap n :call g:MoveNext('n')<CR>
nnoremap N :call g:MoveNext('N')<CR>

hi searchnext guibg=#0c4260 gui=bold

fun! g:MoveNext(direction)
  exe 'norm!' . a:direction . 'zz'
  silent! call matchadd("searchnext", '\V\(\k\*\%#\k\*\)\&' . @/)
endf
