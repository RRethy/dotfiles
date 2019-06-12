" inoremap <expr> <c-x><c-k> fzf#vim#complete({
"       \ 'prefix': '^.*$',
"       \ 'source': 'find .'
"       \ })

" nnoremap gh :<C-u>call fzf#vim#complete({
"       \ 'prefix': '^.*$',
"       \ 'source': 'find .',
"       \ 'sink*': function('s:foo')
"       \ })

" command!      -bang -nargs=? -complete=dir Banana       call <SID>bar()


" fun! s:foo(arg) abort
"   echom string(a:arg)
" endf

" fun! s:spotlight_search(bg, app) abort
"     if empty(a:app)
"     else
"         call system()
"     endif
" endf

" command! -bang -bar -nargs=? Spotlight call s:spotlight_search(<bang>0, <q-args>)

" fun! s:bar() abort
" call fzf#run({
"       \ 'prefix': '^.*$',
"       \ 'source': 'mdfind kind:app',
"       \ 'sink*': function('s:foo')
"       \ })
" endf

" function! s:make_sentence(lines)
"   return substitute(join(a:lines), '^.', '\=toupper(submatch(0))', '').'.'
" endfunction

" inoremap <expr> <c-x><c-s> fzf#vim#complete({
"       \ 'source':  'cat /usr/share/dict/words',
"       \ 'reducer': function('<sid>make_sentence'),
"       \ 'options': '--multi --reverse --margin 15%,0',
"       \ 'left':    20})
