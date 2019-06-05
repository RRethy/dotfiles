set foldmethod=syntax
set foldlevel=9

command! -buffer A exe 'edit '.expand('%:h').'.h'
