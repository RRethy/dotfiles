command! -range=% ReverseLines :<line1>,<line2>call s:reverse_lines()

fun! s:reverse_lines() range
  let i = 0
  let mid = (a:lastline - a:firstline) / 2 + a:firstline
  while (a:firstline + i) <= mid
    let higher_line = getline(a:firstline + i)
    call setline(a:firstline + i, getline(a:lastline - i))
    call setline(a:lastline - i, higher_line)
    let i += 1
  endwhile
endf
