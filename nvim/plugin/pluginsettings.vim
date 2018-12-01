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
      \ 'vim': ['vimVar', 'vimString', 'vimLineComment',
      \         'vimFuncName', 'vimFunction', 'vimUserFunc', 'vimFunc'],
      \ 'cpp': ['', 'Function', 'Constant']
      \ }
let g:Illuminate_delay = 250
" hi illuminatedWord guibg=#28293a

let g:ale_c_gcc_executable='g++'
let g:ale_c_gcc_options='-std=c++14 -Wall -MMD -g'

" call neomake#configure#automake('nw', 1000)

nnoremap <Leader>* :Grepper -tool rg -cword -noprompt<CR>
nnoremap <leader>g :Grepper<cr>
let g:grepper = {}
let g:grepper.prompt_mapping_tool = '<leader>g'
let g:grepper.tools = ['rg', 'ag', 'grep', 'git']
runtime plugin/grepper.vim
let g:grepper.rg.grepprg .= ' --smart-case'

let g:netrw_banner = 0
