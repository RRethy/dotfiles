command! -bang -bar -nargs=? -complete=custom,s:complete_apps Spotlight call s:spotlight_search(<bang>0, <q-args>)

let s:list_apps_cmd = 'mdfind kind:app'

fun! s:spotlight_search(bg, app) abort
    let opener = {
                \ 'sink*': function('s:open_app'),
                \ 'bg': a:bg
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
