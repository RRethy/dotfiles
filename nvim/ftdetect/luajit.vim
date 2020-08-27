autocmd BufRead,BufNewFile * if getline(1) =~# '#!.*luajit$' | set filetype=lua | endif
