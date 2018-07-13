" me:     Warez vim color
" Author:   Stechele Julien <julien.stechele@gmail.com>
" URL:      https://github.com/Fl4t/warez-colorscheme
" Created:  In the middle of the night
" Modified: 2011 Jun 01
" Note:     Bwarrr!

" Color
"       normal           Bright
"   black=#424242    black=#4E4E4E
"     red=#9E5A77      red=#CC6291
"   green=#348686    green=#65B5B5
"  yellow=#8F8FA9   yellow=#AFAFD4
"    blue=#4a6985     blue=#5B8EBF
" magenta=#735B9C  magenta=#9378BE
"    cyan=#42799D     cyan=#74A7CA
"   white=#9BACB0    white=#CBCBCB

" Initialize
" ----------------------------------------------------------------------
set background=dark
hi clear
if exists("syntax on")
    syntax reset
endif
let g:color_name="warez"

" Vim >= 7.0 Colours
" ----------------------------------------------------------------------
if version >= 700
  hi! CursorLine                 guifg=NONE      guibg=#191919   gui=NONE
  hi! CursorColumn               guifg=NONE      guibg=#191919   gui=NONE
  hi! MatchParen                 guifg=#afafd4   guibg=#735B9C   gui=NONE
  hi! Pmenu                      guifg=NONE      guibg=#191919   gui=NONE
  hi! PmenuSel                   guifg=NONE      guibg=#348686   gui=NONE
  hi! TabLine                    guifg=#191919   guibg=#424242   gui=NONE
  hi! TabLineFill                guifg=#191919   guibg=#424242   gui=NONE
  hi! TabLineSel                 guifg=#A5BBB5   guibg=#424242   gui=NONE
endif

" General Group Colours
" ----------------------------------------------------------------------
hi! Cursor                       guifg=#191919   guibg=#afafd4   gui=NONE
hi! CursorIM                     guifg=#191919   guibg=#afafd4   gui=NONE
hi! Directory                    guifg=#5B8EBF   guibg=NONE      gui=NONE
hi! DiffAdd                      guifg=#191919   guibg=#348686   gui=NONE
hi! DiffChange                   guifg=#191919   guibg=#735B9C   gui=NONE
hi! DiffDelete                   guifg=#191919   guibg=#9E5A77   gui=NONE
hi! DiffText                     guifg=#191919   guibg=#42799D   gui=NONE
hi! ErrorMsg                     guifg=#9E5A77   guibg=#191919   gui=NONE
hi! VertSplit                    guifg=NONE      guibg=#424242   gui=NONE
hi! Folded                       guifg=#A5BBB5   guibg=#191919   gui=NONE
hi! FoldColumn                   guifg=#A5BBB5   guibg=#191919   gui=NONE
hi! IncSearch                    guifg=#191919   guibg=#9E5A77   gui=NONE
hi! LineNr                       guifg=#4C4E4C   guibg=NONE      gui=NONE
hi! ModeMsg                      guifg=#8E78B8   guibg=NONE      gui=NONE
hi! MoreMsg                      guifg=#8E78B8   guibg=NONE      gui=NONE
hi! NonText                      guifg=#4E4E4E   guibg=NONE      gui=NONE
hi! Normal                       guifg=#A5BBB5   guibg=#191919   gui=NONE
hi! Question                     guifg=#CBCBCB   guibg=NONE      gui=NONE
hi! Search                       guifg=#191919   guibg=#9E5A77   gui=NONE
hi! SpecialKey                   guifg=#AFAFD4   guibg=NONE      gui=NONE
hi! StatusLine                   guifg=#A5BBB5   guibg=#424242   gui=NONE
hi! StatusLineNC                 guifg=#191919   guibg=#424242   gui=NONE
hi! Title                        guifg=#9378BE   guibg=NONE      gui=NONE
hi! Visual                       guifg=#191919   guibg=#4E4E4E   gui=NONE
hi! VisualNOS                    guifg=#191919   guibg=#4E4E4E   gui=NONE
hi! WarningMsg                   guifg=#191919   guibg=#4E4E4E   gui=NONE
hi! WildMenu                     guifg=#191919   guibg=#32867F   gui=NONE

" Syntax highlighting
" ----------------------------------------------------------------------
hi! Comment                      guifg=#4E4E4E   guibg=NONE      gui=NONE

hi! Constant                     guifg=#32867F   guibg=NONE      gui=NONE
hi! String                       guifg=#32867F   guibg=NONE      gui=NONE
hi! Character                    guifg=#32867F   guibg=NONE      gui=NONE
hi! Number                       guifg=#32867F   guibg=NONE      gui=NONE
hi! Boolean                      guifg=#32867F   guibg=NONE      gui=NONE
hi! Float                        guifg=#32867F   guibg=NONE      gui=NONE

hi! Identifier                   guifg=#65B5B5   guibg=NONE      gui=NONE
hi! Function                     guifg=#AFAFD4   guibg=NONE      gui=NONE

hi! Statement                    guifg=#486981   guibg=NONE      gui=NONE
hi! Conditional                  guifg=#486981   guibg=NONE      gui=NONE
hi! Repeat                       guifg=#486981   guibg=NONE      gui=NONE
hi! Label                        guifg=#486981   guibg=NONE      gui=NONE
hi! Operator                     guifg=#486981   guibg=NONE      gui=NONE
hi! Keyword                      guifg=#486981   guibg=NONE      gui=NONE
hi! Exception                    guifg=#486981   guibg=NONE      gui=NONE

hi! PreProc                      guifg=#62B5AF   guibg=NONE      gui=NONE
hi! Include                      guifg=#62B5AF   guibg=NONE      gui=NONE
hi! Define                       guifg=#62B5AF   guibg=NONE      gui=NONE
hi! Macro                        guifg=#62B5AF   guibg=NONE      gui=NONE
hi! PreCondit                    guifg=#62B5AF   guibg=NONE      gui=NONE

hi! Type                         guifg=#74A7CA   guibg=NONE      gui=NONE
hi! StorageClass                 guifg=#74A7CA   guibg=NONE      gui=NONE
hi! Structure                    guifg=#74A7CA   guibg=NONE      gui=NONE
hi! TypeDef                      guifg=#74A7CA   guibg=NONE      gui=NONE

hi! Special                      guifg=#AFAFD4   guibg=NONE      gui=NONE
hi! SpecialChar                  guifg=#AFAFD4   guibg=NONE      gui=NONE
hi! Tag                          guifg=#AFAFD4   guibg=NONE      gui=NONE
hi! Delimiter                    guifg=#AFAFD4   guibg=NONE      gui=NONE
hi! SpecialComment               guifg=#AFAFD4   guibg=NONE      gui=NONE
hi! Debug                        guifg=#AFAFD4   guibg=NONE      gui=NONE

hi! Underlined                   guifg=#486981   guibg=NONE      gui=NONE
hi! Ignore                       guifg=#4C4E4C   guibg=NONE      gui=NONE
hi! Error                        guifg=#4C4E4C   guibg=NONE      gui=NONE
hi! Todo                         guifg=#9E5A77   guibg=NONE      gui=NONE

" PHP Colours
" ----------------------------------------------------------------------
hi! link phpVarSelector identifier
hi! link phpIdentifier identifier
hi! link phpMethodsVar Structure
hi! link phpMethods Structure

" VIM Colours
" ----------------------------------------------------------------------
hi! link vimCommand Statement
hi! link vimIsCommand Identifier
hi! link vimVar PreProc
hi! link vimOper Identifier
hi! link vimHiGroup Type

" HTML Colours
" ----------------------------------------------------------------------
hi! link HtmltagName Statement
hi! link HtmlString Constant
hi! link HtmlTag Tag
hi! link HtmlEndTag Tag

" JAVASCRIPT Colours
" ----------------------------------------------------------------------
hi! link javaScriptNumber Number
hi! link javaScriptRegexpString String
hi! link javaScriptGlobal Constant
hi! link javaScriptOperator Operator
hi! link javaScriptIdentifier Identifier
hi! link javaScriptType Type
hi! link javaScriptConditional Conditional
hi! link javaScriptStatement Statement
hi! link javaScriptRepeat Repeat
