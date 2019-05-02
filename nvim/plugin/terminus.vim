command! -bang -bar -nargs=1 -complete=file
         \ Sh call s:execute(<bang>0, expand(<f-args>))

fun! s:execute(bang, cmd) abort
   echom a:cmd
   vert new
   let job_id = termopen(a:cmd, {
            \ 'cmd': a:cmd,
            \ 'on_exit': function('s:on_exit')
            \ })
   if job_id
      echohl MoreMsg
      echom '['.a:cmd.'] started successfully with job_id '.job_id
   else
      echohl Error
      echom '['.a:cmd.'] started unsuccessfully'
   endif
   echohl None
endf

fun! s:on_exit(id, data, event) abort dict
   echohl MoreMsg
   echom '['.self.cmd.'] completed with exit code '.a:data
   echohl None
endf
