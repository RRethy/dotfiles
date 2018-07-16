filetype plugin indent on
let mapleader=" "
let maplocalleader="\\"
colorscheme myonedark

" Ensure tmp folder exists for vim to write backups to
call mkdir($HOME . "/.config/nvim/tmp/", "p")

"Plugins{{{
"=============================================================================
"
"=================================[Plugins]===================================
"
"=============================================================================

call plug#begin('~/.local/share/nvim/mehplugins')
Plug '~/.config/nvim/mehplugins/indexor'
Plug 'scrooloose/nerdtree', { 'on': 'NERDTreeToggle' }
Plug 'Xuyuanp/nerdtree-git-plugin', { 'on': 'NERDTreeToggle' }
Plug 'tpope/vim-fugitive'
Plug 'tpope/vim-repeat'
Plug 'tpope/vim-commentary'
Plug 'tpope/vim-surround'
Plug 'tpope/vim-eunuch'
Plug 'tpope/vim-unimpaired'
Plug '/usr/local/opt/fzf'
Plug 'junegunn/fzf.vim'
Plug 'junegunn/gv.vim'
Plug 'airblade/vim-gitgutter'
Plug 'ryanoasis/vim-devicons'
Plug 'haya14busa/incsearch.vim'
Plug 'Shougo/deoplete.nvim', { 'do': ':UpdateRemotePlugins' }
Plug 'Shougo/neco-vim'
Plug 'christoomey/vim-tmux-navigator'
Plug 'udalov/kotlin-vim'
Plug 'justinmk/vim-syntax-extra'
Plug 'justinmk/vim-sneak'
call plug#end()

if has("autocmd")
  augroup plugin_autocmds
    autocmd!
    " TODO: Fix this
    autocmd CursorHold * if vimrchelpers#shouldLoadDeoplete() | call deoplete#enable() "
  augroup END
endif

" Incearch stuff with very magic regex
map /  <Plug>(incsearch-forward)\v
map ?  <Plug>(incsearch-backward)\v
map g/ <Plug>(incsearch-stay)\v

" NERDTree
let NERDTreeAutoDeleteBuffer=0
let NERdTreeChDirMode=2
let NERDTreeShowLineNumbers=1
let NERDTreeStatusline=-1
let NERDTreeWinSize=40
let NERDTreeMinimalUI=1

" Deoplete stuff
let g:deoplete#enable_at_startup=0 " I enable this on CursorHold autocmd
let g:deoplete#enable_camel_case=1 " Match foB with FooBar not foobar
let g:deoplete#auto_complete_delay=250 " Delay 250 milliseconds

" fzf stuff
let g:fzf_layout = { 'down': '~30%' }
if has("autocmd")
  augroup fzf
    autocmd! FileType fzf
    autocmd  FileType fzf set laststatus=0 noshowmode noruler
          \| autocmd BufLeave <buffer> set laststatus=2 showmode ruler
  augroup END
endif

" vim sneak stuff
let g:sneak#label = 1

"}}}

"Set Region{{{
"=============================================================================
"
"===============================[Set Region]==================================
"
"=============================================================================
" This is supposed to help built-in term, but it doesn't work well
" Better to just use tmux
" TODO: Fix this
"if has('nvim')
"let $VISUAL = 'nvr -cc split --remote-wait'
"endif
set inccommand=split " Neovim specific feature
set cursorline " Changes colour of row that cursor is on
set formatoptions+=c " Don'e need 't' since I dim cols past 80
set hlsearch " Highlight search matches.
set incsearch " Show result as I type in search.
set ignorecase " Need this on for smartcase to work
set smartcase " Match lowercase to all, but only match upper case to upper case
set number " Show current line number on left
set relativenumber " Show relative line numbers on left for jk jumping
set relativenumber " Show relative line numbers on left for
set numberwidth=4 " Give the left bar of line numbers 4 cols to use
set wrapscan " Search wraps from bottom to top
set backspace=indent,eol,start " Backspace everything
set history=1000 " Keep large history of commands
set updatetime=250 " I use this used for CursorHold autocmd for deoplete
set noshowcmd " Don't show the current cmd in bottom right
set iskeyword+=- " Add hyphen to be a keyword, bad for racket and python
set hidden " Absolutely necessary. Allows hidden buffers
set matchpairs+=<:> " Add carrets to be matchpairs. TODO: Only for specific filetypes
set path+=** " Search recursively with find()
set nolist " Needed for listchars, kinda shit to have on always IMO, toggle w/ <Leader>l
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
set whichwrap=<,>,[,] " Allow arrow keys (d+h/j/k/l) to scroll to next line
set cmdheight=1 " Leave here in case I want to change it from default (1) in future
set conceallevel=0 " Show text normally. Don't hide concealled text
set splitright " Vsplit new window to the right
set noshowmode " Don't show current mode in bottom
set title " Show filename in title of window
set noruler
set nrformats= " Treat numbers as decimals for Ctrl-a/Ctrl-x
set showmatch " Maybe remove this, unsure. Jumps cursor when closing )
set spelllang=en_ca " Spell language for Canadian English
set nospell " Enable dynamically
" set undodir=$HOME/.config/nvim/undodo " Keep the undos here
" set undofile " Persist undo after file closes
" set undolevels=1000         " How many undos
" set undoreload=10000        " number of lines to save for undo
set shortmess+=c " Don't show annoying completion messages
" set grepprg=rg\ --vimgrep " Currently using Ag from fzf
set nostartofline " Don't move cursor for ctrl-(d,u,f,b) - unsure about this
set sessionoptions+=resize " Remember lines/cols when saving a session
set modeline " This can be a HUGE security risk
set backup
set backupdir=~/.config/nvim/tmp " Where to store ~ backup files
set foldcolumn=1 " Bar on the left showing folds in the document
set pastetoggle=<F5> " Toggle paste from insert mode. Prefer "+p
"}}}

"Custom Cursor{{{
"=============================================================================
"
"============================Custom Cursor====================================
"
"=============================================================================
" TODO: Throw into a plugin in case I choose to use again in the future
" Change colour of block cursor while in insert mode
" highlight Cursor guifg=#1e1e1e guibg=#a7a7a7
" highlight iCursor guifg=black guibg=white
" set guicursor=n-v-c:block-Cursor " Show block cursor for these modes
" set guicursor+=i:block-iCursor " Show block iCursor in insert mode
" set guicursor+=a:blinkon0 " Stop the blinking
"}}}

"Mappings{{{
"=============================================================================
"
"================================[Mappings]===================================
"
"=============================================================================
nnoremap cl 0dg_
nnoremap Y y$
nnoremap z7 zz9<C-y>
nnoremap ]b :bnext<CR>
nnoremap [b :bprev<CR>
nnoremap # <C-^>
nnoremap <F1> :!raco cover %<cr>
nnoremap <F4> :vs<CR><C-w>l:term<CR>
nnoremap <C-s> :%s/\<<C-r><C-w>\>/
nnoremap <C-p> :Files<CR>
nnoremap <C-q> <C-a>
nnoremap <C-n> :NERDTreeToggle<CR>
nnoremap <Leader>q :q<CR>
nnoremap <Leader>0 :q!<CR>
nnoremap <Leader>w :wq<CR>
nnoremap <Leader>b :Buffers<CR>
nnoremap <Leader>t :tabnew<CR>
nnoremap <Leader>y :4,$y+<CR>
nnoremap <Leader>h :Helptags<CR>
nnoremap <Leader>ev :vs $MYVIMRC<CR>
nnoremap <Leader>sv :source $MYVIMRC<CR>:nohls<CR>
nnoremap <Leader>u viwU
nnoremap <Leader>s :w<CR>
nnoremap <Leader>n :nohls<CR>
nnoremap <Leader>l :set list!<CR>
nnoremap <Leader>' :set wrap\|set linebreak<CR>
nnoremap <Leader>" :set nowrap<CR>
nnoremap <Leader>1 1gt
nnoremap <Leader>2 2gt
nnoremap <Leader>3 3gt
nnoremap <Leader>4 4gt
nnoremap <Leader>5 5gt
nnoremap <Leader>6 6gt
nnoremap <Leader>7 7gt
nnoremap <Leader>8 8gt
nnoremap <Leader>9 9gt
nnoremap <Leader>; :tablast<CR>
nnoremap <Leader>] gt
nnoremap <Leader>[ gT
nnoremap <Leader>c :tabclose<CR>

onoremap p i(
onoremap in( :<C-u>normal! f(vi(<CR>
onoremap A :<C-u>normal! ggVG<CR>

vnoremap <C-g> "*y
vnoremap <C-q> <C-a>
vnoremap <Leader>; :'<,'>norm A;<CR>

cnoremap <expr> %% getcmdtype() == ':' ? expand('%:h').'/' : '%%'

abbreviate @@ rethy.spud@gmail.com
"}}}

"Autocommands{{{
"=============================================================================
"
"==============================[Autocommands]=================================
"
"=============================================================================
if has("autocmd")
  augroup filetype_automcds
    autocmd!
    autocmd FileType vim setlocal foldmethod=marker
    autocmd FileType c,cpp,java setlocal commentstring=//\ %s " For vim commentary
    autocmd Filetype nerdtree setlocal winhighlight=NormalNC:NerdtreeNC
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
"}}}

" vim: foldlevel=1
