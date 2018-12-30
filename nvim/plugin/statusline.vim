if has("autocmd")
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
  " TODO: Change this to a setlocal
  let &l:statusline="%#SilentStatusline#"
        \ . ' %{WebDevIconsGetFileTypeSymbol()}'
        \ . ' %t'
endfunction

fun! s:simple_inactive_statusline() abort
endf

fun! s:simple_active_statusline() abort
endf

function! s:fancy_active_statusline() abort
  " TODO: Change this to a setlocal
  let &l:statusline="%#SpySl# \ue779  "
        \ . "%#SpySlInv#"
        \ . "\ue0b0"
        \ . "%#LeftPrompt# "
        \ . '%{WebDevIconsGetFileTypeSymbol()} '
        \ . '%y '
        \ . '%t '
        \ . '%r'
        \ . "%#LeftPromptInv#"
        \ . "\ue0b0"
        \ . "%#GitPrompt#"
        \ . ' %{fugitive#statusline()} '
        \ . "%#GitPromptInv#"
        \ . "\ue0b0"
        \ . '%=%#RightPromptInv#'
        \ . "\ue0b2"
        \ . '%#RightPrompt#'
        \ . "  %20(%-9(\ue0a1%4l/%-4L%) "
        \ . "%5(\ue0a3 %-3c%) "
        \ . "%-4(%3p%%%)%) "
endfunction

function! statusline#get12HourTime() abort
  if exists("*strftime")
    return strftime("%H:%M")
  else
    return ''
  endif
endfunction
