command! OutSource call <SID>source_config_file()

let s:blacklist = [
      \ expand('~/.config/nvim/plugin/outsource.vim'),
      \ expand('~/.config/nvim/plugin/pluginsettings.vim'),
      \ ]

fun! s:source_config_file() abort
  source $MYVIMRC
  for file in glob('~/.config/nvim/plugin/*', 1, 1)
    if index(s:blacklist, file) == -1
      exe 'source ' . file
    endif
  endfor
endf
