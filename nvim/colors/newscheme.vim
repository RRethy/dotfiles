hi clear

set termguicolors

let g:colors_name = 'newscheme'

let FG='#ABB2BF'
let DARKER_FG='#515e77'
let BG='#1E2127'
let BG_LIGHT='#43485a'
let VISUAL_BG='#3c424f'
let CURSORLINE_BG='#2C313C'
let DARKER_BG='#172030'
let ACCENT='#528BFF'
let CYAN='#56B6C2'
let BLUE='#61AFEF'
let FADED_BLUE='#525d72'
let PURPLE='#C678DD'
let GREEN='#98C379'
let RED_LIGHT='#E06C75'
let RED_DARK='#BE5046'
let ORANGE_LIGHT='#E5C07B'
let ORANGE_DARK='#D19A66'
let BOLD='BOLD'
let ITALIC='ITALIC'
let UNDERLINE='UNDERLINE'
let BOLD_UNDERLINE='BOLD,UNDERLINE'
let NONE='NONE'

fun! s:add_hi(group, fg, bg, gui) abort
  exe 'hi ' . a:group . ' guifg=' . a:fg . ' guibg=' . a:bg . ' gui=' . a:gui
endf

" call s:add_hi('Conceal')
call s:add_hi('Cursor', NONE, BLUE, NONE)
call s:add_hi('CursorLine', NONE, CURSORLINE_BG, NONE)
call s:add_hi('Directory', ACCENT, NONE, BOLD)
call s:add_hi('DiffAdd', NONE, '#1B5E20', NONE)
call s:add_hi('DiffChange', NONE, '#9C27B0', NONE)
call s:add_hi('DiffDelete', NONE, '#B71C1C', NONE)
call s:add_hi('DiffText', FG, '#4A148C', BOLD)
call s:add_hi('EndOfBuffer', BG_LIGHT, BG, NONE)
call s:add_hi('ErrorMsg', RED_DARK, DARKER_BG, BOLD)
call s:add_hi('VertSplit', FG, NONE, NONE)
call s:add_hi('Folded', NONE, NONE, NONE)
" call s:add_hi('Folded', ACCENT, DARKER_BG, NONE)
call s:add_hi('SignColumn', BG_LIGHT, NONE, NONE)
call s:add_hi('IncSearch', BG, BLUE, BOLD)
call s:add_hi('LineNr', BG_LIGHT, NONE, NONE)
call s:add_hi('CursorLineNr', ACCENT, CURSORLINE_BG, BOLD)
call s:add_hi('MatchParen', ACCENT, NONE, BOLD_UNDERLINE)
call s:add_hi('MoreMsg', ACCENT, NONE, BOLD)
call s:add_hi('NonText', NONE, NONE, BOLD)
call s:add_hi('Normal', FG, BG, NONE)
call s:add_hi('NormalNC', FG, BG, NONE)
call s:add_hi('Pmenu', NONE, DARKER_BG, NONE)
call s:add_hi('PmenuSel', NONE, BG_LIGHT, NONE)
call s:add_hi('PmenuSbar', NONE, DARKER_BG, NONE)
call s:add_hi('PmenuThumb', NONE, ACCENT, NONE)
call s:add_hi('Question', ACCENT, NONE, BOLD)
call s:add_hi('QuickFixLine', 'bg', FADED_BLUE, BOLD)
call s:add_hi('Search', BG, ACCENT, NONE)
call s:add_hi('SpecialKey', BG_LIGHT, RED_LIGHT, BOLD)
call s:add_hi('SpellBad', RED_DARK, NONE, BOLD_UNDERLINE)
call s:add_hi('SpellCap', RED_LIGHT, NONE, UNDERLINE)
call s:add_hi('StatusLine', NONE, CURSORLINE_BG, NONE)
call s:add_hi('StatusLineNC', CURSORLINE_BG, NONE, NONE)
call s:add_hi('StatusLineTerm', NONE, CURSORLINE_BG, NONE)
call s:add_hi('StatusLineTermNC', NONE, CURSORLINE_BG, NONE)
call s:add_hi('TabLine', NONE, CURSORLINE_BG, NONE)
call s:add_hi('TabLineFill', NONE, NONE, NONE)
call s:add_hi('TabLineSel', BG, FG, NONE)
call s:add_hi('Title', PURPLE, NONE, BOLD)
call s:add_hi('Visual', NONE, VISUAL_BG, NONE)
call s:add_hi('WarningMsg', RED_LIGHT, NONE, BOLD)
call s:add_hi('Whitespace', CURSORLINE_BG, CURSORLINE_BG, NONE)

hi def link ColorColumn CursorLine
hi def link CursorColumn CursorLine
hi def link TermCursor Cursor
hi def link TermCursorNC CursorLine
hi def link FoldColumn Folded
hi def link Substitute IncSearch
hi def link WildMenu PMenuSel

call s:add_hi('Comment', DARKER_FG, NONE, ITALIC)
call s:add_hi('Constant', ORANGE_DARK, NONE, NONE)
call s:add_hi('String', GREEN, NONE, NONE)
hi def link Character String
call s:add_hi('Number', ORANGE_LIGHT, NONE, NONE)
call s:add_hi('Boolean', ORANGE_LIGHT, NONE, NONE)
call s:add_hi('Float', ORANGE_LIGHT, NONE, NONE)
call s:add_hi('Identifier', RED_LIGHT, NONE, NONE)
call s:add_hi('Function', BLUE, NONE, NONE)
call s:add_hi('Statement', PURPLE, NONE, NONE)
call s:add_hi('Conditional', PURPLE, NONE, NONE)
call s:add_hi('Repeat', PURPLE, NONE, NONE)
call s:add_hi('Label', PURPLE, NONE, NONE)
call s:add_hi('Operator', PURPLE, NONE, NONE)
call s:add_hi('Keyword', PURPLE, NONE, NONE)
call s:add_hi('Exception', PURPLE, NONE, NONE)
call s:add_hi('PreProc', ORANGE_LIGHT, NONE, NONE)
call s:add_hi('Include', PURPLE, NONE, NONE)
call s:add_hi('Define', PURPLE, NONE, NONE)
call s:add_hi('Macro', PURPLE, NONE, NONE)
call s:add_hi('PreCondit', PURPLE, NONE, NONE)
call s:add_hi('Type', PURPLE, NONE, NONE)
call s:add_hi('StorageClass', PURPLE, NONE, NONE)
call s:add_hi('Structure', PURPLE, NONE, NONE)
call s:add_hi('Typedef', PURPLE, NONE, NONE)
call s:add_hi('Special', ACCENT, NONE, NONE)
call s:add_hi('SpecialChar', ACCENT, NONE, NONE)
call s:add_hi('Tag', ACCENT, NONE, NONE)
call s:add_hi('Delimiter', ACCENT, NONE, NONE)
call s:add_hi('SpecialComment', ACCENT, NONE, NONE)
call s:add_hi('Debug', ACCENT, NONE, NONE)
call s:add_hi('Underlined', NONE, NONE, BOLD_UNDERLINE)
hi def link Ignore Conceal
call s:add_hi('Error', RED_DARK, NONE, BOLD)
call s:add_hi('Todo', ACCENT, NONE, BOLD)
call s:add_hi('keywords', ACCENT, NONE, BOLD)

hi def link vimCommand Keyword
hi def link vimCommentTitle Comment
hi def link vimComment Comment
hi def link vimLineComment Comment
hi def link vimFunction Statement
hi def link vimFuncName Statement
hi def link vimUserFunc Function
hi def link vimVar Identifier

hi def link helpExample Number

hi def link markdownCode Number

hi def link htmlBold keywords

hi link NeomakeError Error
hi link NeomakeWarning WarningMsg
hi link NeomakeInfo Debug
hi link NeomakeMessage MoreMsg
hi link NeomakeVirtualtextError Error
hi link NeomakeVirtualtextWarning WarningMsg
hi link NeomakeVirtualtextInfo Debug
hi link NeomakeVirtualtextMessag MoreMsg

let g:terminal_color_0  = '#1e2127'
let g:terminal_color_1  = '#353b45'
let g:terminal_color_2  = '#98c379'
let g:terminal_color_3  = '#d19a66'
let g:terminal_color_4  = '#61AFEF'
let g:terminal_color_5  = '#c678dd'
let g:terminal_color_6  = '#0dcdcd'
let g:terminal_color_7  = '#abb2bf'
let g:terminal_color_8  = '#5c6370'
let g:terminal_color_9  = '#e06c75'
let g:terminal_color_10 = '#98c379'
let g:terminal_color_11 = '#d19a66'
let g:terminal_color_12 = '#2C323B'
let g:terminal_color_13 = '#cb1ed1'
let g:terminal_color_14 = '#0dcdcd'
let g:terminal_color_15 = '#ffffff'

unlet FG
unlet DARKER_FG
unlet BG
unlet BG_LIGHT
unlet VISUAL_BG
unlet CURSORLINE_BG
unlet DARKER_BG
unlet ACCENT
unlet CYAN
unlet BLUE
unlet PURPLE
unlet GREEN
unlet RED_LIGHT
unlet RED_DARK
unlet ORANGE_LIGHT
unlet ORANGE_DARK
unlet BOLD
unlet ITALIC
unlet UNDERLINE
unlet BOLD_UNDERLINE
unlet NONE

set background=dark
