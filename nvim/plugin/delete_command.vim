command! Delete call s:delete()

fun! s:delete() abort
   silent !rm -f %
   silent bd!
endf
