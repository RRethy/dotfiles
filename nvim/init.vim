scriptencoding utf-8

let mapleader=' '

colorscheme schemer

call mkdir($HOME.'/.local/share/nvim/backup/', 'p')

call backpack#init()

command! -bar WS w|so %
command! Yankfname let @* = expand('%:p')

nnoremap cl 0D
nnoremap Y y$
nnoremap g0 ^
nnoremap g4 $
nnoremap g6 ^
nnoremap <A-l> 2zl
nnoremap <A-h> 2zh
nnoremap <silent> g8 :norm! *N<CR>
nnoremap <left> gT
nnoremap <right> gt
nnoremap <Backspace> <C-^>
nnoremap <silent> g9  :call utils#pad(' ')<CR>
nnoremap          g> :set nomore<bar>echo repeat("\n",&cmdheight)<bar>40messages<bar>set more<CR>
nnoremap <silent> - :Ex<CR>
nnoremap <silent> <F3>      :<C-u>call singleterm#toggle()<CR>
nnoremap          <C-s>     :<C-U>%s/\C\<<C-r><C-w>\>/
nnoremap <silent> <C-p>     :Files<CR>
nnoremap <silent> <leader>a :argadd %<CR>
nnoremap <silent> <leader>d :argdelete %<CR>
nnoremap <silent> <Leader>= :echo synIDattr(synID(line("."), col("."), 1), "name")<CR>
nnoremap <silent> <Leader>- :echo synIDattr(synIDtrans(synID(line("."), col("."), 1)), "name")<CR>
nnoremap <silent> <Leader>h :Helptags<CR>
nnoremap <silent> <Leader>n :nohls<CR>
nnoremap <silent> <Leader>m :messages<CR>
nnoremap <silent> <Leader>' :call utils#togglewrapping()<CR>
nnoremap <silent> <Leader>* :grep <cword><CR>
nnoremap <silent> <leader>t :silent !ripper-tags -R --exclude=vendor<CR>
nnoremap <silent> <leader>m :mks!<CR>
nnoremap <silent> <leader>r :redraw!<CR>
nmap              <leader>e :e %%

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
nnoremap yoh :set hlsearch!<CR>
nnoremap yos :set spell!<CR>
nnoremap yob :set scrollbind!<CR>

nnoremap <C-l> <C-w>l
nnoremap <C-k> <C-w>k
nnoremap <C-j> <C-w>j
nnoremap <C-h> <C-w>h

onoremap A :<C-u>normal! ggVG<CR>

vnoremap <C-g> "*y

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

set inccommand=nosplit " Show substitute command live
set cursorline " Changes colour of row that cursor is on
set ignorecase " Need this on for smartcase to work
set smartcase " Match lowercase to all, but only match upper case to upper case
set number " Show current line number on left
set relativenumber " Show relative line numbers on left for jk jumping
set numberwidth=3 " Give the left bar of line numbers 4 cols to use
" set updatetime=250 " I use this used for CursorHold autocmd for deoplete
set noshowcmd " Don't show the current cmd in bottom right
set iskeyword+=- " Add hyphen to be a keyword, bad for racket and python
set hidden " Absolutely necessary. Allows hidden buffers
set nolist " Needed for listchars, kinda shit to have on always IMO, toggle with <Leader>l
set listchars=tab:-,eol:¬,extends:>,precedes:< " Just some niceties for set list
" set list
" set listchars=trail:\  " highlight trailing whitespace
set tabstop=4 " A tab is 4 spaces
set softtabstop=4 " Backspace 4 spaces at a time at start of line
set shiftround " Round shifts with << >> to shiftwidth
set shiftwidth=4 " Round shifts to multiples of 4 spaces
set expandtab " Spaces > tabs
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
set matchtime=5 " showmatch above operates for 50 millis
set spelllang=en_ca " Spell language for Canadian English
" set undofile " Persist undo after file closes
" set undolevels=1000         " How many undos
" set undoreload=10000        " number of lines to save for undo
" set shortmess+=cI " Don't show annoying completion messages
set shortmess+=I " Don't show intro msg (vim-illuminate messes it up anyway)
set nostartofline " Don't move cursor for ctrl-(d,u,f,b) - unsure about this
" set sessionoptions+=resize " Remember lines/cols when saving a session
set backup
set backupdir=~/.local/share/nvim/backup
set pastetoggle=<F2> " Toggle paste from insert mode. Prefer "+p
set lazyredraw " don't redraw when executing a macro
set grepprg=rg\ --smart-case\ --vimgrep\ \"$*\"
set grepformat=%f:%l:%c:%m
set cpoptions+=> " add newline when appending to registers
" set autowrite " auto write on :make and various other commands
set completeopt=menu " just use a pmenu to display completion
set nohlsearch " feels nicer off since used mainly for nav, yoh to toggle
set pumblend=10 " 10% transparency pmenu
set signcolumn=auto:3 " max 3 width sign column
set dictionary+=/usr/share/dict/words
set diffopt+=hiddenoff

if has('autocmd')
   augroup filetype_automcds
      autocmd!
      " autocmd FileType vim setlocal foldmethod=marker
      autocmd FileType c,cpp,java setlocal commentstring=//\ %s " For vim commentary
      " autocmd FileType asm setlocal commentstring=;\ %s " For vim commentary
   augroup END

   augroup hide_qf_cursor
      autocmd!
      autocmd WinLeave * if &ft !~# 'qf' | setlocal nocursorline | endif
      autocmd WinEnter,BufEnter * if &ft !~# 'qf' | setlocal cursorline | endif
   augroup END

   augroup hl_trailing_whitespace
       autocmd!
       autocmd BufNew,BufEnter * try | call matchdelete(1254) | catch /E80[23]/ | endtry | call matchadd('CursorLine', '\v\s+$', 1, 1254)
   augroup END
endif

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
let g:Illuminate_ftblacklist = ['', 'qf', 'tex', 'cfg']
let g:Illuminate_ftHighlightGroups = {
            \ 'vim:blacklist': ['vimLet', 'vimNotFunc', 'vimCommand', 'vimMap', 'vimVar'],
            \ 'ruby:blacklist': ['Statement', 'PreProc'],
            \ 'cpp:blacklist': ['cType',  'cppSTLnamespace', 'Statement', 'Type'],
            \ 'go:blacklist': ['goVar', 'goComment', 'goRepeat']
            \ }

let g:netrw_banner = 0

" let g:Hexokinase_virtualText = '██████'
let g:Hexokinase_highlighters = ['foregroundfull']
" let g:Hexokinase_optInPatterns = ['full_hex', 'triple_hex', 'rgb', 'rgba', 'hsl', 'hsla', 'colour_names']
" let g:Hexokinase_palettes = ['/Users/adam/go/src/github.com/rrethy/hexokinase/sample_palette.json']

let g:ale_lint_on_text_changed = 'never'
let g:ale_lint_on_enter = 0
let g:ale_lint_on_insert_leave = 0
let g:ale_disable_lsp = 1
let g:ale_fixers = {
            \     'ruby': [ 'rubocop' ],
            \     'json': [ 'jq' ]
            \ }
" nnoremap <silent> <leader>a :ALELint<CR>

let g:tex_flavor = 'latex'
let g:vimtex_view_method = 'skim'
let g:vimtex_quickfix_mode = 0

let g:matchup_matchparen_status_offscreen = 0
let g:matchup_matchparen_deferred = 50
