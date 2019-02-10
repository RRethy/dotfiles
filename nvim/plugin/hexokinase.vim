scriptencoding utf-8

let s:HexColored = 0
let s:HexColors = []

map <silent> <Leader><F3> :call <SID>hex_match_hl()<CR>
map <silent> <Leader><F2> :call <SID>hex_sign_hl()<CR>
map <silent> <Leader><F1> :call <SID>hex_virtual_hl()<CR>

function! s:hex_match_hl()
  if s:HexColored == 0
    let hexGroup = 4
    let lineNumber = 0
    while lineNumber <= line('$')
      let currentLine = getline(lineNumber)
      let hexLineMatch = 1
      while match(currentLine, '#\x\{6}', 0, hexLineMatch) != -1
        let hexMatch = matchstr(currentLine, '#\x\{6}', 0, hexLineMatch)
        exe 'hi hexColor'.hexGroup.' guibg='.hexMatch
        exe 'let m = matchadd("hexColor'.hexGroup.'", "'.hexMatch.'", 25, '.hexGroup.')'
        let s:HexColors += ['hexColor'.hexGroup]
        let hexGroup += 1
        let hexLineMatch += 1
      endwhile
      let lineNumber += 1
    endwhile
    unlet lineNumber hexGroup
    let s:HexColored = 1
    echo 'Highlighting hex colors...'
  elseif s:HexColored == 1
    for hexColor in s:HexColors
      exe 'highlight clear '.hexColor
    endfor
    call clearmatches()
    let s:HexColored = 0
    echo 'Unhighlighting hex colors...'
  endif
endfunction

let s:hex_namespace = 999
let s:hex_hl_arr = []
let s:virtual_hl_on = 0

fun! s:hex_virtual_hl() abort
  if !s:virtual_hl_on
    for lnum in range(1, line('$'))
      let cur_line = getline(lnum)
      if match(cur_line, '#\%\(\x\{6}\|\x\{3}\)', 0, 1) != -1
        let hex = matchstr(cur_line, '#\%\(\x\{6}\|\x\{3}\)', 0, 1)
        let hl_name = 'hexLineVirtualHl' . lnum
        exe 'hi ' . hl_name . ' guibg=' . hex
        call add(s:hex_hl_arr, hl_name)
        call nvim_buf_set_virtual_text(bufnr('%'), s:hex_namespace, lnum - 1, [['      ', hl_name]], {})
      endif
    endfor

    let s:virtual_hl_on = 1
    echo 'Turned on virtual'
  else
    call nvim_buf_clear_namespace(bufnr('%'), s:hex_namespace, 0, -1)
    for colour in s:hex_hl_arr
      exe 'highlight clear ' . colour
    endfor

    let s:virtual_hl_on = 0
    echo 'Turned off virtual'
  endif
endf

let s:sign_hl_names = []
let s:sign_names = []
let s:sign_ids = []
let s:sign_hl_on = 0

fun! s:hex_sign_hl() abort
  if !s:sign_hl_on
    for lnum in range(1, line('$'))
      let cur_line = getline(lnum)
      if match(cur_line, '#\%\(\x\{6}\|\x\{3}\)', 0, 1) != -1
        let hex = matchstr(cur_line, '#\%\(\x\{6}\|\x\{3}\)', 0, 1)
        let hl_name = 'hexLineSignHl' . lnum
        let sign_name = hl_name . 'sign'
        let sign_id = 4000 + lnum

        exe 'hi ' . hl_name . ' guibg=' . hex
        exe 'sign define ' . sign_name . ' text=\  texthl=' . hl_name
        exe 'sign place ' . sign_id . ' line=' . lnum . ' name=' . sign_name . ' file=' . expand('%:p')

        call add(s:sign_hl_names, hl_name)
        call add(s:sign_names, sign_name)
        call add(s:sign_ids, sign_id)
      endif
    endfor

    let s:sign_hl_on = 1
    echo 'Turned on signs'
  else
    for colour in s:sign_hl_names
      exe 'highlight clear ' . colour
    endfor
    for sign_name in s:sign_names
      exe 'sign undefine ' . sign_name
    endfor
    for sign_id in s:sign_ids
      exe 'sign unplace ' . sign_id
    endfor

    let s:sign_hl_names = []
    let s:sign_names = []
    let s:sign_ids = []
    let s:sign_hl_on = 0
    echo 'Turned off signs'
  endif
endf

fun! s:generate_possible_hex() abort
  fun! s:generate_possible_hex_core(i, hex) abort
    if a:i == 6
      call append(line('$'), a:hex)
      return
    endif
    for c in ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      call s:generate_possible_hex_core(a:i + 1, a:hex . c)
    endfor
  endf

  call s:generate_possible_hex_core(0, '#')
endf

" #FFEBEE
" #FFCDD2
" #EF9A9A
" #E57373
" #EF5350
" #F44336
" #E53935
" #D32F2F
" #C62828
" #B71C1C
" #FF8A80
" #FF5252
" #FF1744
" #D50000
" #FCE4EC
" #F8BBD0
" #F48FB1
" #F06292
" #EC407A
" #E91E63
" #D81B60
" #C2185B
" #AD1457
" #880E4F
" #FF80AB
" #FF4081
" #F50057
" #C51162
" #F3E5F5
" #E1BEE7
" #CE93D8
" #BA68C8
" #AB47BC
" #9C27B0
" #8E24AA
" #7B1FA2
" #6A1B9A
" #4A148C
" #EA80FC
" #E040FB
" #D500F9
" #AA00FF
" #EDE7F6
" #D1C4E9
" #B39DDB
" #9575CD
" #7E57C2
" #673AB7
" #5E35B1
" #512DA8
" #4527A0
" #311B92
" #B388FF
" #7C4DFF
" #651FFF
" #6200EA
" #E8EAF6
" #C5CAE9
" #9FA8DA
" #7986CB
" #5C6BC0
" #3F51B5
" #3949AB
" #303F9F
" #283593
" #1A237E
" #8C9EFF
" #536DFE
" #3D5AFE
" #304FFE
" #E3F2FD
" #BBDEFB
" #90CAF9
" #64B5F6
" #42A5F5
" #2196F3
" #1E88E5
" #1976D2
" #1565C0
" #0D47A1
" #82B1FF
" #448AFF
" #2979FF
" #2962FF
" #E1F5FE
" #B3E5FC
" #81D4FA
" #4FC3F7
" #29B6F6
" #03A9F4
" #039BE5
" #0288D1
" #0277BD
" #01579B
" #80D8FF
" #40C4FF
" #00B0FF
" #0091EA
" #E0F7FA
" #B2EBF2
" #80DEEA
" #4DD0E1
" #26C6DA
" #00BCD4
" #00ACC1
" #0097A7
" #00838F
" #006064
" #84FFFF
" #18FFFF
" #00E5FF
" #00B8D4
" #E0F2F1
" #B2DFDB
" #80CBC4
" #4DB6AC
" #26A69A
" #009688
" #00897B
" #00796B
" #00695C
" #004D40
" #A7FFEB
" #64FFDA
" #1DE9B6
" #00BFA5
" #E8F5E9
" #C8E6C9
" #A5D6A7
" #81C784
" #66BB6A
" #4CAF50
" #43A047
" #388E3C
" #2E7D32
" #1B5E20
" #B9F6CA
" #69F0AE
" #00E676
" #00C853
" #F1F8E9
" #DCEDC8
" #C5E1A5
" #AED581
" #9CCC65
" #8BC34A
" #7CB342
" #689F38
" #558B2F
" #33691E
" #CCFF90
" #B2FF59
" #76FF03
" #64DD17
" #F9FBE7
" #F0F4C3
" #E6EE9C
" #DCE775
" #D4E157
" #CDDC39
" #C0CA33
" #AFB42B
" #9E9D24
" #827717
" #F4FF81
" #EEFF41
" #C6FF00
" #AEEA00
" #FFFDE7
" #FFF9C4
" #FFF59D
" #FFF176
" #FFEE58
" #FFEB3B
" #FDD835
" #FBC02D
" #F9A825
" #F57F17
" #FFFF8D
" #FFFF00
" #FFEA00
" #FFD600
" #FFF8E1
" #FFECB3
" #FFE082
" #FFD54F
" #FFCA28
" #FFC107
" #FFB300
" #FFA000
" #FF8F00
" #FF6F00
" #FFE57F
" #FFD740
" #FFC400
" #FFAB00
" #FFF3E0
" #FFE0B2
" #FFCC80
" #FFB74D
" #FFA726
" #FF9800
" #FB8C00
" #F57C00
" #EF6C00
" #E65100
" #FFD180
" #FFAB40
" #FF9100
" #FF6D00
" #FBE9E7
" #FFCCBC
" #FFAB91
" #FF8A65
" #FF7043
" #FF5722
" #F4511E
" #E64A19
" #D84315
" #BF360C
" #FF9E80
" #FF6E40
" #FF3D00
" #DD2C00
" #EFEBE9
" #D7CCC8
" #BCAAA4
" #A1887F
" #8D6E63
" #795548
" #6D4C41
" #5D4037
" #4E342E
" #3E2723
" #FAFAFA
" #F5F5F5
" #EEEEEE
" #E0E0E0
" #BDBDBD
" #9E9E9E
" #757575
" #616161
" #424242
" #212121
" #ECEFF1
" #CFD8DC
" #B0BEC5
" #90A4AE
" #78909C
" #607D8B
" #546E7A
" #455A64
" #37474F
" #263238
" #000000
" #FFFFFF
