scriptencoding utf-8

let mapleader=' '

call mkdir($HOME . '/.local/share/nvim/backup/', 'p')

command! -bar WS w|so %

nnoremap cl 0D
nnoremap Y y$
nnoremap g0 ^
nnoremap g4 $
nnoremap g6 ^
nnoremap g5 %
nnoremap <A-l> 2zl
nnoremap <A-h> 2zh
nnoremap <silent> g8 :norm! *N<CR>
nnoremap <Backspace> <C-^>
nnoremap <silent> g9  :call utils#pad(' ')<CR>
nnoremap <silent> - :Ex<CR>
nnoremap <silent> <F3>      :<C-u>call singleterm#toggle()<CR>
nnoremap          <C-s>     :<C-U>%s/\C\<<C-r><C-w>\>//g<Left><Left>
nnoremap <silent> <C-p>     :Files<CR>
" nnoremap <silent> <leader>d :Dash<CR>
nnoremap          <Leader>b :Buffers<CR>
nnoremap          <Leader>h :Helptags<CR>
" nnoremap <silent> <Leader>l :set list!<CR>
nnoremap <silent> <Leader>n :nohls<CR>
nnoremap <silent> <Leader>m :messages<CR>
nnoremap <silent> <Leader>' :call utils#togglewrapping()<CR>
nnoremap <silent> <Leader>= :echo synIDattr(synID(line("."), col("."), 1), "name")<CR>
" nnoremap <silent> <Leader>= :echo synIDattr(synIDtrans(synID(line("."), col("."), 1)), "name")<CR>
nnoremap <silent> <Leader>* :grep <cword><CR>

nnoremap <silent> [a :previous<CR>
nnoremap <silent> ]a :next<CR>
nnoremap <silent> [A :first<CR>
nnoremap <silent> ]A :last<CR>

nnoremap <silent> [b :bprevious<CR>
nnoremap <silent> ]b :bnext<CR>
nnoremap <silent> [B :bfirst<CR>
nnoremap <silent> ]B :blast<CR>

nnoremap <silent> [l :lprevious<CR>
nnoremap <silent> ]l :lnext<CR>
nnoremap <silent> [L :lfirst<CR>
nnoremap <silent> ]L :llast<CR>

nmap <silent> [w <Plug>(ale_previous)
nmap <silent> ]w <Plug>(ale_next)
nmap <silent> [W <Plug>(ale_first)
nmap <silent> ]W <Plug>(ale_last)

nnoremap <silent> [q :cprevious<CR>
nnoremap <silent> ]q :cnext<CR>
nnoremap <silent> [Q :cfirst<CR>
nnoremap <silent> ]Q :clast<CR>

nnoremap <silent> ]t :tnext<CR>
nnoremap <silent> [t :tprevious<CR>
nnoremap <silent> ]T :tlast<CR>
nnoremap <silent> [T :tfirst<CR>

nnoremap <silent> yon :set number!<CR>
nnoremap <silent> yor :set relativenumber!<CR>

nnoremap <silent> yos :set spell!<CR>
nnoremap <silent> [os :set spell<CR>
nnoremap <silent> ]os :set nospell<CR>

nnoremap <C-l> <C-w>l
nnoremap <C-k> <C-w>k
nnoremap <C-j> <C-w>j
nnoremap <C-h> <C-w>h

onoremap A :<C-u>normal! ggVG<CR>

vnoremap <C-g> "*y
vnoremap 4 $

cnoremap <expr> %% getcmdtype() == ':' ? expand('%:h').'/' : '%%'
cnoremap <C-A> <Home>
cnoremap <C-E> <End>
cnoremap <C-N> <Down>
cnoremap <C-P> <Up>
cnoremap <expr> qq 'q!'

tmap <expr> <F3> '<C-\><C-n><F3>'

if isdirectory('/usr/local/opt/fzf')
   set runtimepath+=/usr/local/opt/fzf
endif

set inccommand=split " Show substitute command live
set cursorline " Changes colour of row that cursor is on
set ignorecase " Need this on for smartcase to work
set smartcase " Match lowercase to all, but only match upper case to upper case
set number " Show current line number on left
set relativenumber " Show relative line numbers on left for jk jumping
set numberwidth=4 " Give the left bar of line numbers 4 cols to use
set updatetime=250 " I use this used for CursorHold autocmd for deoplete
set noshowcmd " Don't show the current cmd in bottom right
set iskeyword+=- " Add hyphen to be a keyword, bad for racket and python
set hidden " Absolutely necessary. Allows hidden buffers
set nolist " Needed for listchars, kinda shit to have on always IMO, toggle with <Leader>l
set listchars=tab:-,eol:¬,extends:>,precedes:< " Just some niceties for set list
set tabstop=3 " A tab is 3 spaces
set softtabstop=3 " Backspace 3 spaces at a time at start of line
set shiftround " Round shifts with << >> to shiftwidth
set shiftwidth=3 " Round shifts to multiples of 3 spaces
set noexpandtab " Spaces > tabs
set nowrap " Don't wrap the text, it's annoying
set mouse=a " Mouse support is nice for resizing splits
set sidescroll=10 " Scroll horizontally when 10 cols from edge
set scrolloff=1 " Scroll vertically when 1 rows from edge
set whichwrap=[,] " Allow arrow keys (d+h/j/k/l) to scroll to next line
set cmdheight=1 " Leave here in case I want to change it from default (1) in future
set splitright " Vsplit new window to the right
set noshowmode " Don't show current mode in bottom
set noruler " Don't show line info bottom right since I have a custom statusline
set showmatch " Jump cursor to '(' when inputting the closing ')'
set matchtime=5 " showmatch above operates for 5 millis
set spelllang=en_ca " Spell language for Canadian English
" set undofile " Persist undo after file closes
" set undolevels=1000         " How many undos
" set undoreload=10000        " number of lines to save for undo
" set shortmess+=cI " Don't show annoying completion messages
set shortmess+=I " Don't show annoying completion messages
set nostartofline " Don't move cursor for ctrl-(d,u,f,b) - unsure about this
set sessionoptions+=resize " Remember lines/cols when saving a session
set backup
set backupdir=~/.local/share/nvim/backup
set pastetoggle=<F2> " Toggle paste from insert mode. Prefer "+p
set lazyredraw
set grepprg=rg\ -H\ --no-heading\ --smart-case\ --vimgrep\ \"$*\"
set grepformat=%f:%l:%c:%m
set cpoptions+=>
set autowrite

if has('autocmd')
   augroup filetype_automcds
      autocmd!
      autocmd FileType vim setlocal foldmethod=marker
      autocmd FileType c,cpp,java setlocal commentstring=//\ %s " For vim commentary
      autocmd FileType asm setlocal commentstring=;\ %s " For vim commentary
   augroup END

   augroup dim_inactive_windows_autocmds
      autocmd!
      autocmd WinLeave * setlocal nocursorline
      autocmd WinEnter,BufEnter * setlocal cursorline
   augroup END
endif

" TODO Figure out what I want to do with this:
" vim:set et sw=3 foldmethod=expr foldexpr=getline(v\:lnum)=~'^\"\ Section\:'?'>1'\:getline(v\:lnum)=~#'^fu'?'a1'\:getline(v\:lnum)=~#'^endf'?'s1'\:'=':
