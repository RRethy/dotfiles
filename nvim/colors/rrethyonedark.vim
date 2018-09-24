hi clear

set termguicolors

syntax reset

let g:colors_name = "rrethyonedark"

let s:whiskey = "#D19A66"
let s:fountain_blue = "#56B6C2"
let s:chalky = "#E5C07B"
let s:soft_purple = "#C678DD"
let s:malibu = "#61AFEF"
let s:pistachio = "#98C379"
let s:cadet_blue = "#ABB2BF"
let s:froly = "#E06C75"

fun! s:add_hi(group, bg, fg, special) abort
	let hibg = strlen(a:bg) > 0 ? 'guibg=' . a:bg : ''
	let hifg = strlen(a:fg) > 0 ? 'guifg=' . a:fg : ''
	let higui = strlen(a:special) > 0 ? 'gui=' . a:special : ''
	exe 'hi ' . a:group . ' ' . hibg . ' ' . hifg . ' ' . higui
endf

call s:add_hi('Comment', '', s:cadet_blue, 'italic')
