filetype plugin indent on
let mapleader=" "
let maplocalleader="\\"
colorscheme myonedark

" Make sure my shit exists{{{
call mkdir($HOME . '/.config/nvim/tmp/', 'p')
if empty($HOME . '~/.config/nvim/autoload/plug.vim')
  silent !curl -fLo ~/.vim/autoload/plug.vim --create-dirs
    \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
endif
" }}}

"Plugins{{{
"=============================================================================
"
"=================================[Plugins]===================================
"
"=============================================================================

call plug#begin('~/.local/share/nvim/mehplugins')
Plug '~/.config/nvim/mehplugins/indexor'
Plug '~/.config/nvim/mehplugins/illuminate'
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
Plug 'Shougo/deoplete.nvim', { 'do': ':UpdateRemotePlugins' }
Plug 'SirVer/ultisnips'
Plug 'honza/vim-snippets'
Plug 'christoomey/vim-tmux-navigator'
Plug 'udalov/kotlin-vim'
Plug 'justinmk/vim-syntax-extra'
Plug 'justinmk/vim-sneak'
Plug 'wincent/loupe'
call plug#end()

if has("autocmd")
  augroup plugin_autocmds
    autocmd!
    autocmd CursorHold * if vimrchelpers#shouldLoadDeoplete() | call deoplete#enable() | endif
  augroup END
endif

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

" Illuminate stuff
let g:Illuminate_ftblacklist = ['nerdtree']
let g:Illuminate_delay = 250
" let g:Illuminate_ftHighlightGroups = {
"       \ 'vim': ['vimVar', 'vimString', 'vimLineComment',
"       \         'vimFuncName', 'vimFunction', 'vimUserFunc', 'vimFunc']
"       \ }
" hi illuminatedWord cterm=underline gui=underline
" let g:Illuminate_highlightUnderCursor = 0

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
set matchpairs+=<:> " Add carrets to be matchpairs. TODO: Only for specific filetypes
set path+=** " Search recursively with find()
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
set whichwrap=<,>,[,] " Allow arrow keys (d+h/j/k/l) to scroll to next line
set cmdheight=1 " Leave here in case I want to change it from default (1) in future
set splitright " Vsplit new window to the right
set noshowmode " Don't show current mode in bottom
set title " Show filename in title of window
set noruler " Don't show line info bottom right since I have a custom statusline
" set nrformats= " Treat numbers as decimals for Ctrl-a/Ctrl-x
set showmatch " Jump cursor to '(' when inputting the closing ')'
set spelllang=en_ca " Spell language for Canadian English
" set undodir=$HOME/.config/nvim/undodo " Keep the undos here
" set undofile " Persist undo after file closes
" set undolevels=1000         " How many undos
" set undoreload=10000        " number of lines to save for undo
set shortmess+=c " Don't show annoying completion messages
" set grepprg=rg\ --vimgrep " Currently using Ag from fzf
set nostartofline " Don't move cursor for ctrl-(d,u,f,b) - unsure about this
set sessionoptions+=resize " Remember lines/cols when saving a session
set backup
set backupdir=~/.config/nvim/tmp " Where to store ~ backup files
set foldcolumn=1 " Bar on the left showing folds in the document
set pastetoggle=<F5> " Toggle paste from insert mode. Prefer "+p
"}}}

"Mappings{{{
"=============================================================================
"
"================================[Mappings]===================================
"
"=============================================================================
nnoremap cl 0D
nnoremap Y y$
nnoremap z7 zz9<C-y>
nnoremap ]b :bnext<CR>
nnoremap [b :bprev<CR>
nnoremap <F1> :!raco cover %<cr>
nnoremap <F4> :vs<CR><C-w>l:term<CR>
nnoremap <C-s> :%s/\<<C-r><C-w>\>/
" nnoremap <C-p> :Files<CR>
nnoremap <C-p> :find 
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
nnoremap <Leader>' :call utils#togglewrapping()<CR>
nnoremap <Leader>" :set nowrap<CR>
nnoremap <Leader>c :tabclose<CR>
nnoremap <Leader>- :call utils#pad(' ')<CR>
nnoremap <Leader>= :echo synIDattr(synIDtrans(synID(line("."), col("."), 1)), "name")<CR>

onoremap p i(
onoremap in( :<C-u>normal! f(vi(<CR>
onoremap A :<C-u>normal! ggVG<CR>

inoremap <C-\> O

vnoremap <C-g> "*ygv
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
