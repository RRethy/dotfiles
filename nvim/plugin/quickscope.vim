" Vim plugin for searching without using default hls
" Last Change:	2018 Dec 28
" Maintainer:	Adam P. Regasz-Rethy  <rethy.spud@gmail.com>
" License:	This file is placed in the public domain.

if exists('g:loaded_quickscope') || !has('autocmd')
  finish
endif
let g:loaded_quickscope = 1

let s:save_cpo = &cpoptions
set cpoptions&vim

if mapcheck('s') ==# ''
  nnoremap <silent> s :call <SID>do_search(0)<CR>
endif

if mapcheck('S') ==# ''
  nnoremap <silent> S :call <SID>do_search(1)<CR>
endif

if mapcheck('<Tab>') ==# ''
  nnoremap <silent> <Tab> :call <SID>find_next_match(0)<CR>
endif

if mapcheck('<S-Tab>') ==# ''
  nnoremap <silent> <S-Tab> :call <SID>find_next_match(1)<CR>
endif

augroup quickscope_autocmds
  autocmd!
  autocmd CmdlineLeave * try | call matchdelete(s:hl_id) | catch /\v(E802|E803)/ | endtry
augroup END

let s:hl_id = 1815
let s:pattern = ''
let s:direction = 0 " 0 is forwards, 1 is backwards

fun! s:do_search(backwards) abort
  augroup quickscope_textwatcher
    autocmd!
    autocmd CmdlineChanged * call s:update_hl()
  augroup END
  let search = input('/')
  augroup quickscope_textwatcher
    autocmd!
  augroup END
  if search !=# ''
    let s:direction = a:backwards
    let s:pattern = search
    let flags = 'cs'
    if a:backwards
      let flags .= 'b'
    endif
    call search(s:pattern, flags)
  endif
endf

fun! s:update_hl() abort
  try
    call matchdelete(s:hl_id)
  catch /\v(E802|E803)/
  endtry

  let l:pattern = ''
  if !&magic
    let l:pattern .= '\M'
  endif
  if &ignorecase
    let l:pattern .= '\c'
  endif
  let l:cmdline = getcmdline()
  if l:cmdline !=# ''
    let l:pattern .= l:cmdline
    call matchadd('Search', l:pattern, 0, s:hl_id)
  endif
  redraw
endf

fun! s:find_next_match(reverse) abort
  if s:pattern !=# ''
    if a:reverse
      let backwards = !s:direction
    else
      let backwards = s:direction
    endif
    let flags = 's'
    if backwards
      let flags .= 'b'
    endif
    call search(s:pattern, flags)
  endif
endf

let &cpoptions = s:save_cpo
unlet s:save_cpo

" vim:set et foldlevel=1 sw=2 foldmethod=expr foldexpr=getline(v\:lnum)=~'^\"\ Section\:'?'>1'\:getline(v\:lnum)=~#'^fu'?'a1'\:getline(v\:lnum)=~#'^endf'?'s1'\:'=':
