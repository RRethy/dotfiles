nnoremap g/ :StillSearch<CR>

command! StillSearch set hls | call Still_search()

if has("autocmd")
  augroup still_autocmds
    autocmd!
    autocmd CmdlineLeave * try | call matchdelete(1997) | catch /.*/ | endtry
  augroup END
endif

fun! Still_search() abort
  nohls
  let Highlight_cb = function("s:highlight_cb")
  let search = input({'prompt': '/', 'highlight': Highlight_cb})
  let @/ = search
endf

fun! s:highlight_cb(cmdline) abort
  try
    call matchdelete(1997)
  catch /\v(E802|E803)/
  endtry
  let pattern = ''
  if !&magic
    let pattern .= '\M'
  endif
  if &ignorecase
    let pattern .= '\c'
  endif
  let pattern .= a:cmdline
  call matchadd('Search', pattern, 0, 1997)
  redraw
  return []
endf
