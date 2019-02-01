fun! CleverTab()
  if getline('.')[:col('.') - 1] =~# '\v(^\s*|\s+.)$'
    return "\<Tab>"
  else
    return "\<C-N>"
  endif
endf

inoremap <silent> <Tab> <C-R>=CleverTab()<CR>
