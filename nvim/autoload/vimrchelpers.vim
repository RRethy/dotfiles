function! vimrchelpers#shouldLoadDeoplete() abort
  " I don't need deoplete when writing git commit messages
  let blacklist=['gitcommit']
  " return deoplete#is_enabled() && index(blacklist, &ft) < 0
  return !exists('g:deoplete#_initialized') && index(blacklist, &ft) < 0
endfunction

