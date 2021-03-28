fun! FloatingFZF2()
    let width = float2nr(&columns * 0.7)
    let height = float2nr(&lines * 0.5)
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
let g:fzf_history_dir = '~/.local/share/nvim/fzf-history'
let g:fzf_colors = {
            \ 'bg+': ['bg', 'Normal', 'Normal'],
            \ }
command! -bang -nargs=? -complete=dir Files
    \ call fzf#vim#files(<q-args>, fzf#vim#with_preview({'options': ['--layout=reverse', '--info=inline']}), <bang>0)
