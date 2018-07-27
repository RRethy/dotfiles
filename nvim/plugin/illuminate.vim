hi link illuminatedWord cursorline

if exists('g:loaded_illuminate')
  finish
endif
let g:loaded_illuminate = 1

if has("autocmd")
  augroup illuminated_autocmd
    autocmd!
    autocmd CursorMoved,WinLeave,BufLeave,InsertEnter * call s:Remove_illumination()
    autocmd CursorHold,InsertLeave * call s:Illuminate()
  augroup END
endif

command RemoveIllumination call s:Remove_illumination()

let s:match_ids = -1

fun! s:Illuminate() abort
  call s:Remove_illumination()

  let l:matched_word = '\<' . expand("<cword>") . '\>'
  if l:matched_word !~ @/ || !&hls || !v:hlsearch
    let s:match_ids = matchadd("illuminatedWord", '\V' . l:matched_word)
    " TODO: Figure out if this is needed, maybe do it based on language?
    " TODO: Maybe do it based on dict provided by user based on language
    " if synIDattr(synID(line('.'), col('.'), 1), "name") != "Keyword"
    " endif
  endif
endf

fun! s:Remove_illumination()
  if s:match_ids >= 0
    try
      call matchdelete(s:match_ids)
    catch /E803/
    endtry
    let s:match_ids = -1
  endif
endf
