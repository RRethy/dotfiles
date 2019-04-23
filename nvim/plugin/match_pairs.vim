fun! s:setup_pair(start, end) abort
  exe 'inoremap <expr> '.a:start.' <SID>open_pair("'.a:start.'","'.a:end.'")'
  exe 'inoremap <expr> '.a:end.' <SID>close_pair("'.a:end.'")'
endf

call s:setup_pair('(', ')')
call s:setup_pair('{', '}')
call s:setup_pair('[', ']')

fun! s:open_pair(start, end) abort
  let line = getline('.')
  if len(line) >= col('.') && line[col('.') - 1] ==# a:end
    return a:start
  else
    return a:start.a:end."\<Left>"
  endif
endf

fun! s:close_pair(closing_char) abort
  let line = getline('.')
  if len(line) >= col('.') && line[col('.') - 1] ==# a:closing_char
    return "\<Right>"
  else
    return a:closing_char
  endif
endf
