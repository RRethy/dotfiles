let mapleader=" "
let maplocalleader="\\"
colorscheme myonedark

call mkdir($HOME . '/.local/share/nvim/tmp/', 'p')

set runtimepath+=~/.fzf

" TODO Figure out what I want to do with this:
" vim:set et sw=2 foldmethod=expr foldexpr=getline(v\:lnum)=~'^\"\ Section\:'?'>1'\:getline(v\:lnum)=~#'^fu'?'a1'\:getline(v\:lnum)=~#'^endf'?'s1'\:'=':
