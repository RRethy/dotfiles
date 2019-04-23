" nnoremap <silent> / :call <SID>start_smart_highlight()<CR>

" fun! s:start_smart_highlight() abort
"   set hlsearch

"   augroup smarthighlight_autocmds
"     autocmd!
"     autocmd CmdlineLeave * if getcmdtype() ==# '/' | call <SID>watch_cursor_movement() | endif
"   augroup END

"   call feedkeys('/', 'n')
" endf

" fun! s:watch_cursor_movement() abort
" endf

" fun! s:tear_down() abort
" endf
