nnoremap cl 0D
nnoremap Y y$
nnoremap z7 zz9<C-y>
nnoremap ]b :bnext<CR>
nnoremap [b :bprev<CR>
nnoremap <F1> :!raco cover %<cr>
nnoremap <C-s> :%s/\<<C-r><C-w>\>/
nnoremap <silent> <C-p> :Files<CR>
nnoremap <C-q> <C-a>
nnoremap <silent> <C-n> :NERDTreeToggle<CR>
nnoremap <Leader>q :q<CR>
nnoremap <Leader>0 :q!<CR>
nnoremap <Leader>w :wq<CR>
nnoremap <Leader>b :Buffers<CR>
nnoremap <Leader>y :4,$y+<CR>
nnoremap <Leader>h :Helptags<CR>
nnoremap <Leader>ev :vs $MYVIMRC<CR>
nnoremap <Leader>sv :source $MYVIMRC<CR>:nohls<CR>
nnoremap <Leader>u viwU
nnoremap <Leader>s :w<CR>
nnoremap <Leader>l :set list!<CR>
nnoremap <silent> <Leader>' :call utils#togglewrapping()<CR>
nnoremap <Leader>" :set nowrap<CR>
nnoremap <Leader>c :tabclose<CR>
nnoremap <Leader>- :call utils#pad(' ')<CR>
nnoremap <silent> <Leader>= :echo synIDattr(synIDtrans(synID(line("."), col("."), 1)), "name")<CR>
nnoremap <silent> <Leader>n :nohls<CR>

nnoremap <C-l> <C-w>l
nnoremap <C-k> <C-w>k
nnoremap <C-j> <C-w>j
nnoremap <C-h> <C-w>h

onoremap p i(
onoremap in( :<C-u>normal! f(vi(<CR>
onoremap A :<C-u>normal! ggVG<CR>

inoremap <C-\> O

vnoremap <C-g> "*y
vnoremap <C-q> <C-a>
vnoremap <Leader>; :'<,'>norm A;<CR>

cnoremap <expr> %% getcmdtype() == ':' ? expand('%:h').'/' : '%%'
