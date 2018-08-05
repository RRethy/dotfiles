" This is my pathetic runtimepath manager
" It is meant as a helper for vim native package support
" It helps you use pack/

command PatheticTags helptags ALL

command NERDTreeToggle call g:NerdTreeInitialToggle()

command -nargs=1 AddPlug call g:AddPlugin(<args>)
command UpdatePlugs call g:UpdatePlugins()

fun! g:AddPlugin(plugin) abort
  silent exe '!git submodule add git@github.com:' . a:plugin . '.git' . ' ~/.config/nvim/pack/othersplugins/start/' . split(a:plugin, '/')[1]
endf

fun! s:RemovePlugin(plugin) abort
  " TODO: Figure out how to remove it from .gitmodules and .git/config
  exe '!git rm –cached ~/.config/nvim/pack/othersplugins/start/' . split(a:plugin, '/')[1]
  exe '!rm -rf ~/.config/nvim/pack/othersplugins/start/' . split(a:plugin, '/')[1]
endf

fun! g:UpdatePlugins() abort
  silent exe '!git submodule update --recursive --remote'
  silent exe '!git submodule foreach --recursive git checkout master'
endf

fun! g:NerdTreeInitialToggle() abort
  delcommand NERDTreeToggle
  packadd nerdtree
  exe 'helptags ' . $HOME . '/.config/nvim/pack/othersplugins/opt/nerdtree/doc/'
  NERDTreeToggle
endf
