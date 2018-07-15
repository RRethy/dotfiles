" Adds numbers to the start of each line in the range
function! listmaker#generateNumbers() range
  let l:i=1
  let l:lnum=a:firstline
  while l:lnum <= a:lastline
    call s:prependToLine(l:lnum, l:i)
    let l:i+=1
    let l:lnum+=1
  endwhile
endfunction

" Adds lowercase letters to the start of each line in the range (max of 26 lines currently)
function! listmaker#generateLowercaseLetters() range
  if a:lastline - a:firstline + 1 > 26
    echoerr "Unable to add letters to a list with more than 26 lines :("
    return
  endif
  let l:letters=['a', 'b', 'c', 'd', 'e',
        \ 'f', 'g', 'h', 'i', 'j',
        \ 'k', 'l', 'm', 'n', 'o',
        \ 'p', 'q', 'r', 's', 't',
        \ 'u', 'v', 'w', 'x', 'y',
        \ 'z']
  let l:i=0
  let l:lnum=a:firstline
  while l:lnum <= a:lastline
    call s:prependToLine(l:lnum, l:letters[l:i])
    let l:i+=1
    let l:lnum+=1
  endwhile
endfunction

" Adds uppercase letters to the start of each line in the range (max of 26 lines currently)
function! listmaker#generateUppercaseLetters() range
  if a:lastline - a:firstline + 1 > 26
    echoerr "Unable to add letters to a list with more than 26 lines :("
    return
  endif
  let l:letters=['A', 'B', 'C', 'D', 'E',
        \ 'F', 'G', 'H', 'I', 'J',
        \ 'K', 'L', 'M', 'N', 'O',
        \ 'P', 'Q', 'R', 'S', 'T',
        \ 'U', 'V', 'W', 'X', 'Y',
        \ 'Z']
  let l:i=0
  let l:lnum=a:firstline
  while l:lnum <= a:lastline
    call s:prependToLine(l:lnum, l:letters[l:i])
    let l:i+=1
    let l:lnum+=1
  endwhile
endfunction

function! s:prependToLine(line, text)
  exe a:line . "norm 0i" . a:text . ". "
endfunction
