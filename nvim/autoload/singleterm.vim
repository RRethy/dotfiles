" Toggle displaying a single terminal at the bottom of the screen
" This maintains a single interactive terminal, even between sessions

let s:singleterm_bufnr = -1
if s:singleterm_bufnr == -1
   " When starting from a session file try to use an available interactive
   " terminal instead of making a new one.
   " I naively look for any interactive zsh terminal
   for bufnr in nvim_list_bufs()
      let bufname = bufname(bufnr)
      if bufname =~# '\v\C^term.*/bin/zsh$'
         let s:singleterm_bufnr = bufnr
         break
      endif
   endfor
endif

fun! singleterm#toggle() abort
   if !s:try_to_close()
      call s:open()
   endif
endf

fun! s:open() abort
   split
   norm! J10_
   if bufexists(s:singleterm_bufnr)
      exe 'b '.s:singleterm_bufnr
   else
      term
      let s:singleterm_bufnr = bufnr('%')
   endif
   startinsert
endf

fun! s:try_to_close() abort
   if bufexists(s:singleterm_bufnr)
      let winids = win_findbuf(s:singleterm_bufnr)
      let curtabnr = tabpagenr()
      for winid in winids
         let [tabnr, winnr] = win_id2tabwin(winid)
         if curtabnr == tabnr
            exe winnr.'close'
            return 1
         endif
      endfor
   endif
   return 0
endf
