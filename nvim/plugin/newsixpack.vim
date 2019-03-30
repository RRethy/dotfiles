fun! NewPackBrowse() abort
  silent only
  vertical topleft new banana
  normal! gg"_dG
  call setline(1, 'Packs')
  setl modifiable
  let packpaths = split(&packpath, ',')
  let packs_list = []
  for dir in packpaths
    if dir !=# stdpath('config') && isdirectory(dir)
      let packs = glob(dir . '/pack/*', 1, 1)
      call extend(packs_list, packs)
    endif
  endfor
  for dir in packs_list
    let opts = glob(dir . '/opt/*', 1, 1)
    let starts = glob(dir . '/start/*', 1, 1)

    call append(line('$'), dir)

    for plugin in opts
      let plugin = substitute(plugin, '\V\C'.dir.'/opt/', '', '')
      call append(line('$'), '    opt - ' . plugin)
    endfor

    for plugin in starts
      let plugin = substitute(plugin, '\V\C'.dir.'/start/', '', '')
      call append(line('$'), '    start - ' . plugin)
    endfor
  endfor
endf
