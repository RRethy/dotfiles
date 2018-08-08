let g:loaded_netrw = 1

" Trigger configuration
let g:UltiSnipsExpandTrigger="<tab>"
let g:UltiSnipsJumpForwardTrigger="<c-b>"
let g:UltiSnipsJumpBackwardTrigger="<c-z>"

" If you want :UltiSnipsEdit to split your window.
let g:UltiSnipsEditSplit="vertical"

" NERDTree
let NERDTreeAutoDeleteBuffer=0
let NERdTreeChDirMode=2
let NERDTreeShowLineNumbers=1
let NERDTreeStatusline=-1
let NERDTreeWinSize=30
let NERDTreeMinimalUI=1

" fzf stuff
let g:fzf_layout = { 'down': '~30%' }
if has("autocmd")
  augroup fzf
    autocmd! FileType fzf
    autocmd  FileType fzf set laststatus=0 noshowmode noruler
          \| autocmd BufLeave <buffer> set laststatus=2 showmode ruler
  augroup END
endif

" Illuminate stuff
let g:Illuminate_ftblacklist = ['nerdtree']
let g:Illuminate_delay = 250
let g:Illuminate_ftHighlightGroups = {
      \ 'vim': ['vimVar', 'vimString', 'vimLineComment',
      \         'vimFuncName', 'vimFunction', 'vimUserFunc', 'vimFunc']
      \ }
" hi illuminatedWord cterm=underline gui=underline
" let g:Illuminate_highlightUnderCursor = 0
