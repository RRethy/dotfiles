scriptencoding utf-8

let mapleader=' '

colorscheme schemer

call mkdir($HOME.'/.local/share/nvim/backup/', 'p')

let g:loaded_netrw = 1
let g:loaded_netrwPlugin = 1

call backpack#init()

nnoremap cl 0D
nnoremap Y y$
nmap     g5 :e %%
nnoremap ' `
nnoremap <A-l> 2zl
nnoremap <A-h> 2zh
nnoremap <silent> g8 :norm! *N<CR>
nnoremap <left> gT
nnoremap <right> gt
nnoremap <Backspace> <C-^>
nnoremap          g> :set nomore<bar>echo repeat("\n",&cmdheight)<bar>10messages<bar>set more<CR>
" nnoremap <silent> - :Ex<CR>
nnoremap          <C-s>     :<C-U>%s/\C\<<C-r><C-w>\>/
nnoremap <silent> <C-p>     :Files<CR>
nnoremap <silent> <leader>a :argadd %<CR>
nnoremap <silent> <leader>d :argdelete %<CR>
nnoremap <silent> <Leader>= :echo synIDattr(synID(line("."), col("."), 1), "name")<CR>
nnoremap <silent> <Leader>- :echo synIDattr(synIDtrans(synID(line("."), col("."), 1)), "name")<CR>
nnoremap <silent> <Leader>h :Helptags<CR>
nnoremap <silent> <Leader>n :nohls<CR>
nnoremap <silent> <Leader>* :lgrep <cword><CR>
nnoremap <silent> <leader>m :mks!<CR>
nnoremap <silent> <leader>r :redraw!<CR>
" execute the current line as a shell script and replace it with the output
nnoremap <silent> <leader>s :.!sh<CR>
nnoremap <expr> n 'Nn'[v:searchforward]
nnoremap <expr> N 'nN'[v:searchforward]

nnoremap <silent> <leader>t    :tabnew<CR>
nnoremap          <leader>1 1gt
nnoremap          <leader>2 2gt
nnoremap          <leader>3 3gt
nnoremap          <leader>4 4gt
nnoremap          <leader>5 5gt

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
cnoremap <expr> qq 'q!'

inoremap jk <Esc>
inoremap kj <Esc>
inoremap JK <Esc>
inoremap KJ <Esc>
inoremap Jk <Esc>
inoremap Kj <Esc>

tnoremap <Esc> <C-\><C-n>
tmap <expr> gt '<C-\><C-n>gt'

if isdirectory('/usr/local/opt/fzf')
    set runtimepath+=/usr/local/opt/fzf
endif

set inccommand=nosplit " Show substitute command live
set cursorline " Changes colour of row that cursor is on
set ignorecase " Need this on for smartcase to work
set smartcase " Match lowercase to all, but only match upper case to upper case
if has('vim_starting') " fixes bugs caused by vim-sourcerer
    set number " Show current line number on left
    set norelativenumber " Show relative line numbers on left for jk jumping
endif
set numberwidth=3 " Give the left bar of line numbers 4 cols to use
set updatetime=250 " I use this used for CursorHold autocmd for deoplete
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
set shortmess+=Ic " Don't show intro msg (vim-illuminate messes it up anyway)
set nostartofline " Don't move cursor for ctrl-(d,u,f,b) - unsure about this
" set sessionoptions+=resize " Remember lines/cols when saving a session
set backup
" set nobackup
" set nowritebackup
set backupdir=~/.local/share/nvim/backup
" set pastetoggle=<F2> " Toggle paste from insert mode. Prefer "+p
set lazyredraw " don't redraw when executing a macro
set grepprg=rg\ --smart-case\ --vimgrep\ $*
set grepformat=%f:%l:%c:%m
set cpoptions+=> " add newline when appending to registers
" set autowrite " auto write on :make and various other commands
set completeopt=menu " just use a pmenu to display completion
set nohlsearch " feels nicer off since used mainly for nav, yoh to toggle
set pumblend=10 " 10% transparency pmenu
set signcolumn=auto:3 " max 3 width sign column
set dictionary+=/usr/share/dict/words
set diffopt+=hiddenoff
set showtabline=2
set tabline=%!MakeTableLine()
set guicursor=a:block-Cursor " Show block cursor for these modes
set timeoutlen=250 " timeout used mainly for jk => <Esc>
set ttimeoutlen=-1
" set winblend=10 " transparency for floating windows
set equalalways
" set nowrapscan
set virtualedit=block

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

augroup term_autocmds
    autocmd!
    autocmd TermEnter * set nocursorline
    autocmd TermLeave * set cursorline
augroup END

augroup highlight_yank_autocmds
    autocmd!
    autocmd TextYankPost * silent! lua require'vim.highlight'.on_yank("Substitute", 200)
augroup END

" plugin settings {{{

" fzf settings
fun! FloatingFZF2()
    " let width = float2nr(&columns * 0.5)
    " let height = float2nr(&lines * 0.3)
    let width = &columns
    let height = &lines
    let opts = {
                \     'relative': 'editor',
                \     'row': (&lines - height) / 5,
                \     'col': (&columns - width) / 2,
                \     'width': width,
                \     'height': height,
                \     'style': 'minimal'
                \ }

    call nvim_open_win(nvim_create_buf(v:false, v:true), v:true, opts)
endf

let g:fzf_layout = { 'window': 'call FloatingFZF2()' }
" if has('autocmd')
"     augroup fzf
"         autocmd! FileType fzf
"         autocmd  FileType fzf set laststatus=0 noshowmode noruler nonu nornu
"                     \| autocmd BufLeave <buffer> set laststatus=2
"     augroup END
" endif
let g:fzf_history_dir = '~/.local/share/nvim/fzf-history'
let g:fzf_colors = {
            \ 'bg+': ['bg', 'Normal', 'Normal'],
            \ }

" Illuminate stuff
" let g:loaded_illuminate = 1
let g:Illuminate_ftblacklist = ['', 'qf', 'tex', 'fzf'] " TODO figure out why this doesn't work for my gt terminal
let g:Illuminate_ftHighlightGroups = {
            \ 'vim:blacklist': ['Statement', 'vimNotFunc', 'vimCommand', 'vimMapModKey'],
            \ 'ruby:blacklist': ['Statement', 'PreProc'],
            \ 'cpp:blacklist': ['cppSTLnamespace', 'Statement', 'Type'],
            \ 'go:blacklist': ['goVar', 'goComment', 'goRepeat', 'goConditional'],
            \ 'c:blacklist': ['Type', 'cRepeat'],
            \ 'rust:blacklist': ['Comment', 'rustConditional', 'rustKeyword']
            \ }
" augroup illuminate_augroup
"     autocmd!
"     autocmd VimEnter * hi illuminatedWord cterm=italic gui=italic | hi illuminatedCurWord cterm=bold gui=bold
" augroup END
" let g:Illuminate_insert_mode_highlight = 1

let g:netrw_banner = 0
let g:netrw_banner = 0
let g:netrw_banner = 0
let g:netrw_banner = 0

let g:Hexokinase_highlighters = ['foregroundfull']
" let g:Hexokinase_highlighters = ['backgroundfull']
" let g:Hexokinase_highlighters = [ 'background', 'backgroundfull', 'virtual']

let g:Hexokinase_optInPatterns = [
\     'full_hex',
\     'triple_hex',
\     'rgb',
\     'rgba',
\     'hsl',
\     'hsla',
\ ]

" let g:Hexokinase_refreshEvents = ['BufWrite', 'BufRead', 'TextChanged', 'InsertLeave']
" let g:Hexokinase_prioritizeHead = 0
" let g:Hexokinase_highlighters = ['sign_column']
" let g:Hexokinase_refreshEvents = ['TextChangedI', 'TextChanged']

" ALE settings
set omnifunc=ale#completion#OmniFunc
let g:ale_ruby_rubocop_executable = 'bundle'
let g:ale_lint_on_text_changed = 'never'
let g:ale_lint_on_enter = 0
let g:ale_lint_on_insert_leave = 0
let g:ale_fix_on_save = 1
let g:ale_completion_enabled = 0
let g:ale_disable_lsp = 0
let g:ale_set_loclist = 0
let g:ale_linters = {
            \     'rust': ['rls'],
            \     'go': ['gopls'],
            \     'dart': ['analysis_server'],
            \     'ruby': ['solargraph', 'rubocop'],
            \     'python': ['pyls'],
            \     'markdown': [],
            \ }
let g:ale_fixers = {
            \     'json': ['jq'],
            \     'rust': ['rustfmt'],
            \     'dart': ['dartfmt'],
            \     'go': ['gofmt'],
            \ }
nnoremap <silent> <c-]> :ALEGoToDefinition<CR>
nnoremap <silent> K :ALEHover<CR>

" vimtex settings
let g:tex_flavor = 'latex'
let g:vimtex_view_method = 'skim'
let g:vimtex_quickfix_mode = 0

let g:matchup_matchparen_status_offscreen = 0
let g:matchup_matchparen_deferred = 50

" lua << EOF
" local nvim_lsp = require'nvim_lsp'
" nvim_lsp.rls.setup {}
" EOF
" augroup rrethy_nvim_lsp_autocmds
"     autocmd!
"     autocmd Filetype rust setlocal omnifunc=v:lua.vim.lsp.omnifunc
"     autocmd BufWrite *.rs lua vim.lsp.buf.formatting()
" augroup END
" local nvim_lsp = require'nvim_lsp'
" local gopls_root_pattern = require'nvim_lsp/util'.root_pattern('go.mod', '.git')
" local abspath = vim.loop.fs_realpath
" local gopath = abspath(vim.env.GOPATH)
" local function find_go_project(bufpath)
"   -- Make it an absolute path.
"   bufpath = abspath(bufpath)
"   if vim.startswith(bufpath, gopath) then
"     return bufpath:match("(.*/go/src/[^/]+/[^/]+/[^/]+)")
"   end
" end

" require'nvim_lsp'.gopls.setup {
"   root_dir = function(bufpath, bufnr)
"     return gopls_root_pattern(bufpath) or find_go_project(bufpath)
"   end;
" }
"}}}

" statusline {{{
augroup statusline_autocmd
    autocmd!
    autocmd WinEnter,VimEnter,BufEnter * call s:fancy_active_statusline()
    autocmd WinLeave * call s:fancy_inactive_statusline()
augroup END

function! s:fancy_inactive_statusline() abort
    setlocal statusline=%#SpySlNC#
    setlocal statusline+=\ 
    setlocal statusline+=%n
    setlocal statusline+=\ 
    setlocal statusline+=%#SpySlInvNC#
    setlocal statusline+=
    setlocal statusline+=%#LeftPromptNC#
    setlocal statusline+=\ 
    setlocal statusline+=%y
    setlocal statusline+=\ 
    setlocal statusline+=%t
    setlocal statusline+=\ 
    setlocal statusline+=%r
    setlocal statusline+=%#LeftPromptInvNC#
    setlocal statusline+=
    setlocal statusline+=%=
    setlocal statusline+=%#RightPromptInvNC#
    setlocal statusline+=
    setlocal statusline+=%#RightPromptNC#
    setlocal statusline+=\ %20(%-9(%4l/%-4L%)\ %5(\ %-3c%)\ %-4(%3p%%%)%)
    setlocal statusline+=\ 
endfunction

fun! Ale_statusline_warnings() abort
    " echom "hello"
    " if !exists('*ale#statusline#Count')
    "     return ''
    " endif
    " echom "world"
    let warnings = ale#statusline#Count(bufnr('%')).warning
    return warnings == 0 ? '' : printf(' %d ', warnings)
    " return ''
endf

fun! Ale_statusline_errors() abort
    " if !exists('*ale#statusline#Count')
    "     return ''
    " endif
    let errors = ale#statusline#Count(bufnr('%')).error
    return errors == 0 ? '' : printf(' %d ', errors)
    " return ''
endf

fun! s:fancy_active_statusline() abort
    setlocal statusline=%#SpySl#
    setlocal statusline+=\ 
    setlocal statusline+=%n
    setlocal statusline+=\ 
    setlocal statusline+=%#SpySlInv#
    setlocal statusline+=
    setlocal statusline+=%#LeftPrompt#
    setlocal statusline+=\ 
    setlocal statusline+=%y
    setlocal statusline+=\ 
    setlocal statusline+=%t
    setlocal statusline+=\ 
    setlocal statusline+=%r
    setlocal statusline+=%#LeftPromptInv#
    setlocal statusline+=
    " setlocal statusline+=%#GitPrompt#
    " setlocal statusline+=\ 
    " setlocal statusline+=%{FugitiveStatusline()}
    " setlocal statusline+=\ 
    " setlocal statusline+=%{ObsessionStatus()}
    " setlocal statusline+=\ 
    " setlocal statusline+=%#GitPromptInv#
    " setlocal statusline+=
    setlocal statusline+=%#AlePromptErrors#
    setlocal statusline+=%{Ale_statusline_errors()}
    setlocal statusline+=%#AlePromptErrorsInv#
    setlocal statusline+=
    setlocal statusline+=%#AlePromptWarnings#
    setlocal statusline+=%{Ale_statusline_warnings()}
    setlocal statusline+=%#AlePromptWarningsInv#
    setlocal statusline+=
    setlocal statusline+=%=
    setlocal statusline+=%#RightPromptInv#
    setlocal statusline+=
    setlocal statusline+=%#RightPrompt#
    setlocal statusline+=\ %20(%-9(%4l/%-4L%)\ %5(\ %-3c%)\ %-4(%3p%%%)%)
    setlocal statusline+=\ 
endf
"}}}

" tabline {{{
let s:fugitive_statusline = ''
fun! s:fugitive_branch_wrapper() abort
    if !exists('*FugitiveStatusline')
        return ''
    endif

    let fugitive_statusline = FugitiveStatusline()
    if !empty(fugitive_statusline)
        let s:fugitive_statusline = fugitive_statusline
    endif
    return s:fugitive_statusline
endf

fun! MakeTableLine() abort
    let str = ''

    let lasttab = tabpagenr('$')
    let curtab = tabpagenr()
    " if lasttab != curtab
    for i in range(lasttab)
        if i + 1 == curtab
            let hl = '%#TabLineSel#'
            let hlinv = lasttab == i+1 ? '%#TabLineSelFillInv#' : '%#TabLineSelInv#'
        else
            let hl = '%#TabLine#'
            if i+1 == lasttab
                let hlinv = '%#TabLineFillInv#'
            elseif i+2 == curtab
                let hlinv = '%#TabLineInv#'
            else
                let hlinv = '%#TabLineNoOp#'
            endif
        endif

        let str .= hl
        let str .= '%'.(i+1).'T'
        let str .= '  '.(i+1).'  '
        let str .= hlinv
        let str .= ''
    endfor

    let str .= '%#TabLineFill#%T'
    " endif
    let str .= '%='
    let str .= ''
    let str .= '%#SpySl#'
    let str .= ' '
    let str .= s:fugitive_branch_wrapper() " bugged on empty files
    let str .= ' '

    return str
endf
" }}}

command! Delete exe 'silent !rm -f %' | bd!

command! -range=% ReverseLines call nvim_buf_set_lines(bufnr('%'), <line1>-1, <line2>, 1, reverse(nvim_buf_get_lines(bufnr('%'), <line1>-1, <line2>, 1)))

nnoremap <silent> yow :call <SID>togglewrapping()<CR>
fun! s:togglewrapping()
    if &wrap
        set nowrap
        set nolinebreak
        silent! nunmap j
        silent! nunmap k
    else
        set wrap
        set linebreak
        nnoremap j gj
        nnoremap k gk
    endif
endf

" TODO make this work with plugin files that have source guards on them
command! -bar WS write|source %
command! StripWhitespace  %s/\v\s+$//g
command! Yankfname let @* = expand('%:p')
fun! s:define_generic_command(cmd, executable) abort
    exe 'command! '.a:cmd
                \. " call jobstart('".a:executable."', {"
                \.     "'on_exit': function('s:generic_on_exit'),"
                \.     "'tag': '".a:executable."'"
                \. '})'
endf
call s:define_generic_command('RubyTags', 'ripper-tags -R --exclude=vendor')
call s:define_generic_command('Tags', 'ctags -R')
fun! s:generic_on_exit(id, data, event) abort dict
    echohl MoreMsg | echom self.tag.' finished with exit status: '.string(a:data) | echohl None
endf

" vim: foldmethod=marker foldlevel=1
