" list of: {
"            'git_url': String,
"            'name': String,
"            'dir': String,
"            'hook': String|Function
"          }
let s:plugins = []
let s:manifest_path = expand('~/.config/nvim/packmanifest.vim')

fun! backpack#init() abort
   if has('nvim')
      let s:plugs_path = expand('~/.local/share/nvim/site/pack/backpack/opt/')
   else
      let s:plugs_path = expand('~/.local/share/vim/site/pack/backpack/opt/')
   endif
   call mkdir(s:plugs_path, 'p')

   command! -nargs=+ Pack call s:pack(<args>)
   if filereadable(s:manifest_path)
      exe 'source '.s:manifest_path
   endif
   delcommand Pack

   command! -bang -nargs=+ PackAdd call s:pack_add(<bang>0, <f-args>)
   command! -nargs=+ -complete=custom,s:complete_pack_delete
            \ PackDelete call s:pack_delete(<f-args>)
   command! -nargs=+ -complete=custom,s:complete_pack_delete
            \ PackDo call s:pack_do(<f-args>)
   command! PackUpdate call s:pack_update()
   command! PackClean call s:pack_clean()
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
            \ 'dir': s:plugs_path.name
            \ }
   call extend(plugin, a:0 > 1 && type(a:2) == 4 ? a:2 : {})

   if !has_key(plugin, 'on') || empty(plugin['on'])
      try
         exe 'packadd '.name
      catch /E919/
      endtry
   else
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
   endif

   call jobstart(printf('git clone %s', url), {
            \ 'name': plugin_name,
            \ 'git_url': url,
            \ 'hook': cmd,
            \ 'should_load': !a:no_load,
            \ 'cwd': s:plugs_path,
            \ 'on_exit': function('s:on_pack_add_exit')
            \ })
   let line = "Pack '".author."/".plugin_name."'"
   if !empty(cmd)
      let line .= ", { 'hook': '".cmd."' }"
   endif
   if bufexists(bufname(s:manifest_path))
      exe bufnr(bufname(s:manifest_path)).'bufdo call append(line("$"), line)'
   else
      call writefile([line], s:manifest_path, 'a')
   endif
endf

fun! s:pack_delete(...) abort
   for plug in a:000
      silent exe '!rm -rf ~/.local/share/nvim/site/pack/backpack/opt/'.plug
      if bufexists(bufname(s:manifest_path))
         exe '%g/'.plug.'/d'
      else
         edit s:manifest_path
         exe '%g/'.plug.'/d'
         write
         bd
      endif
   endfor
endf

fun! s:pack_do(...) abort
   let [url, plugin_name, author] = s:parse_repo(a:1)
   let cmd = join(a:000[1:])

   if empty(url)
      echohl Error | echom a:1.' is not a supported repo format' | echohl None
      return
   endif

   if !isdirectory(s:plugs_path.plugin_name)
      echohl Error | echom plugin_name.' does not exist' | echohl None
   endif

   call jobstart(cmd, {
            \ 'name': plugin_name,
            \ 'cwd': s:plugs_path.plugin_name,
            \ 'on_exit': function('s:on_exit_generic')
            \ })
endf

fun! s:pack_update() abort
   for dir in split(glob('~/.local/share/nvim/site/pack/backpack/opt/*'))
      call jobstart('git pull', {
               \ 'name': fnamemodify(dir, ':t'),
               \ 'cwd': dir,
               \ 'on_exit': function('s:on_exit_generic')
               \ })
   endfor
endf

fun! s:pack_clean() abort
endf

" job callbacks

fun! s:on_pack_add_exit(job_id, data, event) abort dict
   if a:data
      echohl Error | echom '['.self['name'].'] finished cloning with exit status '.a:data | echohl None
   else
      let dir = self['cwd'].self['name']
      call add(s:plugins, {
               \ 'git_url': self['git_url'],
               \ 'name': self['name'],
               \ 'dir': dir,
               \ 'hook': self['hook']
               \ })
      exe 'helptags '.dir.'/doc/'
      if self['should_load'] && empty(self['hook'])
         echohl MoreMsg | echom '['.self['name'].'] finished cloning successfully!' | echohl None
         exe 'packadd '.self['name']
      elseif !empty(self['hook'])
         exe 'PackDo '.self['name'].' '.self['hook']
      endif
   endif
endf

" TODO add a key 'tag' to print additional info
fun! s:on_exit_generic(job_id, data, event) abort dict
   if a:data
      echohl Error | echom '['.self['name'].'] finished with exit status '.a:data | echohl None
   else
      echohl MoreMsg | echom '['.self['name'].'] finished successfully!' | echohl None
   endif
endf

" Utility functions

" plugin_tag is of the format 'author/plugin_name'
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

fun! s:complete_pack_delete(A,L,P) abort
   return join(map(split(glob('~/.local/share/nvim/site/pack/backpack/opt/*')), 'fnamemodify(v:val, ":t")'), "\n")
endf
