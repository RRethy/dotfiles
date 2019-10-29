" schemer.vim -- Vim color scheme.
" Author:      Adam P. Regasz-Rethy (rethy.spud@gmail.com)
" Webpage:     https://github.com/rrethy
" Description: The colorscheme used by rrethy

hi clear

if exists('syntax_on')
  syntax reset
endif

let colors_name = 'schemer'

if has('termguicolors')
	set termguicolors
endif

if ($TERM =~# '256' || &t_Co >= 256) || has('gui_running')
    hi Normal ctermbg=0 ctermfg=15 cterm=NONE guibg=#1e2127 guifg=#abb2bf gui=NONE

    set background=dark

    hi NonText ctermbg=0 ctermfg=7 cterm=bold guibg=#1e2127 guifg=#515e77 gui=bold
    hi Comment ctermbg=NONE ctermfg=7 cterm=italic guibg=NONE guifg=#515e77 gui=italic
    hi Constant ctermbg=NONE ctermfg=3 cterm=NONE guibg=NONE guifg=#d19965 gui=NONE
    hi Error ctermbg=1 ctermfg=NONE cterm=bold guibg=#be5046 guifg=NONE gui=bold
    hi Identifier ctermbg=NONE ctermfg=9 cterm=NONE guibg=NONE guifg=#e06c75 gui=NONE
    hi Conceal ctermbg=bg ctermfg=fg cterm=NONE guibg=bg guifg=fg gui=NONE
    hi PreProc ctermbg=NONE ctermfg=11 cterm=NONE guibg=NONE guifg=#e4bf7a gui=NONE
    hi Special ctermbg=NONE ctermfg=6 cterm=NONE guibg=NONE guifg=#00ACC1 gui=NONE
    hi Statement ctermbg=NONE ctermfg=13 cterm=NONE guibg=NONE guifg=#c578dd gui=NONE
    hi String ctermbg=NONE ctermfg=10 cterm=NONE guibg=NONE guifg=#89ca78 gui=NONE
    hi Todo ctermbg=NONE ctermfg=14 cterm=bold guibg=NONE guifg=#56b5c2 gui=bold
    hi Type ctermbg=NONE ctermfg=13 cterm=NONE guibg=NONE guifg=#c578dd gui=NONE
    hi Underlined ctermbg=NONE ctermfg=NONE cterm=bold,underline guibg=NONE guifg=NONE gui=bold,underline
    hi StatusLine ctermbg=8 ctermfg=NONE cterm=NONE guibg=#2c313c guifg=NONE gui=NONE
    hi StatusLineNC ctermbg=NONE ctermfg=8 cterm=NONE guibg=NONE guifg=#2c313c gui=NONE
    hi VertSplit ctermbg=NONE ctermfg=15 cterm=NONE guibg=NONE guifg=#abb2bf gui=NONE
    hi TabLine ctermbg=8 ctermfg=NONE cterm=NONE guibg=#2c313c guifg=NONE gui=NONE
    hi TabLineNoOp ctermbg=8 ctermfg=8 cterm=NONE guibg=#2c313c guifg=#2c313c gui=NONE
    hi TabLineInv ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi TabLineFillInv ctermbg=NONE ctermfg=8 cterm=NONE guibg=NONE guifg=#2c313c gui=NONE
    hi TabLineFill ctermbg=NONE ctermfg=NONE cterm=NONE guibg=NONE guifg=NONE gui=NONE
    hi TabLineSel ctermbg=15 ctermfg=0 cterm=NONE guibg=#abb2bf guifg=#1e2127 gui=NONE
    hi TabLineSelInv ctermbg=8 ctermfg=15 cterm=NONE guibg=#2c313c guifg=#abb2bf gui=NONE
    hi TabLineSelFillInv ctermbg=NONE ctermfg=15 cterm=NONE guibg=NONE guifg=#abb2bf gui=NONE
    hi Title ctermbg=NONE ctermfg=13 cterm=bold guibg=NONE guifg=#c578dd gui=bold
    hi CursorLine ctermbg=8 ctermfg=NONE cterm=NONE guibg=#2c313c guifg=NONE gui=NONE
    hi ColorColumn ctermbg=8 ctermfg=NONE cterm=NONE guibg=#2c313c guifg=NONE gui=NONE
    hi CursorColumn ctermbg=8 ctermfg=NONE cterm=NONE guibg=#2c313c guifg=NONE gui=NONE
    hi LineNr ctermbg=NONE ctermfg=7 cterm=NONE guibg=NONE guifg=#515e77 gui=NONE
    hi CursorLineNr ctermbg=8 ctermfg=4 cterm=bold guibg=#2c313c guifg=#528bff gui=bold
    hi Cursor ctermbg=NONE ctermfg=NONE cterm=NONE guibg=NONE guifg=NONE gui=NONE
    hi helpLeadBlank ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi helpNormal ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Visual ctermbg=8 ctermfg=NONE cterm=NONE guibg=#2c313c guifg=NONE gui=NONE
    hi Pmenu ctermbg=8 ctermfg=fg cterm=NONE guibg=#2c313c guifg=fg gui=NONE
    hi PmenuSbar ctermbg=7 ctermfg=NONE cterm=NONE guibg=#515e77 guifg=NONE gui=NONE
    hi PmenuSel ctermbg=14 ctermfg=bg cterm=bold guibg=#56b5c2 guifg=bg gui=bold
    hi PmenuThumb ctermbg=13 ctermfg=NONE cterm=NONE guibg=#c578dd guifg=NONE gui=NONE
    hi Folded ctermbg=8 ctermfg=15 cterm=NONE guibg=#2c313c guifg=#abb2bf gui=NONE
    hi WildMenu ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi SpecialKey ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi DiffAdd ctermbg=10 ctermfg=NONE cterm=NONE guibg=#89ca78 guifg=NONE gui=NONE
    hi DiffChange ctermbg=11 ctermfg=NONE cterm=NONE guibg=#e4bf7a guifg=NONE gui=NONE
    hi DiffDelete ctermbg=9 ctermfg=NONE cterm=NONE guibg=#e06c75 guifg=NONE gui=NONE
    hi DiffText ctermbg=13 ctermfg=NONE cterm=NONE guibg=#c578dd guifg=NONE gui=NONE
    hi IncSearch ctermbg=5 ctermfg=bg cterm=NONE guibg=#d55fde guifg=bg gui=NONE
    hi Search ctermbg=12 ctermfg=bg cterm=NONE guibg=#61afef guifg=bg gui=NONE
    hi Directory ctermbg=NONE ctermfg=14 cterm=bold guibg=NONE guifg=#56b5c2 gui=bold
    hi MatchParen ctermbg=NONE ctermfg=4 cterm=bold,underline guibg=NONE guifg=#528bff gui=bold,underline
    hi SpellBad ctermbg=NONE ctermfg=1 cterm=bold,underline guibg=NONE guifg=#be5046 gui=bold,underline
    hi SpellCap ctermbg=NONE ctermfg=9 cterm=bold guibg=NONE guifg=#e06c75 gui=bold
    hi SpellLocal ctermbg=NONE ctermfg=NONE cterm=NONE guibg=NONE guifg=NONE gui=NONE
    hi SpellRare ctermbg=NONE ctermfg=11 cterm=NONE guibg=NONE guifg=#e4bf7a gui=NONE
    hi SignColumn ctermbg=NONE ctermfg=bg cterm=NONE guibg=NONE guifg=bg gui=NONE
    hi ErrorMsg ctermbg=1 ctermfg=0 cterm=bold guibg=#be5046 guifg=#1e2127 gui=bold
    hi ModeMsg ctermbg=NONE ctermfg=14 cterm=underline guibg=NONE guifg=#56b5c2 gui=underline
    hi MoreMsg ctermbg=NONE ctermfg=4 cterm=bold guibg=NONE guifg=#528bff gui=bold
    hi Question ctermbg=NONE ctermfg=4 cterm=bold guibg=NONE guifg=#528bff gui=bold

elseif &t_Co == 8 || $TERM !~# '^linux' || &t_Co == 16
    set t_Co=16

    hi Normal ctermbg=black ctermfg=white cterm=NONE

    set background=dark

    hi NonText ctermbg=black ctermfg=gray cterm=bold
    hi Comment ctermbg=NONE ctermfg=gray cterm=italic
    hi Constant ctermbg=NONE ctermfg=darkyellow cterm=NONE
    hi Error ctermbg=darkred ctermfg=NONE cterm=bold
    hi Identifier ctermbg=NONE ctermfg=red cterm=NONE
    hi Conceal ctermbg=bg ctermfg=fg cterm=NONE
    hi PreProc ctermbg=NONE ctermfg=yellow cterm=NONE
    hi Special ctermbg=NONE ctermfg=darkcyan cterm=NONE
    hi Statement ctermbg=NONE ctermfg=magenta cterm=NONE
    hi String ctermbg=NONE ctermfg=green cterm=NONE
    hi Todo ctermbg=NONE ctermfg=cyan cterm=bold
    hi Type ctermbg=NONE ctermfg=magenta cterm=NONE
    hi Underlined ctermbg=NONE ctermfg=NONE cterm=bold,underline
    hi StatusLine ctermbg=darkgray ctermfg=NONE cterm=NONE
    hi StatusLineNC ctermbg=NONE ctermfg=darkgray cterm=NONE
    hi VertSplit ctermbg=NONE ctermfg=white cterm=NONE
    hi TabLine ctermbg=darkgray ctermfg=NONE cterm=NONE
    hi TabLineNoOp ctermbg=darkgray ctermfg=darkgray cterm=NONE
    hi TabLineInv ctermbg=white ctermfg=darkgray cterm=NONE
    hi TabLineFillInv ctermbg=NONE ctermfg=darkgray cterm=NONE
    hi TabLineFill ctermbg=NONE ctermfg=NONE cterm=NONE
    hi TabLineSel ctermbg=white ctermfg=black cterm=NONE
    hi TabLineSelInv ctermbg=darkgray ctermfg=white cterm=NONE
    hi TabLineSelFillInv ctermbg=NONE ctermfg=white cterm=NONE
    hi Title ctermbg=NONE ctermfg=magenta cterm=bold
    hi CursorLine ctermbg=darkgray ctermfg=NONE cterm=NONE
    hi ColorColumn ctermbg=darkgray ctermfg=NONE cterm=NONE
    hi CursorColumn ctermbg=darkgray ctermfg=NONE cterm=NONE
    hi LineNr ctermbg=NONE ctermfg=gray cterm=NONE
    hi CursorLineNr ctermbg=darkgray ctermfg=darkblue cterm=bold
    hi Cursor ctermbg=NONE ctermfg=NONE cterm=NONE
    hi helpLeadBlank ctermbg=white ctermfg=darkgray cterm=NONE
    hi helpNormal ctermbg=white ctermfg=darkgray cterm=NONE
    hi Visual ctermbg=darkgray ctermfg=NONE cterm=NONE
    hi Pmenu ctermbg=darkgray ctermfg=fg cterm=NONE
    hi PmenuSbar ctermbg=gray ctermfg=NONE cterm=NONE
    hi PmenuSel ctermbg=cyan ctermfg=bg cterm=bold
    hi PmenuThumb ctermbg=magenta ctermfg=NONE cterm=NONE
    hi Folded ctermbg=darkgray ctermfg=white cterm=NONE
    hi WildMenu ctermbg=white ctermfg=darkgray cterm=NONE
    hi SpecialKey ctermbg=white ctermfg=darkgray cterm=NONE
    hi DiffAdd ctermbg=green ctermfg=NONE cterm=NONE
    hi DiffChange ctermbg=yellow ctermfg=NONE cterm=NONE
    hi DiffDelete ctermbg=red ctermfg=NONE cterm=NONE
    hi DiffText ctermbg=magenta ctermfg=NONE cterm=NONE
    hi IncSearch ctermbg=darkmagenta ctermfg=bg cterm=NONE
    hi Search ctermbg=blue ctermfg=bg cterm=NONE
    hi Directory ctermbg=NONE ctermfg=cyan cterm=bold
    hi MatchParen ctermbg=NONE ctermfg=darkblue cterm=bold,underline
    hi SpellBad ctermbg=NONE ctermfg=darkred cterm=bold,underline
    hi SpellCap ctermbg=NONE ctermfg=red cterm=bold
    hi SpellLocal ctermbg=NONE ctermfg=NONE cterm=NONE
    hi SpellRare ctermbg=NONE ctermfg=yellow cterm=NONE
    hi SignColumn ctermbg=NONE ctermfg=bg cterm=NONE
    hi ErrorMsg ctermbg=darkred ctermfg=black cterm=bold
    hi ModeMsg ctermbg=NONE ctermfg=cyan cterm=underline
    hi MoreMsg ctermbg=NONE ctermfg=darkblue cterm=bold
    hi Question ctermbg=NONE ctermfg=darkblue cterm=bold
endif

hi link Ignore Conceal
hi link Number Constant
hi link StatusLineTerm StatusLine
hi link StatusLineTermNC StatusLineNC
hi link VisualNOS CursorLine
hi link FoldColumn LineNr
hi link WarningMsg Error
hi link QuickFixLine CursorLine
hi link Whitespace CursorLine
hi link NormalFloat CursorLine

if has('nvim')

    let g:terminal_color_0 = '#1e2127'
    let g:terminal_color_1 = '#be5046'
    let g:terminal_color_2 = '#008000'
    let g:terminal_color_3 = '#d19965'
    let g:terminal_color_4 = '#528bff'
    let g:terminal_color_5 = '#d55fde'
    let g:terminal_color_6 = '#00ACC1'
    let g:terminal_color_7 = '#515e77'
    let g:terminal_color_8 = '#2c313c'
    let g:terminal_color_9 = '#e06c75'
    let g:terminal_color_10 = '#89ca78'
    let g:terminal_color_11 = '#e4bf7a'
    let g:terminal_color_12 = '#61afef'
    let g:terminal_color_13 = '#c578dd'
    let g:terminal_color_14 = '#56b5c2'
    let g:terminal_color_15 = '#abb2bf'

else

    let g:terminal_ansi_colors = [
            \ '#1e2127',
            \ '#be5046',
            \ '#008000',
            \ '#d19965',
            \ '#528bff',
            \ '#d55fde',
            \ '#00ACC1',
            \ '#515e77',
            \ '#2c313c',
            \ '#e06c75',
            \ '#89ca78',
            \ '#e4bf7a',
            \ '#61afef',
            \ '#c578dd',
            \ '#56b5c2',
            \ '#abb2bf',
            \ ]
    
endif

hi SilentStatusline     guifg=#A9B7C6 guibg=#2c323c
hi SpySl                guifg=#1e2127 guibg=#A9B7C6
hi SpySlInv             guifg=#A9B7C6 guibg=#818E9C
hi LeftPrompt           guifg=#1e2127 guibg=#818E9C
" hi LeftPromptInv        guifg=#818E9C guibg=#657281
hi LeftPromptInv        guifg=#818E9C guibg=#e06c75
hi GitPrompt            guifg=#1e2127 guibg=#657281
hi GitPromptInv         guifg=#657281 guibg=#e06c75
hi RightPrompt          guifg=#1e2127 guibg=#A9B7C6
hi RightPromptInv       guifg=#A9B7C6 guibg=#2c323c
hi AlePromptErrors      guifg=#2c313c guibg=#e06c75
hi AlePromptErrorsInv   guifg=#e06c75 guibg=#d19965
hi AlePromptWarnings    guifg=#2c313c guibg=#d19965
hi AlePromptWarningsInv guifg=#d19965 guibg=#2c323c

hi SilentStatuslineNC  guifg=#A9B7C6 guibg=#2c323c
hi SpySlNC             guifg=#1e2127 guibg=#818E9C
hi SpySlInvNC          guifg=#818E9C guibg=#657281
hi LeftPromptNC        guifg=#1e2127 guibg=#657281
hi LeftPromptInvNC     guifg=#657281 guibg=#2c323c
hi RightPromptNC       guifg=#1e2127 guibg=#818E9C
hi RightPromptInvNC    guifg=#818E9C guibg=#2c323c

" Generated with RNB (https://github.com/romainl/vim-rnb)
