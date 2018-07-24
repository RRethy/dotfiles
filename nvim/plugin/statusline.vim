if has("autocmd")
  augroup statusline_autocmd
    autocmd!
    autocmd WinEnter,VimEnter,BufEnter * call s:ShowFullStatusLine()
    autocmd WinLeave * call s:ShowDimStatusLine()
  augroup END
endif

function! s:ShowDimStatusLine() abort
  " TODO: Change this to a setlocal
  let &l:statusline="%#SilentStatusline#"
        \ . ' %{WebDevIconsGetFileTypeSymbol()}'
        \ . ' %t'
endfunction

function! s:ShowFullStatusLine() abort
  " TODO: Change this to a setlocal
  let &l:statusline="%#SpySl# \uf21b  "
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
