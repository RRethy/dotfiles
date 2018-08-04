" This is my pathetic runtimepath manager
" It is meant as a helper for vim native package support
" It helps you use pack/

command PatheticHelpTags helptags ALL

command NERDTreeToggle call g:AddNerdtree()

fun! g:AddNerdtree() abort
  delcommand NERDTreeToggle
  packadd nerdtree
  NERDTreeToggle
endf
