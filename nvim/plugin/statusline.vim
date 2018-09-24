hi NerdtreeNC          guibg=#1e2127
hi NerdtreeEndOfBuffer guifg=bg

hi SilentStatusline    guifg=#A9B7C6 guibg=#2c323c
hi SpySl               guifg=#1e2127 guibg=#A9B7C6
hi LeftPrompt          guifg=#1e2127 guibg=#818E9C
hi GitPrompt           guifg=#1e2127 guibg=#657281
hi RightPrompt         guifg=#1e2127 guibg=#A9B7C6
hi SpySlInv            guifg=#A9B7C6 guibg=#818E9C
hi LeftPromptInv       guifg=#818E9C guibg=#657281
hi GitPromptInv        guifg=#657281 guibg=#2c323c
hi RightPromptInv      guifg=#A9B7C6 guibg=#2c323c

hi TabLine             guifg=#2B2B2B guibg=#A9B7C6
hi TabLineFill         guifg=#2B2B2B guibg=#1e2127
hi TabLineSel          guifg=#A9B7C6 guibg=#1e2127

hi TestGroup guifg=#0061ff guibg=#ff9d00

if has("autocmd")
  augroup statusline_autocmd
    autocmd!
    autocmd WinEnter,VimEnter,BufEnter * if s:ShouldOverrideStatusline() | call s:ShowFullStatusLine() | endif
    autocmd WinLeave * if s:ShouldOverrideStatusline() | call s:ShowDimStatusLine() | endif
  augroup END
endif

fun! s:ShouldOverrideStatusline()
  return index(['nerdtree'], &filetype) < 0
endf

function! s:ShowDimStatusLine() abort
  " TODO: Change this to a setlocal
  let &l:statusline="%#SilentStatusline#"
        \ . ' %{WebDevIconsGetFileTypeSymbol()}'
        \ . ' %t'
endfunction

function! s:ShowFullStatusLine() abort
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
