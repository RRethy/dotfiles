fun! g:Foo() abort
  windo :call matchadd('Error', 'nnoremap')
  1wincmd w
endf
