scriptencoding utf-8

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
            \ 'go:blacklist': ['goVar']
            \ }
" let g:Illuminate_ftHighlightGroups = {
" 			\ 'cpp': ['', 'Function', 'Constant']
" 			\ }
" let g:Illuminate_delay = 0
" hi illuminatedWord guibg=#28293a

" call neomake#configure#automake('w')

let g:netrw_banner = 0

let g:Hexokinase_virtualText = '██████'
" let g:Hexokinase_v2 = 0
let g:Hexokinase_highlighters = ['virtual']
" let g:Hexokinase_logging = 1
" let g:Hexokinase_ftAutoload = ['vim']
" let g:Hexokinase_palettes = [expand($HOME.'/go/src/github.com/rrethy/hexokinase/sample_palette.json')]
" let g:Hexokinase_ftDisabled = ['text']
" let g:Hexokinase_optOutPatterns = ['triple_hex', 'colour_names']
" let g:Hexokinase_optInPatterns = ['triple_hex', 'full_hex']
let g:Hexokinase_checkBoundary = 1
" let g:Hexokinase_optInPatterns = ['full_hex', 'rgb', 'rgba', 'hsl', 'hsla']
let g:Hexokinase_optInPatterns = ['full_hex', 'triple_hex', 'rgb', 'rgba', 'hsl', 'hsla', 'colour_names']
" #ffffff
" let g:Hexokinase_ftOptOutPatterns = {'text': 'full_hex'}
" let g:Hexokinase_ftOptInPatterns
" let g:Hexokinase_highlighters = ['backgroundfull']
" let g:Hexokinase_v2 = 0
			" \   'virtual',
			" \   'background',
			" \   'foreground',
			" \   'foregroundfull'
" let g:Hexokinase_optOutPatterns = 'hex'
" let g:Hexokinase_highlighters = ['']
" let g:Hexokinase_optInPatterns = [
" 			\ 'full_hex',
"          \ 'triple_hex',
" 			\ 'rgb',
" 			\ 'rgba'
" 			\ ]
" let g:Hexokinase_ftAutoload = ['css', 'sass']
" let g:Hexokinase_refreshEvents = []

" delc SixpackUpgrade
" delc SixpackUninstall

" command! PU PackUpdate

" nnoremap <silent> <Leader>i :PackBrowse<CR>

" nnoremap <silent> <Leader><F2> :HexokinaseToggle<CR>

let g:ale_lint_on_text_changed = 'never'
let g:ale_lint_on_enter = 0
let g:ale_lint_on_insert_leave = 0
let g:ale_disable_lsp = 1
" let g:ale_lint_on_save = 0
nnoremap <silent> <leader>a :ALELint<CR>

let g:tex_flavor = 'latex'
let g:vimtex_view_method = 'skim'
let g:vimtex_quickfix_mode = 0

let g:matchup_matchparen_status_offscreen = 0
let g:matchup_matchparen_deferred = 50

let g:rubycomplete_buffer_loading = 1
let g:rubycomplete_classes_in_global = 1
let g:rubycomplete_rails = 1
let g:rubycomplete_load_gemfile = 1
