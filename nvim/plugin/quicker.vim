command! -nargs=1 Keep call setqflist(filter(getqflist(), 'v:val.text =~# "\^\.\*'.<f-args>.'\.\*\$"'))
