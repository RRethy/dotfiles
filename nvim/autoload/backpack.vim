" list of: {
"            'git_url': String,
"            'name': String,
"            'dir': String,
"          }
let s:plugins = []

fun! backpack#init() abort
    let s:opt_path = expand('~/.local/share/nvim/site/pack/backpack/opt/')
    let s:manifest_path = expand('~/.config/nvim/packmanifest.vim')
    call mkdir(s:opt_path, 'p')

    echo s:opt_path
    command! -nargs=+ Pack call s:pack(<args>)
    if filereadable(s:manifest_path)
        exe 'source '.s:manifest_path
    endif
    delcommand Pack

    command! -bang -nargs=+ -complete=shellcmd
                \ PackAdd call s:pack_add(<f-args>)
    command! PackUpdate call s:pack_update()
    command! PackEdit exe 'vsplit '.s:manifest_path
endfun

fun! s:pack(...) abort
    if a:0 == 0
        return
    endif

    let [url, name, author] = s:parse_repo(a:1)
    if empty(url)
        call utils#errm(a:1.' is not a supported repo format')
        return
    endif

    let plugin = {
                \ 'git_url': url,
                \ 'name': name,
                \ 'dir': s:opt_path..name,
                \ }
    try
        exe 'packadd! '..name
        call add(s:plugins, plugin)
    catch /E919/
    endtry
endfun

fun! s:pack_add(repo) abort
    let [url, name, author] = s:parse_repo(a:repo)
    if empty(url)
        call utils#errm(a:repo..' is not a supported repo format')
        return
    endif

    if isdirectory(s:opt_path..name)
        call utils#infom(name..' already exists. Updating it.')
        call jobstart(printf('git pull origin master'), {
                    \ 'git_url': url,
                    \ 'name': name,
                    \ 'dir': s:opt_path..name,
                    \ 'cwd': s:opt_path..name,
                    \ 'tag': 'updating',
                    \ 'on_exit': function('s:on_exit'),
                    \ })
    else
        call utils#infom(name..'...installing...')
        call jobstart(printf('git clone %s', url), {
                    \ 'git_url': url,
                    \ 'name': name,
                    \ 'dir': s:opt_path..name,
                    \ 'cwd': s:opt_path,
                    \ 'tag': 'cloning',
                    \ 'on_exit': function('s:on_exit'),
                    \ })
    endif
    let line = printf('Pack ''%s/%s''', author, name)
    call s:edit_packmanifest({->append(line('$'), line)})
endfun

fun! s:pack_update() abort
    for plugin in s:plugins
        if isdirectory(plugin.dir)
            let cmd = 'git pull origin master'
            let tag = 'updating'
        else
            let cmd = 'git clone '..plugin.git_url
            let tag = 'cloning'
        endif
        call jobstart(cmd, {
                    \ 'git_url': plugin.git_url,
                    \ 'name': plugin.name,
                    \ 'dir': plugin.dir,
                    \ 'cwd': plugin.dir,
                    \ 'tag': tag,
                    \ 'on_exit': function('s:on_exit'),
                    \ })
    endfor
endfun

fun! s:on_exit(job_id, data, event) abort dict
    call s:echom(self.name, self.tag, a:data)
    if !a:data " job succeeded
        let docsdir = self.dir..'/doc/'
        if isdirectory(docsdir)
            exe 'helptags '..docsdir
        endif
        if !s:plugin_exists(self.name)
            call add(s:plugins, {
                        \ 'git_url': self.git_url,
                        \ 'name': self.name,
                        \ 'dir': self.dir,
                        \ })
            exe 'packadd '..self.name
        endif
    endif
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
endf

fun! s:echom(name, tag, exit_status) abort
   if !a:exit_status
      echohl MoreMsg
      let msg = 'finished successfully!'
   else
      echohl Error
      let msg = printf('finished unsuccessfully with exit status %s', a:exit_status)
   endif

   echom printf('[%s] - { %s } - %s', a:name, a:tag, msg)

   echohl None
endf

fun! s:plugin_exists(name) abort
   return s:index_of_plugin(a:name) != -1
endf

fun! s:get_plugin(name) abort
   let i = s:index_of_plugin(a:name)
   if i != -1
      return s:plugins[i]
   else
      return {}
   endif
endf

fun! s:index_of_plugin(name) abort
   let i = 0
   for plugin in s:plugins
      if a:name ==# plugin['name']
         return i
      endif
      let i += 1
   endfor
   return -1
endf

fun! s:edit_packmanifest(edit_func) abort
   let should_close = 0
   if !bufexists(bufname(s:manifest_path))
      let should_close = 1
      exe 'vsplit '.s:manifest_path
   endif
   let winnr = bufwinid(bufname(s:manifest_path))
   if winnr == -1
      vsplit
      exe 'b '.bufname(s:manifest_path)
   else
      call win_gotoid(winnr)
   endif
   call a:edit_func()
   %!sort|uniq
   write
   if should_close
      bw!
   endif
endf
