" This is my pathetic runtimepath manager
" It is meant as a helper for vim native package support
" It helps you use pack/

command PatheticHelpTags helptags ALL

command NERDTreeToggle call g:AddNerdtree()

command -nargs=1 AddPlug call g:AddPlugin(<args>)

fun! g:AddPlugin(plugin) abort
  exe '!git submodule add git@github.com:' . a:plugin . '.git' . ' ~/.config/nvim/pack/othersplugins/start/' . split(a:plugin, '/')[1]
endf

fun! g:AddNerdtree() abort
  delcommand NERDTreeToggle
  packadd nerdtree
  NERDTreeToggle
endf
