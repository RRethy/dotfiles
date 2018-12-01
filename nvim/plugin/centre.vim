" Centre the screen to a specific zone
" For example, z7 will adjust the screen such that your cursor in 70% down the
" window
" A lot more flexible than zz, zt, and z-
" Same thing would be to press zz then either <C-e> or <C-y> a bunch

for i in range(11)
  exe 'nnoremap <silent> z' . i . ' :call <SID>centre_screen(' . i . ')<CR>'
endfor

fun! s:centre_screen(zone) abort
  let percentage = a:zone * 0.1
  let shift = float2nr(winheight(0) * percentage)
  exe 'normal! zt' . shift . ''
endf
