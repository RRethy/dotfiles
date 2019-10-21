fun! newbp#init() abort
    let s:pack_path = expand('~/.local/share/nvim/site/pack/backpack/')
    let s:manifest_path = expand('~/.config/nvim/packmanifest.vim')
    call mkdir(s:pack_path.'opt/', 'p')

    command! -nargs=+ Pack call s:pack(<args>)
    if filereadable(s:manifest_path)
        exe 'source '.s:manifest_path
    endif
    delcommand Pack

    command! -bang -nargs=+ PackAdd call s:pack_add(<f-args)
    command!                PackUpdate call s:pack_update()
    command!                PackEdit exe 'e '.s:manifest_path
    command!                SPackEdit exe 'vsplit '.s:manifest_path
endfun

fun! s:pack(...) abort
    let [url, plugin_name, author] = s:parse_repo(a:1)

    if empty(url)
        echohl Error | echom a:1.' is not a supported repo format' | echohl None
        return
    endif


endfun

fun! s:pack_add() abort
endfun

fun! s:pack_update() abort
endfun

fun! s:parse_repo(repo) abort
    let tag = '\(\[^ /]\+\)\/\(\[^ /]\+\)'
    let https_git_fmt = '\V\c\^https://github.com/'.tag.'.git\$'
    let https_fmt = '\V\c\^https://github.com/'.tag.'\$'
    let ssh_git_fmt = '\V\c\^git@github.com:'.tag.'.git\$'
    let author_name_fmt = '\V\c\^'.tag.'\$'

    if a:repo =~# https_git_fmt
        let url = a:repo
        let pat = https_git_fmt
    elseif a:repo =~# https_fmt
        let url = a:repo.'.git'
        let pat = https_fmt
    elseif a:repo =~# ssh_git_fmt
        let url = a:repo
        let pat = ssh_git_fmt
    elseif a:repo =~# author_name_fmt
        let url = printf('https://github.com/%s.git', a:repo)
        let pat = author_name_fmt
    else
        return ['', '', '']
    endif

    let author = substitute(a:repo, pat, '\1', '')
    let name = substitute(a:repo, pat, '\2', '')

    return [url, name, author]
endfun
