function! statusline#showDimStatusLine() abort
  let &l:statusline="%#SilentStatusline#"
        \ . ' %{WebDevIconsGetFileTypeSymbol()}'
        \ . ' %t'
endfunction

function! statusline#showFullStatusLine() abort
  " Change this to a setlocal
  " Can't get bufferline working using set statusline
  " Comments don't work beside the lines due to VimL behaviour
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
