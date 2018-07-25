fun! utils#pad(padding)
  exe 'norm i' . a:padding . 'la' . a:padding . '' . repeat('h', strlen(a:padding))
endf

fun! utils#togglewrapping()
  if &wrap
    set nowrap
    set nolinebreak
    silent! nunmap j
    silent! nunmap k
  else
    set wrap
    set linebreak
    nnoremap j gj
    nnoremap k gk
  endif
endf
