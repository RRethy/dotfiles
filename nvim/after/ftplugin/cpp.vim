fun! CppFoldExpr(lnum) abort
    let prevline = getline(a:lnum-1)
    let curline = getline(a:lnum)
    let shift = repeat(&expandtab ? ' ' : '	', &shiftwidth)
    if prevline =~# '\v^\S+\s+\S+\s*\(.*\)\s+%(const)?\s*\{$'
                \ && curline !~# '\v^\}$'
        return '>1'
    elseif prevline =~# '\v^%(class|struct)\s*\S*\s*\{$'
                \ && curline !~# '\v^\};$'
        return '>1'
    elseif prevline =~# '\v^'.shift.'%(\S+\s)?\S+\(.*\)\s\{$'
                \ && curline !~# '\v^'.shift.'\}$'
        return '>2'
    elseif prevline =~# '\v^'.repeat(shift,2).'\S+\s\S+\(.*\)\s\{$'
                \ && curline !~# '\v^'.shift.'\}$'
        return '>2'
    elseif curline =~# '\v^'.repeat(shift,2).'\}$'
        return '<2'
    elseif curline =~# '\v^'.shift.'\}$'
        return '<2'
    elseif curline =~# '\v^\};$'
        return '<1'
    elseif curline =~# '\v^\}$'
        return '<1'
    else
        return '='
    endif
endf

set foldmethod=expr
set foldlevel=2
set foldexpr=CppFoldExpr(v:lnum)
