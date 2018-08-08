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
