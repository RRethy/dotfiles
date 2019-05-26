" schemer.vim -- Vim color scheme.
" Author:      foo (foo@foo.foo)
" Webpage:     http://www.example.com
" Description: Lorem ipsum dolor sit amet.

hi clear

if exists("syntax_on")
  syntax reset
endif

let colors_name = "schemer"

if ($TERM =~ '256' || &t_Co >= 256) || has("gui_running")
    hi Normal ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE

    set background=dark

    hi NonText ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Comment ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Constant ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Error ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Identifier ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Ignore ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi PreProc ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Special ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Statement ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi String ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Todo ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Type ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Underlined ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi StatusLine ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi StatusLineNC ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi VertSplit ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi TabLine ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi TabLineFill ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi TabLineSel ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Title ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi CursorLine ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi LineNr ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi CursorLineNr ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi helpLeadBlank ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi helpNormal ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Visual ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi VisualNOS ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Pmenu ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi PmenuSbar ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi PmenuSel ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi PmenuThumb ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi FoldColumn ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Folded ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi WildMenu ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi SpecialKey ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi DiffAdd ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi DiffChange ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi DiffDelete ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi DiffText ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi IncSearch ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Search ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Directory ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi MatchParen ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi SpellBad ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE guisp=#e06c75
    hi SpellCap ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE guisp=#61afef
    hi SpellLocal ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE guisp=#c678dd
    hi SpellRare ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE guisp=#56b6c2
    hi ColorColumn ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi SignColumn ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi ErrorMsg ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi ModeMsg ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi MoreMsg ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Question ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi Cursor ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi CursorColumn ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE
    hi QuickFixLine ctermbg=15 ctermfg=8 cterm=NONE guibg=#abb2bf guifg=#2c313c gui=NONE

elseif &t_Co == 8 || $TERM !~# '^linux' || &t_Co == 16
    set t_Co=16

    hi Normal ctermbg=white ctermfg=darkgray cterm=NONE

    set background=dark

    hi NonText ctermbg=white ctermfg=darkgray cterm=NONE
    hi Comment ctermbg=white ctermfg=darkgray cterm=NONE
    hi Constant ctermbg=white ctermfg=darkgray cterm=NONE
    hi Error ctermbg=white ctermfg=darkgray cterm=NONE
    hi Identifier ctermbg=white ctermfg=darkgray cterm=NONE
    hi Ignore ctermbg=white ctermfg=darkgray cterm=NONE
    hi PreProc ctermbg=white ctermfg=darkgray cterm=NONE
    hi Special ctermbg=white ctermfg=darkgray cterm=NONE
    hi Statement ctermbg=white ctermfg=darkgray cterm=NONE
    hi String ctermbg=white ctermfg=darkgray cterm=NONE
    hi Todo ctermbg=white ctermfg=darkgray cterm=NONE
    hi Type ctermbg=white ctermfg=darkgray cterm=NONE
    hi Underlined ctermbg=white ctermfg=darkgray cterm=NONE
    hi StatusLine ctermbg=white ctermfg=darkgray cterm=NONE
    hi StatusLineNC ctermbg=white ctermfg=darkgray cterm=NONE
    hi VertSplit ctermbg=white ctermfg=darkgray cterm=NONE
    hi TabLine ctermbg=white ctermfg=darkgray cterm=NONE
    hi TabLineFill ctermbg=white ctermfg=darkgray cterm=NONE
    hi TabLineSel ctermbg=white ctermfg=darkgray cterm=NONE
    hi Title ctermbg=white ctermfg=darkgray cterm=NONE
    hi CursorLine ctermbg=white ctermfg=darkgray cterm=NONE
    hi LineNr ctermbg=white ctermfg=darkgray cterm=NONE
    hi CursorLineNr ctermbg=white ctermfg=darkgray cterm=NONE
    hi helpLeadBlank ctermbg=white ctermfg=darkgray cterm=NONE
    hi helpNormal ctermbg=white ctermfg=darkgray cterm=NONE
    hi Visual ctermbg=white ctermfg=darkgray cterm=NONE
    hi VisualNOS ctermbg=white ctermfg=darkgray cterm=NONE
    hi Pmenu ctermbg=white ctermfg=darkgray cterm=NONE
    hi PmenuSbar ctermbg=white ctermfg=darkgray cterm=NONE
    hi PmenuSel ctermbg=white ctermfg=darkgray cterm=NONE
    hi PmenuThumb ctermbg=white ctermfg=darkgray cterm=NONE
    hi FoldColumn ctermbg=white ctermfg=darkgray cterm=NONE
    hi Folded ctermbg=white ctermfg=darkgray cterm=NONE
    hi WildMenu ctermbg=white ctermfg=darkgray cterm=NONE
    hi SpecialKey ctermbg=white ctermfg=darkgray cterm=NONE
    hi DiffAdd ctermbg=white ctermfg=darkgray cterm=NONE
    hi DiffChange ctermbg=white ctermfg=darkgray cterm=NONE
    hi DiffDelete ctermbg=white ctermfg=darkgray cterm=NONE
    hi DiffText ctermbg=white ctermfg=darkgray cterm=NONE
    hi IncSearch ctermbg=white ctermfg=darkgray cterm=NONE
    hi Search ctermbg=white ctermfg=darkgray cterm=NONE
    hi Directory ctermbg=white ctermfg=darkgray cterm=NONE
    hi MatchParen ctermbg=white ctermfg=darkgray cterm=NONE
    hi SpellBad ctermbg=white ctermfg=darkgray cterm=NONE
    hi SpellCap ctermbg=white ctermfg=darkgray cterm=NONE
    hi SpellLocal ctermbg=white ctermfg=darkgray cterm=NONE
    hi SpellRare ctermbg=white ctermfg=darkgray cterm=NONE
    hi ColorColumn ctermbg=white ctermfg=darkgray cterm=NONE
    hi SignColumn ctermbg=white ctermfg=darkgray cterm=NONE
    hi ErrorMsg ctermbg=white ctermfg=darkgray cterm=NONE
    hi ModeMsg ctermbg=white ctermfg=darkgray cterm=NONE
    hi MoreMsg ctermbg=white ctermfg=darkgray cterm=NONE
    hi Question ctermbg=white ctermfg=darkgray cterm=NONE
    hi Cursor ctermbg=white ctermfg=darkgray cterm=NONE
    hi CursorColumn ctermbg=white ctermfg=darkgray cterm=NONE
    hi QuickFixLine ctermbg=white ctermfg=darkgray cterm=NONE
endif

hi link Number Constant
hi link StatusLineTerm StatusLine
hi link StatusLineTermNC StatusLineNC
hi link WarningMsg Error

let g:terminal_ansi_colors = [
        \ '#1e2127',
        \ '#be5046',
        \ '#009688',
        \ '#d19a66',
        \ '#172030',
        \ '#9c27b0',
        \ '#528bff',
        \ '#515e77',
        \ '#2c313c',
        \ '#e06c75',
        \ '#98c379',
        \ '#e5c07b',
        \ '#61afef',
        \ '#c678dd',
        \ '#56b6c2',
        \ '#abb2bf',
        \ ]

" Generated with RNB (https://github.com/romainl/vim-rnb)
