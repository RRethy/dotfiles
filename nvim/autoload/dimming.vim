" These are a bunch of function for dimming
" and undimming buffers and regions of buffers
" The buffer dimming can be done much more effectively
" with higlight group NormalNC

function! dimming#dimInactiveWindows() abort
  for i in range(1, tabpagewinnr(tabpagenr(), '$'))
    let l:range=""
    if i != winnr()
      if &wrap
        let l:width=256 " max
      else
        let l:width=winwidth(i)
      endif
      let l:range=join(range(1, l:width), ',')
    endif
    call setwinvar(i, '&colorcolumn', l:range)
  endfor
endfunction

function! dimming#dimBuffer() abort
  let l:range=""
  if &wrap
    let l:width=256 " max
  else
    let l:width=winwidth(i)
  endif
  let l:range=join(range(1, l:width), ',')
  call setwinvar(winnr(), '&colorcolumn', l:range)
endfunction

function! dimming#unDimBuffer() abort
  let l:range=""
  call setwinvar(winnr(), '&colorcolumn', l:range)
endfunction

function! dimming#dimPastColumn(col) abort
  let l:window=winnr()
  let l:width=winwidth(l:window)
  if l:width > a:col " This is a check for NERDTree
    let l:range=join(range(a:col, l:width), ',')
    call setwinvar(l:window, '&colorcolumn', l:range)
  endif
endfunction

