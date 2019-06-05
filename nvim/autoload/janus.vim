fun! janus#dark() abort
  colorscheme schemer

  hi link illuminatedWord cursorline
  hi NerdtreeNC          guibg=#1e2127
  hi NerdtreeEndOfBuffer guifg=bg

  hi SilentStatusline    guifg=#A9B7C6 guibg=#2c323c
  hi SpySl               guifg=#1e2127 guibg=#A9B7C6
  hi SpySlInv            guifg=#A9B7C6 guibg=#818E9C
  hi LeftPrompt          guifg=#1e2127 guibg=#818E9C
  hi LeftPromptInv       guifg=#818E9C guibg=#657281
  hi GitPrompt           guifg=#1e2127 guibg=#657281
  hi GitPromptInv        guifg=#657281 guibg=#2c323c
  hi RightPrompt         guifg=#1e2127 guibg=#A9B7C6
  hi RightPromptInv      guifg=#A9B7C6 guibg=#2c323c

  hi SilentStatuslineNC  guifg=#A9B7C6 guibg=#2c323c
  hi SpySlNC             guifg=#1e2127 guibg=#818E9C
  hi SpySlInvNC          guifg=#818E9C guibg=#657281
  hi LeftPromptNC        guifg=#1e2127 guibg=#657281
  hi LeftPromptInvNC     guifg=#657281 guibg=#2c323c
  hi RightPromptNC       guifg=#1e2127 guibg=#818E9C
  hi RightPromptInvNC    guifg=#818E9C guibg=#2c323c

  " hi TabLine             guifg=#2B2B2B guibg=#A9B7C6
  " hi TabLineFill         guifg=#2B2B2B guibg=#1e2127
  " hi TabLineSel          guifg=#A9B7C6 guibg=#1e2127

  hi TestGroup guifg=#0061ff guibg=#ff9d00
endf

fun! janus#light() abort
  colorscheme lightnewscheme

  hi link illuminatedWord cursorline
  hi NerdtreeNC          guibg=#1e2127
  hi NerdtreeEndOfBuffer guifg=bg

  hi SilentStatusline    guifg=#A9B7C6 guibg=#2c323c
  hi SpySl               guifg=#1e2127 guibg=#A9B7C6
  hi LeftPrompt          guifg=#1e2127 guibg=#818E9C
  hi GitPrompt           guifg=#1e2127 guibg=#657281
  hi RightPrompt         guifg=#1e2127 guibg=#A9B7C6
  hi SpySlInv            guifg=#A9B7C6 guibg=#818E9C
  hi LeftPromptInv       guifg=#818E9C guibg=#657281
  hi GitPromptInv        guifg=#657281 guibg=#2c323c
  hi RightPromptInv      guifg=#A9B7C6 guibg=#2c323c

  " hi TabLine             guifg=#2B2B2B guibg=#A9B7C6
  " hi TabLineFill         guifg=#2B2B2B guibg=#1e2127
  " hi TabLineSel          guifg=#A9B7C6 guibg=#1e2127

  hi TestGroup guifg=#0061ff guibg=#ff9d00
endf
