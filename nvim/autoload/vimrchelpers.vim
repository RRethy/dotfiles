function! vimrchelpers#shouldLoadDeoplete() abort
  " I don't need deoplete when writing git commit messages
  let blacklist=['gitcommit']
  return isdirectory($HOME . '/.config/nvim/pack/othersplugins/start/deoplete.vim')
        \ && !exists('g:deoplete#_initialized')
        \ && index(blacklist, &ft) < 0
endfunction

