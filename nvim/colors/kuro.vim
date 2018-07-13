color file
" Maintainer: morumo
" Last Change: 2014/03/09

set bg=dark
hi clear
if exists("syntax_on")
    syntax reset
endif

let colors_name = "kuro"

hi Normal    guifg=white   guibg=black                    ctermfg=white       ctermbg=black
hi ErrorMsg  guifg=white   guibg=#287eff                  ctermfg=white       ctermbg=lightblue
hi Visual    guifg=#8080ff guibg=fg gui=reverse           ctermfg=lightblue   ctermbg=fg       cterm=reverse
hi VisualNOS guifg=#8080ff guibg=fg gui=reverse,underline ctermfg=lightblue   ctermbg=fg       cterm=reverse,underline
hi Todo      guifg=#d14a14 guibg=#1248d1                  ctermfg=red         ctermbg=darkblue
hi Search    guifg=#20ffff guibg=#2050d0                  ctermfg=white       ctermbg=darkblue cterm=underline term=underline
hi IncSearch guifg=#b0ffff guibg=#2050d0                  ctermfg=darkblue    ctermbg=gray

hi SpecialKey guifg=darkcyan           ctermfg=darkcyan
hi Directory  guifg=cyan               ctermfg=cyan
hi Title      guifg=magenta gui=bold   ctermfg=magenta cterm=bold
hi WarningMsg guifg=red                ctermfg=red
hi WildMenu   guifg=yellow guibg=black ctermfg=yellow ctermbg=black cterm=none term=none
hi ModeMsg    guifg=#22cce2            ctermfg=lightblue
hi MoreMsg    ctermfg=darkgreen        ctermfg=darkgreen
hi Question   guifg=green gui=none     ctermfg=green cterm=none
hi NonText    guifg=#0030ff            ctermfg=darkblue

hi StatusLine   guifg=blue  guibg=darkgray gui=none ctermfg=blue  ctermbg=gray term=none cterm=none
hi StatusLineNC guifg=black guibg=darkgray gui=none ctermfg=black ctermbg=gray term=none cterm=none
hi VertSplit    guifg=black guibg=darkgray gui=none ctermfg=black ctermbg=gray term=none cterm=none

hi Folded     guifg=#808080 guibg=black ctermfg=darkgrey ctermbg=black cterm=bold term=bold
hi FoldColumn guifg=#808080 guibg=black ctermfg=darkgrey ctermbg=black cterm=bold term=bold
hi LineNr     guifg=white               ctermfg=green                  cterm=none

hi DiffAdd    guibg=darkblue                     ctermbg=darkblue cterm=none term=none
hi DiffChange guibg=darkmagenta                  ctermbg=magenta  cterm=none
hi DiffDelete guifg=Blue guibg=DarkCyan gui=bold ctermbg=cyan ctermfg=blue
hi DiffText              guibg=Red      gui=bold ctermbg=red      cterm=bold

hi Cursor     guifg=yellow guibg=gray  ctermfg=yellow ctermbg=gray
hi lCursor    guifg=black  guibg=white ctermfg=black ctermbg=white

hi Comment    guifg=#00ff00   ctermfg=green
hi Constant   guifg=Red       ctermfg=red       cterm=none
hi Special    guifg=Orange    ctermfg=166       cterm=bold gui=bold
hi Identifier guifg=#5080ff   ctermfg=blue      cterm=none
hi Statement  guifg=#ffff60   ctermfg=yellow    cterm=bold gui=bold
hi PreProc    guifg=Orange    ctermfg=166       cterm=bold gui=bold
hi type       guifg=lightgrey ctermfg=lightgrey cterm=none gui=none

hi Underlined cterm=underline term=underline
hi Ignore     guifg=bg ctermfg=bg

hi Pmenu      guifg=#efefef guibg=#333333  ctermfg=black ctermbg=gray
hi PmenuSel   guifg=#101010 guibg=yellow   ctermfg=black ctermbg=yellow
hi PmenuSbar  guifg=blue    guibg=darkgray ctermfg=blue  ctermbg=darkgray
hi PmenuThumb guifg=#c0c0c0
