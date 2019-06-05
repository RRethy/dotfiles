" list of: {
"            'git_url': String,
"            'name': String,
"            'dir': String,
"            'hook': String|Function
"          }
let s:plugins = []

fun! backpack#init() abort
   if has('nvim')
      let s:plugs_path = expand('~/.local/share/nvim/site/pack/backpack/opt/')
      let s:manifest_path = expand('~/.config/nvim/packmanifest.vim')
   else
      let s:plugs_path = expand('~/.local/share/vim/site/pack/backpack/opt/')
      let s:manifest_path = expand('~/.vim/packmanifest.vim')
   endif
   call mkdir(s:plugs_path, 'p')

   command! -nargs=+ Pack call s:pack(<args>)
   if filereadable(s:manifest_path)
      exe 'source '.s:manifest_path
   endif
   delcommand Pack

   command! -bang -nargs=+ -complete=shellcmd
            \ PackAdd call s:pack_add(<bang>0, <f-args>)
   command! -nargs=+ -complete=custom,s:complete_plugin_names
            \ PackDelete call s:pack_delete(<f-args>)
   command! -nargs=+ -complete=custom,s:complete_plugin_names
            \ PackDo call s:pack_do(<f-args>)
   command! PackUpdate call s:pack_update()
   command! PackClean call s:pack_clean()
   command! PackEdit exe 'vsplit '.s:manifest_path
endf

fun! s:pack(...) abort
   let [url, name, author] = s:parse_repo(a:1)
   if empty(url)
      echohl Error | echom a:1.' is not a supported repo format' | echohl None
      return
   endif

   let plugin = {
            \ 'git_url': url,
            \ 'name': name,
            \ 'dir': s:plugs_path.name,
            \ 'hook': ''
            \ }
   call extend(plugin, a:0 > 1 && type(a:2) == 4 ? a:2 : {})

   if empty(get(plugin, 'on', '')) && !has_key(plugin, 'for')
      try
         exe 'packadd! '.name
      catch /E919/
      endtry
   endif

   if has_key(plugin, 'for')
      exe 'augroup '.plugin['name'].'_backpack_autocmds'
         autocmd!
         exe 'autocmd FileType '.plugin['for'].' packadd '.name
      augroup END
   endif

   if !empty(get(plugin, 'on', ''))
      call s:setup_lazy(name, plugin['on'])
   endif

   call add(s:plugins, plugin)
endf

fun! s:pack_add(no_load, ...) abort
   let [url, plugin_name, author] = s:parse_repo(a:1)
   let cmd = join(a:000[1:])

   if empty(url)
      echohl Error | echom a:1.' is not a supported repo format' | echohl None
      return
   endif

   if isdirectory(s:plugs_path.plugin_name)
      echohl Error | echom plugin_name.' already exists' | echohl None
      return
   endif

   call jobstart(printf('git clone %s', url), {
            \ 'name': plugin_name,
            \ 'git_url': url,
            \ 'hook': cmd,
            \ 'should_load': !a:no_load,
            \ 'cwd': s:plugs_path,
            \ 'tag': 'cloning',
            \ 'on_exit': function('s:on_exit_cb')
            \ })

   let line = printf('Pack ''%s/%s''', author, plugin_name)
   if !empty(cmd)
      let line .= printf(', { ''hook'': ''%s''}',
               \ substitute(cmd, "'", "''", 'g'))
   endif
   call s:edit_packmanifest({-> append(line('$'), line)})
endf

fun! s:pack_delete(...) abort
   for plug in a:000
      silent exe '!rm -rf ~/.local/share/nvim/site/pack/backpack/opt/'.plug
      call s:edit_packmanifest({->
               \ execute('%g/'.escape(plug, '/').'/d', 'silent!')})
      call remove(s:plugins, s:index_of_plugin(plug['name']))
   endfor
endf

fun! s:pack_do(...) abort
   let plugin = s:get_plugin(a:1)
   let cmd = join(a:000[1:])

   if empty(plugin)
      echohl Error | echom a:1.' is not a valid repo' | echohl None
      return
   endif

   if !isdirectory(plugin['dir'])
      echohl Error | echom plugin['name'].' does not exist' | echohl None
   endif

   call jobstart(cmd, {
            \ 'name': plugin['name'],
            \ 'cwd': plugin['dir'],
            \ 'should_load': 1,
            \ 'tag': cmd,
            \ 'on_exit': function('s:on_exit_cb')
            \ })
endf

fun! s:pack_update() abort
   for plugin in s:plugins
      if isdirectory(plugin['dir'])
         let cmd = 'git pull'
         let cwd = plugin['dir']
         let tag = 'updating'
      else
         let cmd = printf('git clone %s', plugin['git_url'])
         let cwd = s:plugs_path
         let tag = 'cloning'
      endif
      call jobstart(cmd, {
               \ 'name': fnamemodify(plugin['dir'], ':t'),
               \ 'cwd': cwd,
               \ 'hook': plugin['hook'],
               \ 'should_load': 1,
               \ 'tag': tag,
               \ 'on_exit': function('s:on_exit_cb')
               \ })
   endfor
endf

fun! s:pack_clean() abort
   let dirs = split(glob('~/.local/share/nvim/site/pack/backpack/opt/*'))
   let invalid_dirs = []
   for dir in dirs
      let name = fnamemodify(dir, ':t')
      if !s:plugin_exists(name)
         call add(invalid_dirs, name)
      endif
   endfor
   call call(function('s:pack_delete'), invalid_dirs)
endf

fun! s:on_exit_cb(job_id, data, event) abort dict
   call s:echom(self['name'], self['tag'], a:data)
   if !a:data
      let dir = self['cwd'].self['name']
      if !s:plugin_exists(self['name'])
         call add(s:plugins, {
                  \ 'git_url': self['git_url'],
                  \ 'name': self['name'],
                  \ 'dir': dir,
                  \ 'hook': get(self, 'hook', '')
                  \ })
         exe 'helptags '.dir.'/doc/'
      endif
      let hook = get(self, 'hook', '')
      if self['should_load'] && empty(hook)
         exe 'packadd '.self['name']
      elseif !empty(hook)
         call s:handle_hook({
                  \ 'hook': hook,
                  \ 'name': self['name'],
                  \ 'should_load': self['should_load'],
                  \ 'cwd': dir
                  \ })
      endif
   endif
endf

" info: {
"         'hook': String|Function,
"         'name': String,
"         'cwd': String,
"         'should_load': 0|1
"       }
fun! s:handle_hook(info) abort
   let Hook = a:info['hook']
   if type(Hook) == 2
      call Hook()
   elseif type(Hook) == 1
      call remove(a:info, 'hook')
      call jobstart(Hook, extend({
               \ 'tag': Hook,
               \ 'hook': '',
               \ 'should_load': 1,
               \ 'on_exit': function('s:on_exit_cb')
               \ }, a:info))
   endif
endf

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

fun! s:setup_lazy(plugin_name, cmd) abort
   exe 'command! -nargs=* -bang '.a:cmd
            \.' delcommand '.a:cmd
            \.' | packadd '.a:plugin_name
            \.' | '.a:cmd.'<bang> <args>'
endf

fun! s:complete_plugin_names(A,L,P) abort
   return join(map(split(glob('~/.local/share/nvim/site/pack/backpack/opt/*')), 'fnamemodify(v:val, ":t")'), "\n")
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
   %!uniq|sort
   write
   if should_close
      bw!
   endif
endf
