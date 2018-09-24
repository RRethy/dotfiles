fun! newsixpack#init(...) abort
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

  let s:optpath = s:ppath . '/pack/sixpack/opt'
  call mkdir(s:optpath, 'p')

  let g:SixpackLogginglevel = get(g:, 'SixpackLogginglevel', 2)

  command -bar -nargs=+ PackAdd echom 'TODO'
  command -bar 

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

endf
