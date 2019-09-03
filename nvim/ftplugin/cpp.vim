set keywordprg=:Dash
set tabstop=2
set softtabstop=2
set shiftwidth=2
set path=,.,

command! -buffer A exe 'edit '.expand('%:h').'.h'
