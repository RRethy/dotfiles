scriptencoding utf-8

if has('autocmd')
  augroup statusline_autocmd
    autocmd!
    autocmd WinEnter,VimEnter,BufEnter * if s:should_override_statusline() | call s:fancy_active_statusline() | endif
    autocmd WinLeave * if s:should_override_statusline() | call s:fancy_inactive_statusline() | endif
  augroup END
endif

fun! s:should_override_statusline()
  return index(['nerdtree'], &filetype) < 0
endf

function! s:fancy_inactive_statusline() abort
  setlocal statusline=%#SpySlNC#
  setlocal statusline+=\ 
  setlocal statusline+=%n
  setlocal statusline+=\ 
  setlocal statusline+=%#SpySlInvNC#
  setlocal statusline+=
  setlocal statusline+=%#LeftPromptNC#
  setlocal statusline+=\ 
  setlocal statusline+=%y
  setlocal statusline+=\ 
  setlocal statusline+=%{WebDevIconsGetFileTypeSymbol()}
  setlocal statusline+=\ 
  setlocal statusline+=%t
  setlocal statusline+=\ 
  setlocal statusline+=%r
  setlocal statusline+=%#LeftPromptInvNC#
  setlocal statusline+=
  setlocal statusline+=%=
  setlocal statusline+=%#RightPromptInvNC#
  setlocal statusline+=
  setlocal statusline+=%#RightPromptNC#
  setlocal statusline+=\ %20(%-9(%4l/%-4L%)\ %5(\ %-3c%)\ %-4(%3p%%%)%)
  setlocal statusline+=\ 
  " setlocal statusline=%#SilentStatusline#
  " setlocal statusline+=\ 
  " setlocal statusline+=%{WebDevIconsGetFileTypeSymbol()}
  " setlocal statusline+=\ 
  " setlocal statusline+=%t
endfunction

fun! s:simple_inactive_statusline() abort
endf

fun! s:simple_active_statusline() abort
endf

function! s:fancy_active_statusline() abort
  setlocal statusline=%#SpySl#
  setlocal statusline+=\ 
  setlocal statusline+=%n
  setlocal statusline+=\ 
  setlocal statusline+=%#SpySlInv#
  setlocal statusline+=
  setlocal statusline+=%#LeftPrompt#
  setlocal statusline+=\ 
  setlocal statusline+=%y
  setlocal statusline+=\ 
  setlocal statusline+=%{WebDevIconsGetFileTypeSymbol()}
  setlocal statusline+=\ 
  setlocal statusline+=%t
  setlocal statusline+=\ 
  setlocal statusline+=%r
  setlocal statusline+=%#LeftPromptInv#
  setlocal statusline+=
  setlocal statusline+=%#GitPrompt#
  setlocal statusline+=\ 
  setlocal statusline+=%{FugitiveStatusline()}
  setlocal statusline+=\ 
  setlocal statusline+=%#GitPromptInv#
  setlocal statusline+=
  setlocal statusline+=%=
  setlocal statusline+=%#RightPromptInv#
  setlocal statusline+=
  setlocal statusline+=%#RightPrompt#
  setlocal statusline+=\ %20(%-9(%4l/%-4L%)\ %5(\ %-3c%)\ %-4(%3p%%%)%)
  setlocal statusline+=\ 
endfunction

function! statusline#get12HourTime() abort
  if exists('*strftime')
    return strftime('%H:%M')
  else
    return ''
  endif
endfunction
