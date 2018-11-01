let mapleader=" "
let maplocalleader="\\"
colorscheme myonedark

call mkdir($HOME . '/.local/share/nvim/backup/', 'p')

fun! CleverTab()
  if (getline('.')[:col('.') - 1] =~# '\v(^\s*|\s+)$')
    return "\<Tab>"
  else
    return "\<C-N>"
  endif
endf

inoremap <silent> <Tab> <C-R>=CleverTab()<CR>

nnoremap cl 0D
nnoremap Y y$
nnoremap z7 zz9<C-y>
nnoremap z3 zz9<C-e>
nnoremap g4 $
nnoremap g6 ^
nnoremap g8 :norm! *N<CR>
nnoremap <silent> g9  :call utils#pad(' ')<CR>
nnoremap <silent> - :Ex<CR>
nnoremap <F1> :!raco cover %<cr>
nnoremap          <C-s>      :<C-U>%s/\<<C-r><C-w>\>//g<Left><Left>a<BS>
nnoremap <silent> <C-p>      :Files<CR>
nnoremap          <C-q>      <C-a>
nnoremap          <C-l>      <C-w>l
nnoremap          <C-k>      <C-w>k
nnoremap          <C-j>      <C-w>j
nnoremap          <C-h>      <C-w>h
nnoremap <silent> <leader>d  :Dash<CR>
nnoremap          <Leader>q  :q<CR>
nnoremap          <Leader>0  :q!<CR>
nnoremap          <Leader>w  :wq<CR>
nnoremap          <Leader>b  :Buffers<CR>
nnoremap          <Leader>h  :Helptags<CR>
nnoremap          <Leader>u  viwU
nnoremap          <Leader>s  :w<CR>
nnoremap <silent> <Leader>l  :set list!<CR>
nnoremap <silent> <Leader>m  :messages<CR>
nnoremap <silent> <Leader>'  :call utils#togglewrapping()<CR>
nnoremap          <Leader>c  :tabclose<CR>
nnoremap <silent> <Leader>=  :echo synIDattr(synIDtrans(synID(line("."), col("."), 1)), "name")<CR>
nnoremap <silent> <Leader>n  :nohls<CR>

onoremap A :<C-u>normal! ggVG<CR>

" inoremap <C-o> O

vnoremap <C-g> "*y
vnoremap <Leader>; :'<,'>norm A;<CR>

cnoremap <expr> %% getcmdtype() == ':' ? expand('%:h').'/' : '%%'
cnoremap <C-A> <Home>
cnoremap <C-E> <End>
cnoremap <C-N> <Down>
cnoremap <C-P> <Up>
cnoremap <expr> q1 'q!'

if isdirectory('/usr/local/opt/fzf')
  set runtimepath+=/usr/local/opt/fzf
endif

if exists('&inccommand')
  set inccommand=split " Neovim specific feature
endif
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
" set matchpairs+=<:> " Add carrets to be matchpairs. TODO: Only for specific filetypes
" set path+=** " Search recursively with find()
set nolist " Needed for listchars, kinda shit to have on always IMO, toggle with <Leader>l
set listchars=tab:-,eol:¬,extends:>,precedes:< " Just some niceties for set list
set tabstop=2 " A tab is 2 spaces
set softtabstop=2 " Backspace 2 spaces at a time at start of line
set shiftround " Round shifts with << >> to shiftwidth
set shiftwidth=2 " Round shifts to multiples of 2 spaces
set expandtab " Spaces > tabs
set nowrap " Don't wrap the text, it's annoying
set mouse=n " Mouse support is nice for resizing splits
set sidescroll=10 " Scroll horizontally when 10 cols from edge
set scrolloff=1 " Scroll vertically when 1 rows from edge
set whichwrap=[,] " Allow arrow keys (d+h/j/k/l) to scroll to next line
" set whichwrap=<,>,[,] " Allow arrow keys (d+h/j/k/l) to scroll to next line
set cmdheight=1 " Leave here in case I want to change it from default (1) in future
set splitright " Vsplit new window to the right
set noshowmode " Don't show current mode in bottom
set title " Show filename in title of window
set noruler " Don't show line info bottom right since I have a custom statusline
set showmatch " Jump cursor to '(' when inputting the closing ')'
set matchtime=5 " showmatch above operates for 5 millis
set spelllang=en_ca " Spell language for Canadian English
" set undofile " Persist undo after file closes
" set undolevels=1000         " How many undos
" set undoreload=10000        " number of lines to save for undo
set shortmess+=c " Don't show annoying completion messages
set nostartofline " Don't move cursor for ctrl-(d,u,f,b) - unsure about this
set sessionoptions+=resize " Remember lines/cols when saving a session
set backup
set backupdir=~/.local/share/nvim/backup
" set foldcolumn=1 " Bar on the left showing folds in the document
set pastetoggle=<F5> " Toggle paste from insert mode. Prefer "+p

if has("autocmd")
  augroup filetype_automcds
    autocmd!
    autocmd FileType vim setlocal foldmethod=marker
    autocmd FileType c,cpp,java setlocal commentstring=//\ %s " For vim commentary
  augroup END

  augroup dim_inactive_windows
    autocmd!
    autocmd WinLeave * setlocal nocursorline
    autocmd WinEnter,BufEnter * setlocal cursorline
  augroup END

  augroup highlight_trailing_whitespace
    autocmd!
    autocmd InsertEnter * match none
    autocmd InsertLeave,CursorHold * match Error /\v\s+$/
  augroup END
endif

" TODO Figure out what I want to do with this:
" vim:set et sw=2 foldmethod=expr foldexpr=getline(v\:lnum)=~'^\"\ Section\:'?'>1'\:getline(v\:lnum)=~#'^fu'?'a1'\:getline(v\:lnum)=~#'^endf'?'s1'\:'=':
