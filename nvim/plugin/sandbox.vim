fun! g:WatchInput() abort
  let g:s = ''
  while 1
    let c = nr2char(getchar())
    if c ==# 'q'
      break
    endif
    let g:s .= c
  endwhile
  echom g:s
endf
