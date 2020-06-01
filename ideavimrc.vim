let mapleader=" "
let maplocalleader="\\"

set timeoutlen=250 ttimeoutlen=-1
set ic
set vim-surround
set nu
set rnu
set smartcase

inoremap jk <Esc>
inoremap kj <Esc>
inoremap JK <Esc>
inoremap KJ <Esc>
inoremap Jk <Esc>
inoremap Kj <Esc>

" nnoremap - "tddkP
" nnoremap _ "tddp
nnoremap cl 0dg_
nnoremap Y y$
" nnoremap z7 zz9<C-y>
nnoremap n nzz
nnoremap N Nzz
nnoremap <C-h> <C-w>h
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-l> <C-w>l
" nnoremap <Leader>q :q<CR>
" nnoremap <Leader>y :%y+<CR>
" nnoremap <Leader>u viwU
nnoremap <Leader>n :nohls<CR>
" nnoremap <Leader>o o<Esc>
" nnoremap <Leader>O O<Esc>

vnoremap <C-g> "*y
