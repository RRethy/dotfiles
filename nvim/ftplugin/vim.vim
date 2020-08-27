fun! VimFoldExpr(lnum) abort
    let prevline = getline(v:lnum-1)
    let curline = getline(v:lnum)
    if prevline =~# '^fu' && curline !~# '^endf'
        return '>1'
    elseif curline =~# '^endf'
        return '<1'
    else
        return '='
    endif
endf

set foldmethod=expr
set foldlevel=2
set foldexpr=VimFoldExpr(v:lnum)
