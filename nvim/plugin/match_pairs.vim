let s:opening_chars = []
let s:closing_chars = []

fun! s:setup_pair(start, end) abort
   call add(s:opening_chars, a:start)
   call add(s:closing_chars, a:end)
   exe 'inoremap <expr> '.a:start.' <SID>open_pair("'.a:start.'","'.a:end.'")'
   exe 'inoremap <expr> '.a:end.' <SID>close_pair("'.a:end.'")'
endf

call s:setup_pair('(', ')')
call s:setup_pair('{', '}')
call s:setup_pair('[', ']')

inoremap <expr> <backspace> <SID>do_backspace()

fun! s:open_pair(start, end) abort
   if col('$') - 1 >= col('.') && getline('.')[col('.') - 1] ==# a:end
      return a:start
   else
      return a:start.a:end."\<Left>"
   endif
endf

fun! s:close_pair(closing_char) abort
   if col('$') - 1 >= col('.') && getline('.')[col('.') - 1] ==# a:closing_char
      return "\<Right>"
   else
      return a:closing_char
   endif
endf

fun! s:do_backspace() abort
   let line = getline('.')
   if col('.') > 1
            \ && col('.') < col('$')
            \ && index(s:opening_chars, line[col('.') - 2]) != -1
      return "\<Del>\<backspace>"
   endif

   return "\<backspace>"
endf
