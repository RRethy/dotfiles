call sixpack#init()

" fzf stuff
let g:fzf_layout = { 'down': '~30%' }
if has('autocmd')
  augroup fzf
    autocmd! FileType fzf
    autocmd  FileType fzf set laststatus=0 noshowmode noruler nonu nornu
          \| autocmd BufLeave <buffer> set laststatus=2
  augroup END
endif
let g:fzf_history_dir = '~/.local/share/nvim/fzf-history'
let g:fzf_colors = {
      \ 'bg+': ['bg', 'Normal', 'Normal'],
      \ }

" Illuminate stuff
let g:Illuminate_ftblacklist = ['nerdtree', 'sixpack', '', 'qf']
let g:Illuminate_ftHighlightGroups = {
      \ 'cpp': ['', 'Function', 'Constant']
      \ }
let g:Illuminate_delay = 250
" hi illuminatedWord guibg=#28293a

call neomake#configure#automake('w')

let g:netrw_banner = 0

delc SixpackUpgrade
delc SixpackUninstall

command! PU PackUpdate

nnoremap <silent> <Leader>i :PackBrowse<CR>
