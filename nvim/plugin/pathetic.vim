" This is my pathetic runtimepath manager
" It is meant as a helper for vim native package support
" It helps you use pack/

command PatheticTags helptags ALL

command NERDTreeToggle call g:NerdTreeInitialToggle()

command -nargs=1 AddPlug call g:AddPlugin(<args>)
command -nargs=1 RemovePlug call g:RemovePlugin(<args>)
command UpdatePlugs call g:UpdatePlugins()

fun! g:AddPlugin(plugin) abort
  exe '!(cd ~/.config'
        \. '; git submodule add git@github.com:' . a:plugin . '.git nvim/pack/othersplugins/start/' . split(a:plugin, '/')[1]
        \. '; git commit -m "Added plugin: ' . a:plugin . '"'
        \. ')'
endf

fun! g:RemovePlugin(plugin) abort
  " TODO: Figure out how to remove it from .gitmodules and .git/config
  exe '!(cd ~/.config'
        \. '; git submodule deinit nvim/pack/othersplugins/start/' . split(a:plugin, '/')[1]
        \. '; git rm nvim/pack/othersplugins/start/' . split(a:plugin, '/')[1]
        \. '; git commit -m "Removed plugin: ' . a:plugin . '"'
        \. '; rm -rf .git/modules/nvim/pack/othersplugins/start/' . split(a:plugin, '/')[1]
        \. '; rm -rf nvim/pack/othersplugins/start/' . split(a:plugin, '/')[1]
        \. ')'
  echo 'Successfully removed: ' . a:plugin
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
