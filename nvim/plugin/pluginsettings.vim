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
    autocmd  FileType fzf set laststatus=0 noshowmode noruler nonu nornu
          \| autocmd BufLeave <buffer> set laststatus=2
  augroup END
endif
let g:fzf_history_dir = '~/.local/share/nvim/fzf-history'
let g:fzf_colors = {
      \ 'bg+':     ['bg', 'Normal', 'Normal'],
      \ }

" Illuminate stuff
let g:Illuminate_ftblacklist = ['nerdtree']
let g:Illuminate_delay = 250
