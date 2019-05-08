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
let g:Illuminate_ftblacklist = ['', 'qf']
" let g:Illuminate_ftHighlightGroups = {
" 			\ 'cpp': ['', 'Function', 'Constant']
" 			\ }
" let g:Illuminate_delay = 250
" hi illuminatedWord guibg=#28293a

" call neomake#configure#automake('w')

let g:netrw_banner = 0

" let g:Hexokinase_virtualText = '██████'
" let g:Hexokinase_ftAutoload = []
" let g:Hexokinase_highlighters = ['sign_column']
let g:Hexokinase_optInPatterns = [
			\ 'full_hex',
         \ 'triple_hex',
			\ 'rgb',
			\ 'rgba'
			\ ]
" let g:Hexokinase_ftAutoload = ['css', 'sass']
" let g:Hexokinase_refreshEvents = []

" delc SixpackUpgrade
" delc SixpackUninstall

" command! PU PackUpdate

" nnoremap <silent> <Leader>i :PackBrowse<CR>

nnoremap <silent> <Leader><F2> :HexokinaseToggle<CR>

let g:ale_lint_on_text_changed = 'normal'
let g:ale_lint_on_insert_leave = 1

call backpack#init()
