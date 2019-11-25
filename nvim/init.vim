scriptencoding utf-8

let mapleader=' '

colorscheme schemer

call mkdir($HOME.'/.local/share/nvim/backup/', 'p')

call backpack#init()

command! -bar WS write|source %
command! StripWhitespace  %s/\v\s+$//g
command! Yankfname let @* = expand('%:p')
fun! s:define_generic_command(cmd, executable) abort
    exe 'command! '.a:cmd
                \. " call jobstart('".a:executable."', {"
                \.     "'on_exit': function('s:generic_on_exit'),"
                \.     "'tag': '".a:executable."'"
                \. "})"
endf
call s:define_generic_command('RubyTags', 'rtags -R --exclude=vendor')
call s:define_generic_command('Tags', 'ctags -R')
fun! s:generic_on_exit(id, data, event) abort dict
    echohl MoreMsg | echom self.tag.' finished with exit status: '.string(a:data) | echohl None
endf

nnoremap cl 0D
nnoremap Y y$
nnoremap g0 ^
nnoremap g4 $
nmap     g5 :e %%
nnoremap g6 ^
nnoremap <A-l> 2zl
nnoremap <A-h> 2zh
nnoremap <silent> g8 :norm! *N<CR>
nnoremap <left> gT
nnoremap <right> gt
nnoremap <silent> gt      :<C-u>call <SID>singleterm_toggle()<CR>
nnoremap <Backspace> <C-^>
nnoremap          g> :set nomore<bar>echo repeat("\n",&cmdheight)<bar>40messages<bar>set more<CR>
nnoremap <silent> - :Ex<CR>
nnoremap          <C-s>     :<C-U>%s/\C\<<C-r><C-w>\>/
nnoremap <silent> <C-p>     :Files<CR>
nnoremap <silent> <leader>a :argadd %<CR>
nnoremap <silent> <leader>d :argdelete %<CR>
nnoremap <silent> <Leader>= :echo synIDattr(synID(line("."), col("."), 1), "name")<CR>
nnoremap <silent> <Leader>- :echo synIDattr(synIDtrans(synID(line("."), col("."), 1)), "name")<CR>
nnoremap <silent> <Leader>h :Helptags<CR>
nnoremap <silent> <Leader>n :nohls<CR>
nnoremap <silent> <Leader>m :messages<CR>
nnoremap <silent> <Leader>' :call <SID>togglewrapping()<CR>
nnoremap <silent> <Leader>* :lgrep <cword><CR>
nnoremap <silent> <leader>m :mks!<CR>
nnoremap <silent> <leader>r :redraw!<CR>
nnoremap <silent> <leader>f :ALEFix<CR>

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
set omnifunc=ale#completion#OmniFunc
set guicursor=a:block-Cursor " Show block cursor for these modes
set timeoutlen=250 " timeout used mainly for jk => <Esc>
set ttimeoutlen=-1
" set winblend=10 " transparency for floating windows

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

" plugin settings {{{

" fzf settings
fun! FloatingFZF()
    let width = float2nr(&columns * 0.5)
    let height = float2nr(&lines * 0.3)
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

let g:fzf_layout = { 'window': 'call FloatingFZF()' }
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
let g:Illuminate_ftblacklist = ['', 'qf', 'tex']
let g:Illuminate_ftHighlightGroups = {
            \ 'vim:blacklist': ['vimLet', 'vimNotFunc', 'vimCommand', 'vimMap', 'vimMapModKey'],
            \ 'ruby:blacklist': ['Statement', 'PreProc'],
            \ 'cpp:blacklist': ['cType',  'cppSTLnamespace', 'Statement', 'Type'],
            \ 'go:blacklist': ['goVar', 'goComment', 'goRepeat']
            \ }

let g:netrw_banner = 0

let g:Hexokinase_highlighters = ['foregroundfull']
" let g:Hexokinase_highlighters = ['sign_column']
" let g:Hexokinase_refreshEvents = ['TextChangedI', 'TextChanged']

" ALE settings
let g:ale_ruby_rubocop_executable = 'bundle'
let g:ale_lint_on_text_changed = 'never'
let g:ale_lint_on_enter = 0
let g:ale_lint_on_insert_leave = 0
let g:ale_fix_on_save = 1
" let g:ale_completion_enabled = 1
" let g:ale_disable_lsp = 1
let g:ale_linters = {
            \     'go': ['gopls'],
            \     'rust': ['rls'],
            \     'ruby': ['solargraph', 'rubocop'],
            \ }
let g:ale_fixers = {
            \     'json': ['jq'],
            \     'go': ['gofmt'],
            \     'rust': ['rustfmt'],
            \ }
" nnoremap <silent> <leader>a :ALELint<CR>

let g:tex_flavor = 'latex'
let g:vimtex_view_method = 'skim'
let g:vimtex_quickfix_mode = 0

let g:matchup_matchparen_status_offscreen = 0
let g:matchup_matchparen_deferred = 50
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
    if !exists('*ale#statusline#Count')
        return ''
    endif
    let warnings = ale#statusline#Count(bufnr('%')).warning
    return warnings == 0 ? '' : printf(' %d ', warnings)
endf

fun! Ale_statusline_errors() abort
    if !exists('*ale#statusline#Count')
        return ''
    endif
    let errors = ale#statusline#Count(bufnr('%')).error
    return errors == 0 ? '' : printf(' %d ', errors)
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

" z[1-9] {{{
for i in range(11)
    exe 'nnoremap <silent> z' . i . ' :call <SID>centre_screen(' . i . ')<CR>'
endfor

fun! s:centre_screen(zone) abort
    let percentage = a:zone * 0.1
    let shift = float2nr(winheight(0) * percentage)
    exe 'normal! zt' . shift . ''
endf
"}}}

" clever tab {{{
fun! CleverTab()
    if getline('.')[:col('.') - 1] =~# '\v(^\s*|\s+.)$'
        return "\<Tab>"
    else
        return "\<C-N>"
    endif
endf

inoremap <silent> <Tab> <C-R>=CleverTab()<CR>
"}}}

" Delete {{{
command! Delete call s:delete()

fun! s:delete() abort
    silent !rm -f %
    silent bd!
endf
"}}}

" reverse line {{{
command! -range=% ReverseLines :<line1>,<line2>call s:reverse_lines()

fun! s:reverse_lines() range
    let i = 0
    let mid = (a:lastline - a:firstline) / 2 + a:firstline
    while (a:firstline + i) <= mid
        let higher_line = getline(a:firstline + i)
        call setline(a:firstline + i, getline(a:lastline - i))
        call setline(a:lastline - i, higher_line)
        let i += 1
    endwhile
endf
"}}}

" spotlight {{{
command! -bang -bar -nargs=? -complete=custom,s:complete_apps Spotlight call s:spotlight_search(<bang>0, <q-args>)

let s:list_apps_cmd = 'mdfind kind:app'

fun! s:spotlight_search(bg, app) abort
    let opener = {
                \ 'sink*': function('s:open_app'),
                \ 'bg': a:bg,
                \ 'window': 'call FloatingFZF()',
                \ }
    if empty(a:app)
        call fzf#run(extend({
                    \ 'prefix': '^.*$',
                    \ 'source': s:list_apps_cmd,
                    \ 'down': '30%'
                    \ }, opener))
    else
        call opener['sink*']([a:app])
    endif
endf

fun! s:open_app(app) abort dict
    let cmd = 'open '.(self.bg ? '-g ' : '').' -a '.shellescape(a:app[0])
    call system(cmd)
endf

fun! s:complete_apps(arglead, cmdline, cursorpos) abort
    return join(map(split(system(s:list_apps_cmd)), 'fnamemodify(v:val, ":t")'), "\n")
endf
"}}}

" terminal helpers {{{
" Toggle displaying a single terminal in a split
" This maintains a single interactive terminal, even between sessions
let s:singleterm_bufnr = -1
if s:singleterm_bufnr == -1
    " When starting from a session file try to use an available interactive
    " terminal instead of making a new one.
    " I naively look for any interactive zsh terminal
    for bufnr in nvim_list_bufs()
        let bufname = bufname(bufnr)
        if bufname =~# '\v\C^term.*/bin/zsh$'
            let s:singleterm_bufnr = bufnr
            break
        endif
    endfor
endif

fun! s:singleterm_toggle() abort
    if !s:try_to_close()
        call s:open()
    endif
endf

fun! s:open() abort
    let width = float2nr(&columns * 0.7)
    let height = float2nr(&lines * 0.6)
    let opts = {
                \     'relative': 'editor',
                \     'row': (&lines - height) / 5,
                \     'col': (&columns - width) / 2,
                \     'width': width,
                \     'height': height,
                \     'style': 'minimal'
                \ }
    call nvim_open_win(nvim_create_buf(v:false, v:true), v:true, opts)
    let opts.height -= 2
    let opts.width -= 4
    let opts.row += 1
    let opts.col += 2
    call nvim_open_win(nvim_create_buf(v:false, v:true), v:true, opts)
    if !bufexists(s:singleterm_bufnr)
        terminal
        let s:singleterm_bufnr = bufnr('%')
    endif
    exe 'b '.s:singleterm_bufnr
    " setlocal winhighlight=NormalFloat:Normal
    startinsert
endf

fun! s:try_to_close() abort
    if bufexists(s:singleterm_bufnr)
        let winids = win_findbuf(s:singleterm_bufnr)
        let curtabnr = tabpagenr()
        for winid in winids
            let [tabnr, winnr] = win_id2tabwin(winid)
            if curtabnr == tabnr
                close
                close
                return 1
            endif
        endfor
    endif
    return 0
endf
" }}}

" toggle wrapper{{{
fun! s:togglewrapping()
    if &wrap
        set nowrap
        set nolinebreak
        silent! nunmap j
        silent! nunmap k
    else
        set wrap
        set linebreak
        set nolist
        nnoremap j gj
        nnoremap k gk
    endif
endf
"}}}

" vim: foldmethod=marker foldlevel=1
