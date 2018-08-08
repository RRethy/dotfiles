if has("autocmd")
  augroup filetype_automcds
    autocmd!
    autocmd FileType vim setlocal foldmethod=marker
    autocmd FileType c,cpp,java setlocal commentstring=//\ %s " For vim commentary
  augroup END

  augroup dim_inactive_windows
    autocmd!
    autocmd WinLeave * setlocal nocursorline
    autocmd WinEnter,BufEnter * setlocal cursorline
  augroup END

  augroup highlight_trailing_whitespace
    autocmd!
    autocmd InsertEnter * match none
    autocmd InsertLeave,CursorHold * match Error /\v\s+$/
  augroup END
endif
