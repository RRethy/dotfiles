scriptencoding utf-8

" Used to uninstall vim-sixpack
let s:scriptFilePath = resolve(expand('<sfile>:p'))

" sixpack#init([, {path}])
"   Initializes vim-sixpack
"   If {path} is given, vim-sixpack will use this dir as the packpath it will
"   manage
fun! sixpack#init(...) abort
  if !exists('&packpath')
    echoerr 'Please upgrade your (neo)vim to a version with package support'
    finish
  endif

  if !has('unix') && !has('macunix') && !has('win32unix')
    echoerr 'Sorry, currently only unix shells are supported'
    finish
  endif

  if a:0 == 0
    if has('nvim')
      let s:ppath = expand('~/.local/share/nvim/site')
    else
      let s:ppath = expand('~/.local/share/vim/site')
    endif
  elseif a:0 == 1
    if !s:is_valid_path(expand(a:1))
      echoerr 'Invalid path given to sixpack#init()'
      finish
    endif
    let s:ppath = expand(a:1)
  endif

  if index(split(&packpath, ','), s:ppath) < 0
    exe 'set packpath^=' . s:ppath
  endif

  let s:startpath = s:ppath . '/pack/sixpack/start'
  let s:optpath = s:ppath . '/pack/sixpack/opt'
  call mkdir(s:startpath, 'p')
  call mkdir(s:optpath, 'p')

  let g:SixpackLogginglevel = get(g:, 'SixpackLogginglevel', 2)

  command! -bar -nargs=+ PackAdd call s:add_start_plugin(<f-args>)
  command! -bar -nargs=+ PackAddOptional call s:add_opt_plugin(<f-args>)

  command! -bar -nargs=+ PackDo call s:pack_do(<args>)

  command! -bar -nargs=+ -complete=customlist,s:complete_pack_plugin_dirs
        \ PackRemove call s:remove_plugins(<f-args>)

  command! -bar -nargs=* -complete=customlist,s:complete_pack_plugin_dirs
        \ PackUpdate call s:update_plugins(<f-args>)

  command! -bar -nargs=+ -complete=customlist,s:complete_pack_start_dirs
        \ PackMakeOptional call s:make_plugin_opt(<f-args>)
  command! -bar -nargs=+ -complete=customlist,s:complete_pack_opt_dirs
        \ PackMakeStart call s:make_plugin_start(<f-args>)

  command! -bar -nargs=0 PackBrowse call s:open_browse()

  command! -bar -nargs=0 PackHelptags helptags ALL

  command! -bar -nargs=+ PackMetadata call s:add_pack_metadata(<args>)

  command! -bar -nargs=0 SixpackUpgrade call s:sixpack_upgrade()
  command! -bar -nargs=0 SixpackUninstall call s:sixpack_uninstall()

  command! -bar -nargs=? -complete=dir SixpackManifestGenerate call s:sixpack_generate_manifest(<f-args>)
  command! -bar -nargs=? -complete=file SixpackManifestRead call s:sixpack_read_manifest(<f-args>)
endf


" add_start_plugin({list})
"   Install all (valid) plugins in {list} to the start/ dir
fun! s:add_start_plugin(...) abort
  for plugin in a:000
    call s:add_plugin(plugin, s:startpath)
  endfor
endf


" add_opt_plugin({list})
"   Install all (valid) plugins in {list} to the opt/ dir
fun! s:add_opt_plugin(...) abort
  for plugin in a:000
    call s:add_plugin(plugin, s:optpath)
  endfor
endf


" remove_plugins({list})
"   Removes all (valid) plugins in {list} from either start/ OR opt/ dirs
fun! s:remove_plugins(...) abort
  for plugin in a:000
    if s:is_start_plugin(plugin)
      call s:remove_start_plugin(plugin)
    elseif s:is_opt_plugin(plugin)
      call s:remove_opt_plugin(plugin)
    else
      call s:echo_warn(plugin . ' does not seem to exist', 2)
    endif
  endfor
endf


" update_plugins({list})
"   Updates all (valid) plugins in {list} that reside in either start/ OR opt/ dirs
fun! s:update_plugins(...) abort
  if a:0 == 0
    call s:update_all_plugins()
  else
    for plugin in a:000
      if s:is_start_plugin(plugin)
        call s:update_start_plugin(plugin)
      elseif s:is_opt_plugin(plugin)
        call s:update_opt_plugin(plugin)
      else
        call s:echo_warn(plugin . ' does not seem to exists', 2)
      endif
    endfor
  endif
endf


" add_pack_metadata({name}, {dict})
"   Sets up the appropriate lazy loading code for the {name} plugin
"   If {dict} is provided with a key of 'on', the value will be used as the
"   command to trigger the loading of the opt plugin. Helptags will then be
"   generated and the plugin will be loaded.
fun! s:add_pack_metadata(...) abort
  if a:0 < 2
    call s:echo_warn('Please pass atleast 2 arguments to PackMetadata: A string and a dict.', 1)
  elseif type(a:1) != 1
    call s:echo_warn('Please pass a string as the first argument', 1)
  elseif type(a:2) != 4
    call s:echo_warn('Please pass a dict as the second argument to PackMetadata', 1)
  elseif !s:is_start_plugin(a:1) && !s:is_opt_plugin(a:1)
    call s:echo_warn('Please pass a valid plugin to PackMetadata', 1)
  else
    " Setup metadata for future use. Currently only important for 'do'
    let s:packMetadata = get(s:, 'packMetadata' ,{})
    let s:packMetadata[a:1] = a:2

    " Setup opt loading
    if has_key(a:2, 'on')
      let plugin = a:1
      let cmd_s = a:2['on']
      if type(cmd_s) == 1
        let cmdstr = cmd_s
        silent exe 'command! ' . cmdstr ' call s:on_opt_plugin_loaded('
              \ . string(plugin) . ', ' . string(cmdstr) . ')'
      elseif type(cmd_s) == 3
        let cmd_list = cmd_s
        for cmd in cmd_list
          silent exe 'command! ' . cmd ' call s:on_opt_plugin_loaded('
                \ . string(plugin) . ', ' . string(cmd) . ')'
        endfor
      else
        call s:echo_warn(cmd_s . " is not a valid value for 'on'")
      endif
    endif
  endif
endf


" pack_do({name}, {cmd})
"   Execute {cmd} in the dir of the plugin {name}
"   {cmd} can be a semi-colon seperated list of commands if multiple commands
"   should be executed
fun! s:pack_do(...) abort
  if a:0 < 2
    call s:echo_warn('Please pass atleast 2 arguments to PluginDo, a string {name} and a string {cmd}.', 1)
    return
  elseif type(a:1) != 1 || type(a:2) != 1
    call s:echo_warn('Please pass a string as the first and second argument', 1)
    return
  elseif s:is_start_plugin(a:1)
    let cmdlist = ['cd ' . s:startpath . '/' . a:1]
  elseif s:is_opt_plugin(a:1)
    let cmdlist = ['cd ' . s:optpath . '/' . a:1]
  else
    call s:echo_warn('Please pass a valid plugin to PluginDo', 1)
    return
  endif
  call add(cmdlist, a:2)

  call s:start_bg_with_echo_job(join(cmdlist, ' && '), a:1)
endf


" make_plugin_opt({name})
"   If {name} is a plugin in the start/ dir, then it gets moved to the opt/ dir
fun! s:make_plugin_opt(...) abort
  for plugin in a:000
    if s:is_start_plugin(plugin)
      silent exe '!mv ' s:startpath . '/' . plugin . ' ' . s:optpath
      call s:echo_msg('Successfully moved ' . plugin . ' to the opt/ dir', 1)
    elseif s:is_opt_plugin(plugin)
      call s:echo_warn(plugin . ' is already a optional plugin', 2)
    else
      call s:echo_warn(plugin . ' does not seem to exists', 1)
    endif
  endfor
endf


" make_plugin_start({name})
"   If {name} is a plugin in the opt/ dir, then it gets moved to the start/ dir
fun! s:make_plugin_start(...) abort
  for plugin in a:000
    if s:is_start_plugin(plugin)
      call s:echo_warn(plugin . ' is already a start plugin', 1)
    elseif s:is_opt_plugin(plugin)
      silent exe '!mv ' s:optpath . '/' . plugin . ' ' . s:startpath
      call s:echo_msg('Successfully moved ' . plugin . ' to the start/ dir', 1)
    else
      call s:echo_warn(plugin . ' does not seem to exists', 1)
    endif
  endfor
endf


" sixpack_upgrade()
"   Pulls the latest version of sixpack.vim from Github
"   If sixpack.vim was moved to another location, it will be replaced at the
"   location it was moved to, that way there will not be duplicate files
fun! s:sixpack_upgrade() abort
  let sixpackUrl = 'https://raw.githubusercontent.com/rrethy/vim-sixpack/master/autoload/sixpack.vim'

  silent exe '!curl -fLo ' . s:scriptFilePath . ' --create-dirs ' . sixpackUrl

  if v:shell_error != 0
    call s:echo_warn('An unexpected error occured, try checking your internet.', 1)
  else
    call s:echo_msg('Successfully updated vim-sixpack! Restart vim to see the changes take effect.', 1)
  endif
endf


" sixpack_uninstall()
"   Deletes the sixpack.vim file.
"   If sixpack.vim was moved to another location, it will be correctly removed at the
"   location it was moved to
fun! s:sixpack_uninstall() abort
  silent exe '!rm -f ' .  s:scriptFilePath

  if v:shell_error != 0
    call s:echo_warn('An unexpected error occured', 1)
  else
    call s:echo_msg('Successfully uninstalled vim-sixpack', 1)
  endif
endf


" This function is a mess
" The weird syntax with the `| let i += 1` is to make deleting and moving
" lines easier
"
" open_browse()
"   Creates/reuses a vim-sixpack buffer which lists all the plugins installed
"   Allows mappings to modify the plugins listed. These mappings are Remove
"   (r) and update (u) and they can be used in normal mode OR visual mode to
"   operate on a single plugin or a range of plugins.
"
"   TODO Add do (d) mapping to do a command in a specific plugins dir
fun! s:open_browse() abort
  if bufexists('vim-sixpack')
    norm! t
  else
    vertical topleft new vim-sixpack
  endif
  setl modifiable
  norm! gg"_dG
  let startdirs = glob(s:startpath . '/*', 1, 1)
  let optdirs = glob(s:optpath . '/*', 1, 1)
  let startBaseLen = strlen(s:startpath) + 1
  let optBaseLen = strlen(s:optpath) + 1
  call map(startdirs, "'* ' . v:val[startBaseLen:]")
  call map(optdirs, "'* ' . v:val[optBaseLen:]")
  let startDirLen = len(startdirs)
  let optDirLen = len(optdirs)
  let i = 0
  call append(i, 'Plugin Info: Total(' . string(optDirLen + startDirLen)
        \. ') Start(' . string(startDirLen)
        \. ') Opt(' . string(optDirLen) . ')')                                               | let i += 1
  call append(i, '')                                                                         | let i += 1
  call append(i, '============================================================')             | let i += 1
  call append(i, '========================= Commands =========================')             | let i += 1
  call append(i, '============================================================')             | let i += 1
  call append(i, '[r] Remove Plugin(s)  |  [u] Update Plugin(s)')                            | let i += 1
  call append(i, '')                                                                         | let i += 1
  call cursor(i, 1)


  if startDirLen > 0
    call append(i, '============================================================')           | let i += 1
    call append(i, '====================== Start Plugins =======================')           | let i += 1
    call append(i, '============================================================')           | let i += 1
    call append(i, startdirs)
    let i += len(startdirs)
  endif

  if optDirLen > 0
    call append(i, '')                                                                       | let i += 1
    call append(i, '============================================================')           | let i += 1
    call append(i, '===================== Optional Plugins =====================')           | let i += 1
    call append(i, '============================================================')           | let i += 1
    call append(i, optdirs)
    let i += len(optdirs)
  endif

  if optDirLen + startDirLen == 0
    call append(i, 'Oops :(, nothings seems to be here ¯\_(ツ)_/¯')                          | let i += 1
  endif

  setlocal buftype=nofile
        \ bufhidden=wipe
        \ nobuflisted
        \ nolist
        \ noswapfile
        \ nowrap
        \ cursorline
        \ noma
        \ nospell
  norm! 65|
  setf sixpack

  call s:browse__setup_syntax_hi()

  nnoremap <silent> <buffer> r :call <SID>validate_line_and_do(
        \ function('<SID>browse__remove_plugin'))<CR>
  nnoremap <silent> <buffer> u :call <SID>validate_line_and_do(
        \ function('<SID>browse__update_plugin'))<CR>

  xnoremap <silent> <buffer> r :call <SID>validate_line_and_do(
        \ function('<SID>browse__multi_remove_plugin',
        \ [line("'>") - line("'<") + 1]))<CR>
  xnoremap <silent> <buffer> u :call <SID>validate_line_and_do(
        \ function('<SID>browse__update_plugin'))<CR>

  " Undocumented browse mappings
  nnoremap <silent> <buffer> a :PluginAdd 
  nnoremap <silent> <buffer> i :echom 'nope'<CR>
endf


" sixpack_generate_manifest([, {dir}])
"   Generates a `.packmanifest` file either in {dir}, ~/.vim/, or
"   ~/.config/nvim/.
"   This .packmanifest file lists information about the plugins installed
"   which enables vim-sixpack to be portable
fun! s:sixpack_generate_manifest(...) abort
  if a:0 == 0
    if has('nvim')
      let manifestFileName = expand('~/.config/nvim/.packmanifest')
      call mkdir(expand('~/.config/nvim/'), 'p')
    else
      let manifestFileName = expand('~/.vim/.packmanifest')
      call mkdir(expand('~/.vim/'), 'p')
    endif
  elseif s:is_valid_path(a:1)
    let mpath = expand(a:1)
    if mpath[len(mpath) - 1] !=# '/'
      let mpath .= '/'
    endif
    let manifestFileName = mpath . '.packmanifest'
    call mkdir(expand(a:1), 'p')
  else
    echoerr 'Error: Invalid file path'
    return
  endif

  let startPluginsMetadata = glob(s:startpath . '/*', 1, 1)
  let optPluginsMetadata = glob(s:optpath . '/*', 1, 1)
  let startBaseLen = strlen(s:startpath) + 1
  let optBaseLen = strlen(s:optpath) + 1
  call map(startPluginsMetadata, "'start ' . s:get_remote_url(v:val)")
  call map(optPluginsMetadata, "'opt ' . s:get_remote_url(v:val)")

  silent exe '!touch ' . manifestFileName

  let manifest = extend(startPluginsMetadata, optPluginsMetadata)

  let result = writefile(manifest, manifestFileName)

  if result == 0
    call s:echo_msg('Successfully generated manifest at: ' . manifestFileName, 2)
  else
    call s:echo_warn('An unexpected error occurred. Unable to generate a plugin manifest', 1)
  endif
endf


" sixpack_read_manifest([, {file}])
"   Reads a `.packmanifest` file specified by {file}. If {file is not
"   specificed then vim-sixpack will look in ~/.vim/ OR ~/.config/nvim/.
"   This .packmanifest file lists information about the plugins installed
"   which enables vim-sixpack to be portable
fun! s:sixpack_read_manifest(...) abort
  if a:0 == 0
    if has('nvim')
      let manifestFileName = expand('~/.config/nvim/.packmanifest')
    else
      let manifestFileName = expand('~/.vim/.packmanifest')
    endif
  else
    let manifestFileName = expand(a:1)
    if manifestFileName !~? '\v(\/[^\/]+)+\/\.packmanifest'
      echoerr 'Error: Invalid manifest file'
      return
    endif
  endif

  if !filereadable(manifestFileName)
    echoerr 'Error: Unable to find a manifest, please provide a valid manifest manually to :SixpackManifestRead'
    return
  endif

  let manifest = readfile(manifestFileName)

  for plugin in manifest
    let parts = split(plugin)

    if len(parts) != 2
      call s:echo_warn('Encountered malformed plugin in manifest: ' . plugin, 2)
      continue
    endif

    if parts[0] ==? 'opt'
      call s:add_plugin(parts[1], s:optpath)
    elseif parts[0] ==? 'start'
      call s:add_plugin(parts[1], s:startpath)
    else
      call s:echo_warn('Encountered malformed plugin in manifest (first part): ' . plugin, 2)
      continue
    endif
  endfor

  call s:echo_msg('Finished reading ' . manifestFileName . '. Reload vim to use the installed plugins', 1)
endf

" Command function cores {{{

" opt plugin loader {{{

" on_opt_plugin_loaded({name}, {Command})
"   Setups a plugin in the opt/ dir to be lazy loaded easily. vim-sixpack
"   will have already defined optCmd and this will get triggered when it gets
"   called. The command will be deleted to avoid conflicts with the plugins
"   definition of the command, then plugin will be loaded, and the plugins
"   definition of the command will be triggered. Helptags should have already
"   been generated for the plugin and will also be loaded with the `packadd`
"   command
fun! s:on_opt_plugin_loaded(plugin, optCmd) abort
  let cmd_s = s:packMetadata[a:plugin]['on']
  if type(cmd_s) == 3
    for cmd in cmd_s
      silent exe 'delcommand! ' . cmd
    endfor
  endif
  silent exe 'delcommand! ' . a:optCmd
  silent exe 'packadd ' . a:plugin
  exe a:optCmd
endf

" }}}

" plugin updaters {{{

fun! s:update_all_plugins() abort
  call s:update_all_start_plugins()
  call s:update_all_opt_plugins()
endf


fun! s:update_all_opt_plugins() abort
  let optdirs = glob(s:optpath . '/*', 1, 1)
  for plugin in optdirs
    call s:update_dir(plugin)
  endfor
endf


fun! s:update_all_start_plugins() abort
  let startdirs = glob(s:startpath . '/*', 1, 1)
  for plugin in startdirs
    call s:update_dir(plugin)
  endfor
endf


fun! s:update_start_plugin(plugin) abort
  let pluginDir = s:startpath . '/' . a:plugin
  call s:update_dir(pluginDir)
endf


fun! s:update_opt_plugin(plugin) abort
  let pluginDir = s:optpath . '/' . a:plugin
  call s:update_dir(pluginDir)
endf


" update_dir({dir})
"   {dir} will be validated that it is both a dir AND it is tracked by git.
"   {dir} will be pulled from origin.
"   If {dir} has a update hook defined by PackMetadata, the hook will be
"   executed.
fun! s:update_dir(dir) abort
  if isdirectory(a:dir) && isdirectory(a:dir . '/.git')
    let cmdlist = ['cd ' . a:dir]
    let plugin_name = substitute(a:dir, '\v.*\/([^ \/]+)$', '\1', '')
    call add(cmdlist, 'git pull origin master')
    if exists('s:packMetadata')
          \ && has_key(s:packMetadata, plugin_name)
          \ && has_key(s:packMetadata[plugin_name], 'do')
      let do_cmd = s:packMetadata[plugin_name]['do']
      if type(do_cmd) == 1
        if len(do_cmd) > 0 && do_cmd[0] ==# ':'
          exe do_cmd
        else
          call add(cmdlist, do_cmd)
        endif
      elseif type(do_cmd) == 2
        call do_cmd()
      endif
    endif

    call s:start_bg_update_job(join(cmdlist, ' && '), plugin_name)
  endif
endf

" }}}

" plugin removers {{{

fun! s:remove_start_plugin(plugin) abort
  silent exe '!rm -rf ' . s:startpath . '/' . a:plugin

  if v:shell_error == 0
    call s:echo_msg('Successfully removed ' . a:plugin, 1)
  else
    call s:echo_warn('Failed to remove ' . a:plugin, 1)
  endif
endf


fun! s:remove_opt_plugin(plugin) abort
  silent exe '!rm -rf ' . s:optpath . '/' . a:plugin

  if v:shell_error == 0
    call s:echo_msg('Successfully removed ' . a:plugin, 1)
  else
    call s:echo_warn('Failed to remove ' . a:plugin, 1)
  endif
endf

" }}}

" plugin adders {{{

" add_plugin({name}, {dir})
"   {name} can take the following forms:
"
"     {author}/{repo name}          tpope/vim-unimpaired
"     {Github url}                  https://github.com/tpope/vim-unimpaired
"     {Github url ending in .git}   https://github.com/tpope/vim-unimpaired.git
"     {Github ssh url}              git@github.com:tpope/vim-unimpaired.git
"
"   {name} will be checked if it already existts
"   {dir} must be either s:startpath OR s:optparth
"   Helptags will be generated for the plugin.
"   The git clone will always be a shallow clone.
fun! s:add_plugin(plugin, dir) abort
  if s:is_valid_url_format(a:plugin)
    let pluginUrl = a:plugin . '.git'
    let pluginSuffix = substitute(a:plugin,
          \ '\vhttps:\/\/github\.com\/[^ \/]+\/([^ \/]+)$',
          \ '\1',
          \ '')
  elseif s:is_valid_repo_format(a:plugin)
    let pluginUrl = 'https://github.com/' . a:plugin . '.git'
    let pluginSuffix = split(a:plugin, '/')[1]
  elseif s:is_valid_dot_git_url_format(a:plugin)
    let pluginUrl = a:plugin
    let pluginSuffix = substitute(a:plugin,
          \ '\vhttps:\/\/github\.com\/[^ \/]+\/([^ \/]+)\.git$',
          \ '\1',
          \ '')
  elseif s:is_valid_dot_git_at_format(a:plugin)
    let pluginUrl = a:plugin
    let pluginSuffix = substitute(a:plugin,
          \ '\v^git\@github\.com:[^ \/]+\/([^ \/]+)\.git$',
          \ '\1',
          \ '')
  else
    call s:echo_warn('Invalid plugin format. Please use the following format: {github author}/{github repo}', 1)
    return 0
  endif

  if s:is_start_plugin(pluginSuffix)
    call s:echo_warn('{' . pluginSuffix . '} already exists as a start plugin. Try updating it with :PluginUpdate ' . pluginSuffix, 2)
    return 0
  elseif s:is_opt_plugin(pluginSuffix)
    call s:echo_warn('{' . pluginSuffix . '} already exists as an optional plugin. Try updating it with :PluginUpdate ' . pluginSuffix, 2)
    return 0
  endif

  let cmdlist = ['cd ' . a:dir]
  call add(cmdlist, 'git clone --depth 1 ' . pluginUrl)

  call s:start_bg_with_echo_job(join(cmdlist, ' && '), pluginSuffix)
endf


fun! s:source_plugin(plugin) abort
  return
  if s:is_start_plugin(a:plugin)
    let dir = s:startpath . '/' . a:plugin
  else
    return
  endif

  exe 'set rtp+=' . dir

  let plugin_files = glob(dir . '/plugin/**/*.vim', 1, 1)
  let after_plugin_files = glob(dir . '/after/plugin/**/*.vim', 1, 1)
  for source_file in extend(plugin_files, after_plugin_files)
    exe 'source ' . escape(source_file, ' ')
  endfor
endf

" }}}

" manifest utils {{{

" get_remote_url({dir})
"   Requires: {dir} to be a valid git repo
"   Returns: Remote origin url of {dir}
"
"   split()[0] is used since system() returns an ^@ at the end of the command,
"   this will strip the ^@.
fun! s:get_remote_url(absGitPath) abort
  return split(system('(cd ' . a:absGitPath . '; git config --get remote.origin.url)'))[0]
endf

" }}}

" }}}

" Browse functions {{{

" All of the functions inside this fold should only be called inside a sixpack ft

" validate_line_and_do({func})
"   {func} is a function that takes in the name of a plugin
"   Validates that the current line has a plugin on it, then executes {func}
"   passing it the name plugin on the current line
fun! <SID>validate_line_and_do(funcRef) abort
  if &filetype !=# 'sixpack'
    return
  endif
  if getline('.') =~? '\v\*\s%([^ ]+)%(| .*)$'
    let pluginName = substitute(getline('.'), '\v\*\s([^ ]+)%(| .*)$', '\1', '')
    call a:funcRef(pluginName)
  endif
endf


" browse__remove_plugin({name})
"   Removes the plugin and updates the sixpack file
fun! <SID>browse__remove_plugin(plugin) abort
  call s:remove_plugins(a:plugin)
  setl modifiable
  norm! "_dd
  setl nomodifiable
endf


" browse__multi_remove_plugin({name})
"   Removes the plugin {name} and bumps the plugins removed count.
"   This will be called for each line. The global variable is to
"   remove the lines containing the now removed plugins after complete
"   execution. No lines will be removed if highlighting more than just plugins.
fun! <SID>browse__multi_remove_plugin(count, plugin) abort
  call s:remove_plugins(a:plugin)
  let s:pluginRemovalCount = get(s:, 'pluginRemovalCount', 1)

  if s:pluginRemovalCount == a:count
    setl modifiable
    silent exe line("'<") . ',' . line("'>") . 'd _'
    setl nomodifiable
    unlet s:pluginRemovalCount
  else
    let s:pluginRemovalCount += 1
  endif
endf


" browse__update_plugin({name})
"   Updates the plugin {name}. This may seem useless... and it is, but it may
"   change in the future.
fun! <SID>browse__update_plugin(plugin) abort
  call s:update_plugins(a:plugin)
endf


" browse__setup_syntax_hi()
"   Sets up very basic syntax highlighting for browse mode
fun! s:browse__setup_syntax_hi() abort
  if has('syntax') && exists('g:syntax_on')
    syntax clear

    syntax match sixpackBigTitle /^=\+\s.*\s=\+$/
    hi def link sixpackBigTitle Operator

    syntax match sixpackSep /^=\+$/
    hi def link sixpackSep Operator

    syntax match sixpackListIndex /\*/ nextgroup=sixpackPluginName skipwhite
    hi def link sixpackListIndex Repeat

    syntax match sixpackPluginName /[^ ]\+/ contained
    hi def link sixpackPluginName Title

    syntax match sixpackSoftTitle /Plugin Info:/ nextgroup=sixpackPluginCount skipwhite
    hi def link sixpackSoftTitle PreCondit

    syntax match sixpackPluginCount /(\zs\d\+\ze)/
    hi def link sixpackPluginCount Bold

    syntax match sixpackCommand /\[[ru]\]/
    hi def link sixpackCommand Type

    syntax match sixpackCommandName /\(Remove\sPlugin(s)\|Update\sPlugin(s)\)/
    hi def link sixpackCommandName Special
  endif
endf

" }}}

" Helpers {{{

" Completion sources {{{

fun! s:complete_pack_plugin_dirs(A, CL, CP) abort
  return extend(s:complete_pack_start_dirs(a:A, a:CL, a:CP),
        \ s:complete_pack_opt_dirs(a:A, a:CL, a:CP))
endf


fun! s:complete_pack_start_dirs(A, CL, CP) abort
  let startdirs = glob(s:startpath . '/*', 1, 1)
  let startBaseLen = strlen(s:startpath) + 1
  return map(startdirs, 'v:val[startBaseLen:]')
endf


fun! s:complete_pack_opt_dirs(A, CL, CP) abort
  let optdirs = glob(s:optpath . '/*', 1, 1)
  let optBaseLen = strlen(s:optpath) + 1
  return map(optdirs, 'v:val[optBaseLen:]')
endf

" }}}

" is_valid_path({path})
"   Returns true if the provided path is a valid directory path
"   Otherwise, returns false
"   Note: {path} does not necessarily exists
fun! s:is_valid_path(path) abort
  return type(a:path) == 1 && expand(a:path) =~? '\v(\/[^\/]+)+'
endf


" is_valid_repo_format({str})
"   Returns true if {str} is a github repo in the form {author}/{repo name}
"   Otherwise, returns false
fun! s:is_valid_repo_format(ghRepo) abort
  return a:ghRepo =~? '\v^[^ \/]+\/[^ \/]+$' 
        \ && !s:is_valid_dot_git_at_format(a:ghRepo)
endf


" is_valid_url_format({str})
"   Returns true if {str} is a valid github url
"   Otherwise, returns false
fun! s:is_valid_url_format(ghUrl) abort
  return a:ghUrl =~? '\v^https:\/\/github\.com\/[^ \/]+\/[^ \/]+$'
        \ && !s:is_valid_dot_git_url_format(a:ghUrl)
endf


" is_valid_dot_git_url_format({str})
"   Returns true if {str} is a valid github url ending in .git
"   Otherwise, returns false
fun! s:is_valid_dot_git_url_format(dotGitUrl) abort
  return a:dotGitUrl =~? '\v^https:\/\/github\.com\/[^ \/]+\/[^ \/]+\.git$'
endf


" is_valid_dot_git_at_format({str])
"   Returns true if {str} is a valid github ssh link ending in .git
"   Otherwise, returns false
fun! s:is_valid_dot_git_at_format(dotGitUrl) abort
  return a:dotGitUrl =~? '\v^git\@github\.com:[^ \/]+\/[^ \/]+\.git$'
endf


" is_start_plugin({name})
"   Returns true if {name} is a plugin in the start/ dir
"   Otherwise, returns false
fun! s:is_start_plugin(plugin) abort
  return isdirectory(s:startpath . '/' . a:plugin)
endf


" is_opt_plugin({name})
"   Returns true if {name} is a plugin in the opt/ dir
"   Otherwise, returns false
fun! s:is_opt_plugin(plugin) abort
  return isdirectory(s:optpath . '/' . a:plugin)
endf


" generate_helptags({dir})
"   Checks is dir has a doc/ dir, if it does then the helptags get generated
fun! s:generate_helptags(pluginDir) abort
  if isdirectory(a:pluginDir . '/doc/')
    silent exe 'helptags ' . a:pluginDir . '/doc/'
  endif
endf


fun! s:echo_warn(msg, msglevel) abort
  echohl WarningMsg
  call s:echo_msg(a:msg, a:msglevel)
  echohl NONE
endf


fun! s:echo_msg(msg, msglevel) abort
  if g:SixpackLogginglevel >= a:msglevel
    echom a:msg
  endif
endf

fun! s:strip_whitespace(str) abort
  return substitute(a:str, '\V\%(\^ \*\| \*\$\)', '', 'g')
endf
" }}}

" async handlers {{{

let s:update_cb = {}

fun! s:update_cb.on_stdout(job_id, data, event) abort
  if a:data[0] ==# ''
    return
  endif

  if &filetype ==# 'sixpack'
    setl modifiable
    silent exe '%substitute!\V\C\^* '
          \ . escape(self.plugname, '/\?')
          \ . '\%(\| \.\*\)\$'
          \ . '!* ' . escape(self.plugname, '/\?')
          \ . ' ' . escape(s:strip_whitespace(join(a:data)), '/') . '!e'
    call histdel('search', -1)
    norm! ``
    setl nomodifiable
  else
    call s:echo_msg(self.plugname . ': ' . join(a:data), 1)
  endif
endf


fun! s:update_cb.on_stderr(job_id, data, event) abort
  if a:data[0] ==# ''
    return
  endif

  if &filetype ==# 'sixpack'
    setl modifiable
    silent exe '%substitute!\V\C\^* '
          \ . escape(self.plugname, '/\?')
          \ . '\%(\| \.\*\)\$'
          \ . '!* ' . escape(self.plugname, '/\?')
          \ . ' ' . escape(s:strip_whitespace(join(a:data)), '/') . '!e'
    call histdel('search', -1)
    norm! ``
    setl nomodifiable
  else
    call s:echo_msg(self.plugname . ': ' . join(a:data), 1)
  endif
endf


fun! s:update_cb.on_exit(job_id, data, event) abort
  if s:is_start_plugin(self.plugname)
    let path = s:startpath
  elseif s:is_opt_plugin(self.plugname)
    let path = s:optpath
  else
    return
  endif
  call s:generate_helptags(path . '/' . self.plugname)
endf


let s:add_cb = {}

fun! s:add_cb.on_stdout(job_id, data, event) abort
  if a:data[0] ==# ''
    return
  endif

  call s:echo_msg(self.plugname . ': ' . join(a:data), 1)
endf


fun! s:add_cb.on_stderr(job_id, data, event) abort
  if a:data[0] ==# ''
    return
  endif

  call s:echo_msg(self.plugname . ': ' . join(a:data), 1)
endf


fun! s:add_cb.on_exit(job_id, data, event) abort
  call s:source_plugin(self.plugname)

  if s:is_start_plugin(self.plugname)
    let path = s:startpath
  elseif s:is_opt_plugin(self.plugname)
    let path = s:optpath
  else
    return
  endif
  call s:generate_helptags(path . '/' . self.plugname)
endf


fun! s:start_bg_update_job(cmd, plugin_name)
  call s:async_job_start(a:cmd, extend({'plugname': a:plugin_name}, s:update_cb))
endf


fun! s:start_bg_with_echo_job(cmd, plugin_name)
  call s:async_job_start(a:cmd, extend({'plugname': a:plugin_name}, s:add_cb))
endf

" }}}

" async.vim - see: https://github.com/prabirshrestha/async.vim {{{

let s:jobidseq = 0
let s:jobs = {} " { job, opts, type: 'vimjob|nvimjob'}
let s:job_type_nvimjob = 'nvimjob'
let s:job_type_vimjob = 'vimjob'
let s:job_error_unsupported_job_type = -2 " unsupported job type

function! s:job_supported_types() abort
  let l:supported_types = []
  if has('nvim')
    let l:supported_types += [s:job_type_nvimjob]
  endif
  if !has('nvim') && has('job') && has('channel') && has('lambda')
    let l:supported_types += [s:job_type_vimjob]
  endif
  return l:supported_types
endfunction

function! s:job_supports_type(type) abort
  return index(s:job_supported_types(), a:type) >= 0
endfunction

function! s:out_cb(jobid, opts, job, data) abort
  if has_key(a:opts, 'on_stdout')
    call a:opts.on_stdout(a:jobid, split(a:data, "\n", 1), 'stdout')
  endif
endfunction

function! s:err_cb(jobid, opts, job, data) abort
  if has_key(a:opts, 'on_stderr')
    call a:opts.on_stderr(a:jobid, split(a:data, "\n", 1), 'stderr')
  endif
endfunction

function! s:exit_cb(jobid, opts, job, status) abort
  if has_key(a:opts, 'on_exit')
    call a:opts.on_exit(a:jobid, a:status, 'exit')
  endif
  if has_key(s:jobs, a:jobid)
    call remove(s:jobs, a:jobid)
  endif
endfunction

function! s:on_stdout(jobid, data, event) abort
  if has_key(s:jobs, a:jobid)
    let l:jobinfo = s:jobs[a:jobid]
    if has_key(l:jobinfo.opts, 'on_stdout')
      call l:jobinfo.opts.on_stdout(a:jobid, a:data, a:event)
    endif
  endif
endfunction

function! s:on_stderr(jobid, data, event) abort
  if has_key(s:jobs, a:jobid)
    let l:jobinfo = s:jobs[a:jobid]
    if has_key(l:jobinfo.opts, 'on_stderr')
      call l:jobinfo.opts.on_stderr(a:jobid, a:data, a:event)
    endif
  endif
endfunction

function! s:on_exit(jobid, status, event) abort
  if has_key(s:jobs, a:jobid)
    let l:jobinfo = s:jobs[a:jobid]
    if has_key(l:jobinfo.opts, 'on_exit')
      call l:jobinfo.opts.on_exit(a:jobid, a:status, a:event)
    endif
  endif
endfunction

function! s:job_start(cmd, opts) abort
  let l:jobtypes = s:job_supported_types()
  let l:jobtype = ''

  if has_key(a:opts, 'type')
    if type(a:opts.type) == type('')
      if !s:job_supports_type(a:opts.type)
        return s:job_error_unsupported_job_type
      endif
      let l:jobtype = a:opts.type
    else
      let l:jobtypes = a:opts.type
    endif
  endif

  if empty(l:jobtype)
    " find the best jobtype
    for l:jobtype2 in l:jobtypes
      if s:job_supports_type(l:jobtype2)
        let l:jobtype = l:jobtype2
      endif
    endfor
  endif

  if l:jobtype ==? ''
    return s:job_error_unsupported_job_type
  endif

  if l:jobtype == s:job_type_nvimjob
    let l:job = jobstart(a:cmd, {
          \ 'on_stdout': function('s:on_stdout'),
          \ 'on_stderr': function('s:on_stderr'),
          \ 'on_exit': function('s:on_exit'),
          \})
    if l:job <= 0
      return l:job
    endif
    let l:jobid = l:job " nvimjobid and internal jobid is same
    let s:jobs[l:jobid] = {
          \ 'type': s:job_type_nvimjob,
          \ 'opts': a:opts,
          \ }
    let s:jobs[l:jobid].job = l:job
  elseif l:jobtype == s:job_type_vimjob
    let s:jobidseq = s:jobidseq + 1
    let l:jobid = s:jobidseq
    let l:job  = job_start(a:cmd, {
          \ 'out_cb': function('s:out_cb', [l:jobid, a:opts]),
          \ 'err_cb': function('s:err_cb', [l:jobid, a:opts]),
          \ 'exit_cb': function('s:exit_cb', [l:jobid, a:opts]),
          \ 'mode': 'raw',
          \})
    if job_status(l:job) !=? 'run'
      return -1
    endif
    let s:jobs[l:jobid] = {
          \ 'type': s:job_type_vimjob,
          \ 'opts': a:opts,
          \ 'job': l:job,
          \ 'channel': job_getchannel(l:job),
          \ 'buffer': ''
          \ }
  else
    return s:job_error_unsupported_job_type
  endif

  return l:jobid
endfunction

function! s:job_stop(jobid) abort
  if has_key(s:jobs, a:jobid)
    let l:jobinfo = s:jobs[a:jobid]
    if l:jobinfo.type == s:job_type_nvimjob
      call jobstop(a:jobid)
    elseif l:jobinfo.type == s:job_type_vimjob
      call job_stop(s:jobs[a:jobid].job)
    endif
    if has_key(s:jobs, a:jobid)
      call remove(s:jobs, a:jobid)
    endif
  endif
endfunction

function! s:job_send(jobid, data) abort
  let l:jobinfo = s:jobs[a:jobid]
  if l:jobinfo.type == s:job_type_nvimjob
    call jobsend(a:jobid, a:data)
  elseif l:jobinfo.type == s:job_type_vimjob
    let l:jobinfo.buffer .= a:data
    call s:flush_vim_sendraw(a:jobid, v:null)
  endif
endfunction

function! s:flush_vim_sendraw(jobid, timer) abort
  " https://github.com/vim/vim/issues/2548
  " https://github.com/natebosch/vim-lsc/issues/67#issuecomment-357469091
  let l:jobinfo = s:jobs[a:jobid]
  if len(l:jobinfo.buffer) <= 1024
    call ch_sendraw(l:jobinfo.channel, l:jobinfo.buffer)
    let l:jobinfo.buffer = ''
  else
    let l:to_send = l:jobinfo.buffer[:1023]
    let l:jobinfo.buffer = l:jobinfo.buffer[1024:]
    call ch_sendraw(l:jobinfo.channel, l:to_send)
    call timer_start(0, function('s:flush_vim_sendraw', [a:jobid]))
  endif
endfunction

function! s:job_wait_single(jobid, timeout, start) abort
  if !has_key(s:jobs, a:jobid)
    return -3
  endif

  let l:jobinfo = s:jobs[a:jobid]
  if l:jobinfo.type == s:job_type_nvimjob
    let l:timeout = a:timeout - reltimefloat(reltime(a:start)) * 1000
    return jobwait([a:jobid], float2nr(l:timeout))[0]
  elseif l:jobinfo.type == s:job_type_vimjob
    let l:timeout = a:timeout / 1000.0
    try
      while l:timeout < 0 || reltimefloat(reltime(a:start)) < l:timeout
        let l:info = job_info(l:jobinfo.job)
        if l:info.status ==# 'dead'
          return l:info.exitval
        elseif l:info.status ==# 'fail'
          return -3
        endif
        sleep 1m
      endwhile
    catch /^Vim:Interrupt$/
      return -2
    endtry
  endif
  return -1
endfunction

function! s:job_wait(jobids, timeout) abort
  let l:start = reltime()
  let l:exitcode = 0
  let l:ret = []
  for l:jobid in a:jobids
    if l:exitcode != -2  " Not interrupted.
      let l:exitcode = s:job_wait_single(l:jobid, a:timeout, l:start)
    endif
    let l:ret += [l:exitcode]
  endfor
  return l:ret
endfunction

" public apis {{{
function! s:async_job_start(cmd, opts) abort
  return s:job_start(a:cmd, a:opts)
endfunction

function! s:async_job_stop(jobid) abort
  call s:job_stop(a:jobid)
endfunction

function! s:async_job_send(jobid, data) abort
  call s:job_send(a:jobid, a:data)
endfunction

function! s:async_job_wait(jobids, ...) abort
  let l:timeout = get(a:000, 0, -1)
  call s:job_wait(a:jobids, l:timeout)
endfunction
" }}}

" }}}

" vim: foldmethod=marker foldlevel=0
