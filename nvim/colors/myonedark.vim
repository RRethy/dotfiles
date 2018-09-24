highlight clear

if has('termguicolors')
  set termguicolors " True colors babyyyyyy
endif

if ("syntax_on")
  syntax reset
endif

let g:colors_name = "myonedark"

" Vim editor color --------------------------------------------------------{{{

hi Normal       guifg=#abb2bf   guibg=#1e2127   gui=NONE
hi NormalNC     guifg=NONE      guibg=#2c323c   gui=NONE
hi bold         guifg=NONE      guibg=NONE      gui=bold
hi ColorColumn  guifg=NONE      guibg=#2c323c   gui=NONE
hi Conceal      guifg=#4b5263   guibg=#282c34   gui=NONE
" hi Cursor       guifg=NONE      guibg=#528bff   gui=NONE
hi Cursor       guifg=NONE      guibg=#abb2b5   gui=NONE
hi CursorIM     guifg=NONE      guibg=NONE      gui=NONE
hi CursorColumn guifg=NONE      guibg=#2c323c   gui=NONE
hi CursorLine   guifg=NONE      guibg=#2c323c  gui=NONE
hi Directory    guifg=#61afef   guibg=NONE      gui=NONE
hi ErrorMsg     guifg=#e06c75   guibg=#282c34  gui=NONE
hi VertSplit    guifg=#181a1f   guibg=NONE      gui=NONE
" hi Folded       guifg=#282c34   guibg=#5c6370  gui=NONE
" hi Folded       guifg=#1e2127 guibg=#818E9C   gui=NONE
hi Folded       guifg=#e5c07b   guibg=#313440   gui=NONE
hi FoldColumn   guifg=#5c6370   guibg=#1e2127   gui=NONE
hi IncSearch    guifg=NONE      guibg=#0c4260   gui=BOLD
" hi IncSearch    guifg=NONE      guibg=#000   gui=BOLD
hi Search       guifg=NONE      guibg=#0c4260   gui=NONE
hi LineNr       guifg=#4b5263   guibg=NONE      gui=NONE
hi CursorLineNr guifg=#abb2bf   guibg=#2c323c  gui=NONE
hi MatchParen   guifg=#e06c75   guibg=#2c323c  gui=underline,bold
hi Italic       guifg=NONE      guibg=NONE      gui=italic
hi ModeMsg      guifg=#abb2bf   guibg=NONE      gui=NONE
hi MoreMsg      guifg=#abb2bf   guibg=NONE      gui=NONE
hi NonText      guifg=#5c6370   guibg=NONE      gui=NONE
hi PMenu        guifg=NONE      guibg=#333841   gui=NONE
hi PMenuSel     guifg=NONE      guibg=#4b5263   gui=NONE
hi PMenuSbar    guifg=NONE      guibg=#282c34   gui=NONE
hi PMenuThumb   guifg=NONE      guibg=#abb2bf   gui=NONE
hi Question     guifg=#61afef   guibg=NONE      gui=NONE
hi SpecialKey   guifg=#3b4048   guibg=NONE      gui=NONE
hi Whitespace   guifg=#3b4048   guibg=NONE      gui=NONE
hi StatusLine   guifg=#abb2bf   guibg=#2c323c  gui=NONE
hi StatusLineNC guifg=#5c6370   guibg=NONE      gui=NONE " TODO
hi TabLine      guifg=#abb2bf   guibg=#282c34   gui=NONE
hi TabLineFill  guifg=#5c6370   guibg=#3e4452  gui=NONE
hi TabLineSel   guifg=#282c34   guibg=#61afef   gui=NONE
hi Title        guifg=#abb2bf   guibg=NONE      gui=bold
hi Visual       guifg=NONE      guibg=#3e4452   gui=NONE
hi VisualNOS    guifg=NONE      guibg=#3e4452   gui=NONE
hi WarningMsg   guifg=#e06c75   guibg=NONE      gui=NONE
hi TooLong      guifg=#e06c75   guibg=NONE      gui=NONE
hi WildMenu     guifg=#abb2bf   guibg=#5c6370   gui=NONE
hi SignColumn   guifg=NONE      guibg=#282c34   gui=NONE
hi Special      guifg=#61afef   guibg=NONE      gui=NONE
" }}}

" Vim Help highlighting ---------------------------------------------------{{{
hi helpCommand      guifg=#e5c07b   guibg=NONE      gui=NONE
hi helpExample      guifg=#e5c07b   guibg=NONE      gui=NONE
hi helpHeader       guifg=#abb2bf   guibg=NONE      gui=bold
hi helpSectionDelim guifg=#5c6370   guibg=NONE      gui=NONE
" }}}

" Standard syntax highlighting --------------------------------------------{{{
hi Comment        guifg=#5c6370         guibg=NONE          gui=italic
hi Constant       guifg=#98c379         guibg=NONE          gui=NONE
hi String         guifg=#98c379         guibg=NONE          gui=NONE
hi Character      guifg=#98c379         guibg=NONE          gui=NONE
hi Number         guifg=#d19a66         guibg=NONE          gui=NONE
hi Boolean        guifg=#d19a66         guibg=NONE          gui=NONE
hi Float          guifg=#d19a66         guibg=NONE          gui=NONE
hi Identifier     guifg=#e06c75         guibg=NONE          gui=NONE
hi Function       guifg=#61afef         guibg=NONE          gui=NONE
hi Statement      guifg=#c678dd         guibg=NONE          gui=NONE
hi Conditional    guifg=#c678dd         guibg=NONE          gui=NONE
hi Repeat         guifg=#c678dd         guibg=NONE          gui=NONE
hi Label          guifg=#c678dd         guibg=NONE          gui=NONE
hi Operator       guifg=#528bff         guibg=NONE          gui=NONE
hi Keyword        guifg=#e06c75         guibg=NONE          gui=NONE
hi Exception      guifg=#c678dd         guibg=NONE          gui=NONE
hi PreProc        guifg=#e5c07b         guibg=NONE          gui=NONE
hi Include        guifg=#61afef         guibg=NONE          gui=NONE
hi Define         guifg=#c678dd         guibg=NONE          gui=NONE
hi Macro          guifg=#c678dd         guibg=NONE          gui=NONE
hi PreCondit      guifg=#e5c07b         guibg=NONE          gui=NONE
hi Type           guifg=#e5c07b         guibg=NONE          gui=NONE
hi StorageClass   guifg=#e5c07b         guibg=NONE          gui=NONE
hi Structure      guifg=#e5c07b         guibg=NONE          gui=NONE
hi Typedef        guifg=#e5c07b         guibg=NONE          gui=NONE
hi Special        guifg=#61afef         guibg=NONE          gui=NONE
hi SpecialChar    guifg=NONE            guibg=NONE          gui=NONE
hi Tag            guifg=NONE            guibg=NONE          gui=NONE
hi Delimiter      guifg=NONE            guibg=NONE          gui=NONE
hi SpecialComment guifg=NONE            guibg=NONE          gui=NONE
hi Debug          guifg=NONE            guibg=NONE          gui=NONE
hi Underlined     guifg=NONE            guibg=NONE          gui=underline
hi Ignore         guifg=NONE            guibg=NONE          gui=NONE
hi Error          guifg=#e06c75         guibg=#282c34       gui=bold
hi Todo           guifg=#c678dd         guibg=#282c34       gui=NONE
" }}}

" Diff highlighting -------------------------------------------------------{{{
hi DiffAdd     guifg=#98c379 guibg=#3e4452 gui=NONE
hi DiffChange  guifg=#d19a66 guibg=#3e4452 gui=NONE
hi DiffDelete  guifg=#e06c75 guibg=#3e4452 gui=NONE
hi DiffText    guifg=#61afef guibg=#3e4452 gui=NONE
hi DiffAdded   guifg=#98c379 guibg=#3e4452 gui=NONE
hi DiffFile    guifg=#e06c75 guibg=#3e4452 gui=NONE
hi DiffNewFile guifg=#98c379 guibg=#3e4452 gui=NONE
hi DiffLine    guifg=#61afef guibg=#3e4452 gui=NONE
hi DiffRemoved guifg=#e06c75 guibg=#3e4452 gui=NONE
" }}}

" Asciidoc highlighting ---------------------------------------------------{{{
hi asciidocListingBlock   guifg=#828997  guibg=NONE gui=NONE
" }}}

" C/C++ highlighting ------------------------------------------------------{{{
hi cInclude           guifg=#c678dd  guibg=NONE gui=NONE
hi cPreCondit         guifg=#c678dd  guibg=NONE gui=NONE
hi cPreConditMatch    guifg=#c678dd  guibg=NONE gui=NONE

hi cType              guifg=#c678dd  guibg=NONE gui=NONE
hi cStorageClass      guifg=#c678dd  guibg=NONE gui=NONE
hi cStructure         guifg=#c678dd  guibg=NONE gui=NONE
hi cOperator          guifg=#c678dd  guibg=NONE gui=NONE
hi cStatement         guifg=#c678dd  guibg=NONE gui=NONE
hi cTODO              guifg=#c678dd  guibg=NONE gui=NONE
hi cConstant          guifg=#d19a66  guibg=NONE gui=NONE
hi cSpecial           guifg=#56b6c2  guibg=NONE gui=NONE
hi cSpecialCharacter  guifg=#56b6c2  guibg=NONE gui=NONE
hi cString            guifg=#98c379  guibg=NONE gui=NONE

hi cppType            guifg=#c678dd  guibg=NONE gui=NONE
hi cppStorageClass    guifg=#c678dd  guibg=NONE gui=NONE
hi cppStructure       guifg=#c678dd  guibg=NONE gui=NONE
hi cppModifier        guifg=#c678dd  guibg=NONE gui=NONE
hi cppOperator        guifg=#c678dd  guibg=NONE gui=NONE
hi cppAccess          guifg=#c678dd  guibg=NONE gui=NONE
hi cppStatement       guifg=#c678dd  guibg=NONE gui=NONE
hi cppConstant        guifg=#e06c75  guibg=NONE gui=NONE
hi cCppString         guifg=#98c379  guibg=NONE gui=NONE
" }}}

" Cucumber highlighting ---------------------------------------------------{{{
hi cucumberGiven           guifg=#61afef  guibg=NONE gui=NONE
hi cucumberWhen            guifg=#61afef  guibg=NONE gui=NONE
hi cucumberWhenAnd         guifg=#61afef  guibg=NONE gui=NONE
hi cucumberThen            guifg=#61afef  guibg=NONE gui=NONE
hi cucumberThenAnd         guifg=#61afef  guibg=NONE gui=NONE
hi cucumberUnparsed        guifg=#d19a66  guibg=NONE gui=NONE
hi cucumberFeature         guifg=#e06c75  guibg=NONE gui=bold
hi cucumberBackground      guifg=#c678dd  guibg=NONE gui=bold
hi cucumberScenario        guifg=#c678dd  guibg=NONE gui=bold
hi cucumberScenarioOutline guifg=#c678dd  guibg=NONE gui=bold
hi cucumberTags            guifg=#5c6370 guibg=NONE gui=bold
hi cucumberDelimiter       guifg=#5c6370 guibg=NONE gui=bold
" }}}

" CSS/Sass highlighting ---------------------------------------------------{{{
hi cssAttrComma         guifg=#c678dd  guibg=NONE gui=NONE
hi cssAttributeSelector guifg=#98c379  guibg=NONE gui=NONE
hi cssBraces            guifg=#828997 guibg=NONE gui=NONE
hi cssClassName         guifg=#d19a66  guibg=NONE gui=NONE
hi cssClassNameDot      guifg=#d19a66  guibg=NONE gui=NONE
hi cssDefinition        guifg=#c678dd  guibg=NONE gui=NONE
hi cssFontAttr          guifg=#d19a66  guibg=NONE gui=NONE
hi cssFontDescriptor    guifg=#c678dd  guibg=NONE gui=NONE
hi cssFunctionName      guifg=#61afef  guibg=NONE gui=NONE
hi cssIdentifier        guifg=#61afef  guibg=NONE gui=NONE
hi cssImportant         guifg=#c678dd  guibg=NONE gui=NONE
hi cssInclude           guifg=#abb2bf guibg=NONE gui=NONE
hi cssIncludeKeyword    guifg=#c678dd  guibg=NONE gui=NONE
hi cssMediaType         guifg=#d19a66  guibg=NONE gui=NONE
hi cssProp              guifg=#56b6c2  guibg=NONE gui=NONE
hi cssPseudoClassId     guifg=#d19a66  guibg=NONE gui=NONE
hi cssSelectorOp        guifg=#c678dd  guibg=NONE gui=NONE
hi cssSelectorOp2       guifg=#c678dd  guibg=NONE gui=NONE
hi cssStringQ           guifg=#98c379  guibg=NONE gui=NONE
hi cssStringQQ          guifg=#98c379  guibg=NONE gui=NONE
hi cssTagName           guifg=#e06c75  guibg=NONE gui=NONE
hi cssAttr              guifg=#d19a66  guibg=NONE gui=NONE

hi sassAmpersand      guifg=#e06c75   guibg=NONE gui=NONE
hi sassClass          guifg=#e5c07b guibg=NONE gui=NONE
hi sassControl        guifg=#c678dd   guibg=NONE gui=NONE
hi sassExtend         guifg=#c678dd   guibg=NONE gui=NONE
hi sassFor            guifg=#abb2bf  guibg=NONE gui=NONE
hi sassProperty       guifg=#56b6c2   guibg=NONE gui=NONE
hi sassFunction       guifg=#56b6c2   guibg=NONE gui=NONE
hi sassId             guifg=#61afef   guibg=NONE gui=NONE
hi sassInclude        guifg=#c678dd   guibg=NONE gui=NONE
hi sassMedia          guifg=#c678dd   guibg=NONE gui=NONE
hi sassMediaOperators guifg=#abb2bf  guibg=NONE gui=NONE
hi sassMixin          guifg=#c678dd   guibg=NONE gui=NONE
hi sassMixinName      guifg=#61afef   guibg=NONE gui=NONE
hi sassMixing         guifg=#c678dd   guibg=NONE gui=NONE

hi scssSelectorName   guifg=#e5c07b guibg=NONE gui=NONE
" }}}

" Elixir highlighting------------------------------------------------------{{{
hi link elixirModuleDefine Define
hi elixirAlias             guifg=#e5c07b guibg=NONE gui=NONE
hi elixirAtom              guifg=#56b6c2   guibg=NONE gui=NONE
hi elixirBlockDefinition   guifg=#c678dd   guibg=NONE gui=NONE
hi elixirModuleDeclaration guifg=#d19a66   guibg=NONE gui=NONE
hi elixirInclude           guifg=#e06c75   guibg=NONE gui=NONE
hi elixirOperator          guifg=#d19a66   guibg=NONE gui=NONE
" }}}

" Git and git related plugins highlighting --------------------------------{{{
hi gitcommitComment       guifg=#5c6370  guibg=NONE gui=italic
hi gitcommitUnmerged      guifg=#98c379   guibg=NONE gui=NONE
hi gitcommitOnBranch      guifg=NONE guibg=NONE gui=NONE
hi gitcommitBranch        guifg=#c678dd   guibg=NONE gui=NONE
hi gitcommitDiscardedType guifg=#e06c75   guibg=NONE gui=NONE
hi gitcommitSelectedType  guifg=#98c379   guibg=NONE gui=NONE
hi gitcommitHeader        guifg=NONE guibg=NONE gui=NONE
hi gitcommitUntrackedFile guifg=#56b6c2   guibg=NONE gui=NONE
hi gitcommitDiscardedFile guifg=#e06c75   guibg=NONE gui=NONE
hi gitcommitSelectedFile  guifg=#98c379   guibg=NONE gui=NONE
hi gitcommitUnmergedFile  guifg=#e5c07b guibg=NONE gui=NONE
hi gitcommitFile          guifg=NONE guibg=NONE gui=NONE
hi link gitcommitNoBranch       gitcommitBranch
hi link gitcommitUntracked      gitcommitComment
hi link gitcommitDiscarded      gitcommitComment
hi link gitcommitSelected       gitcommitComment
hi link gitcommitDiscardedArrow gitcommitDiscardedFile
hi link gitcommitSelectedArrow  gitcommitSelectedFile
hi link gitcommitUnmergedArrow  gitcommitUnmergedFile

hi SignifySignAdd    guifg=#98c379   guibg=NONE gui=NONE
hi SignifySignChange guifg=#e5c07b guibg=NONE gui=NONE
hi SignifySignDelete guifg=#e06c75   guibg=NONE gui=NONE
hi link GitGutterAdd    SignifySignAdd
hi link GitGutterChange SignifySignChange
hi link GitGutterDelete SignifySignDelete
hi diffAdded         guifg=#98c379   guibg=NONE gui=NONE
hi diffRemoved       guifg=#e06c75   guibg=NONE gui=NONE
" }}}

" Go highlighting ---------------------------------------------------------{{{
hi goDeclaration         guifg=#c678dd guibg=NONE gui=NONE
hi goField               guifg=#e06c75 guibg=NONE gui=NONE
hi goMethod              guifg=#56b6c2 guibg=NONE gui=NONE
hi goType                guifg=#c678dd guibg=NONE gui=NONE
hi goUnsignedInts        guifg=#56b6c2 guibg=NONE gui=NONE
" }}}

" Haskell highlighting ----------------------------------------------------{{{
hi haskellDeclKeyword    guifg=#61afef guibg=NONE gui=NONE
hi haskellType           guifg=#98c379 guibg=NONE gui=NONE
hi haskellWhere          guifg=#e06c75 guibg=NONE gui=NONE
hi haskellImportKeywords guifg=#61afef guibg=NONE gui=NONE
hi haskellOperators      guifg=#e06c75 guibg=NONE gui=NONE
hi haskellDelimiter      guifg=#61afef guibg=NONE gui=NONE
hi haskellIdentifier     guifg=#d19a66 guibg=NONE gui=NONE
hi haskellKeyword        guifg=#e06c75 guibg=NONE gui=NONE
hi haskellNumber         guifg=#56b6c2 guibg=NONE gui=NONE
hi haskellString         guifg=#56b6c2 guibg=NONE gui=NONE
"}}}

" HTML highlighting -------------------------------------------------------{{{
hi htmlArg            guifg=#d19a66  guibg=NONE gui=NONE
hi htmlTagName        guifg=#e06c75  guibg=NONE gui=NONE
hi htmlTagN           guifg=#e06c75  guibg=NONE gui=NONE
hi htmlSpecialTagName guifg=#e06c75  guibg=NONE gui=NONE
hi htmlTag            guifg=#828997 guibg=NONE gui=NONE
hi htmlEndTag         guifg=#828997 guibg=NONE gui=NONE

hi MatchTag   guifg=#e06c75         guibg=#2c323c  gui=underline,bold
" }}}

" JavaScript highlighting -------------------------------------------------{{{
hi coffeeString           guifg=#98c379   guibg=NONE gui=NONE

hi javaScriptBraces       guifg=#828997  guibg=NONE gui=NONE
hi javaScriptFunction     guifg=#c678dd   guibg=NONE gui=NONE
hi javaScriptIdentifier   guifg=#c678dd   guibg=NONE gui=NONE
hi javaScriptNull         guifg=#d19a66   guibg=NONE gui=NONE
hi javaScriptNumber       guifg=#d19a66   guibg=NONE gui=NONE
hi javaScriptRequire      guifg=#56b6c2   guibg=NONE gui=NONE
hi javaScriptReserved     guifg=#c678dd   guibg=NONE gui=NONE
" https://github.com/pangloss/vim-javascript
hi jsArrowFunction        guifg=#c678dd   guibg=NONE gui=NONE
hi jsBraces               guifg=#828997  guibg=NONE gui=NONE
hi jsClassBraces          guifg=#828997  guibg=NONE gui=NONE
hi jsClassKeywords        guifg=#c678dd   guibg=NONE gui=NONE
hi jsDocParam             guifg=#61afef   guibg=NONE gui=NONE
hi jsDocTags              guifg=#c678dd   guibg=NONE gui=NONE
hi jsFuncBraces           guifg=#828997  guibg=NONE gui=NONE
hi jsFuncCall             guifg=#61afef   guibg=NONE gui=NONE
hi jsFuncParens           guifg=#828997  guibg=NONE gui=NONE
hi jsFunction             guifg=#c678dd   guibg=NONE gui=NONE
hi jsGlobalObjects        guifg=#e5c07b guibg=NONE gui=NONE
hi jsModuleWords          guifg=#c678dd   guibg=NONE gui=NONE
hi jsModules              guifg=#c678dd   guibg=NONE gui=NONE
hi jsNoise                guifg=#828997  guibg=NONE gui=NONE
hi jsNull                 guifg=#d19a66   guibg=NONE gui=NONE
hi jsOperator             guifg=#c678dd   guibg=NONE gui=NONE
hi jsParens               guifg=#828997  guibg=NONE gui=NONE
hi jsStorageClass         guifg=#c678dd   guibg=NONE gui=NONE
hi jsTemplateBraces       guifg=#be5046 guibg=NONE gui=NONE
hi jsTemplateVar          guifg=#98c379   guibg=NONE gui=NONE
hi jsThis                 guifg=#e06c75   guibg=NONE gui=NONE
hi jsUndefined            guifg=#d19a66   guibg=NONE gui=NONE
hi jsObjectValue          guifg=#61afef   guibg=NONE gui=NONE
hi jsObjectKey            guifg=#56b6c2   guibg=NONE gui=NONE
hi jsReturn               guifg=#c678dd   guibg=NONE gui=NONE
" https://github.com/othree/yajs.vim
hi javascriptArrowFunc    guifg=#c678dd   guibg=NONE gui=NONE
hi javascriptClassExtends guifg=#c678dd   guibg=NONE gui=NONE
hi javascriptClassKeyword guifg=#c678dd   guibg=NONE gui=NONE
hi javascriptDocNotation  guifg=#c678dd   guibg=NONE gui=NONE
hi javascriptDocParamName guifg=#61afef   guibg=NONE gui=NONE
hi javascriptDocTags      guifg=#c678dd   guibg=NONE gui=NONE
hi javascriptEndColons    guifg=#5c6370  guibg=NONE gui=NONE
hi javascriptExport       guifg=#c678dd   guibg=NONE gui=NONE
hi javascriptFuncArg      guifg=#abb2bf  guibg=NONE gui=NONE
hi javascriptFuncKeyword  guifg=#c678dd   guibg=NONE gui=NONE
hi javascriptIdentifier   guifg=#e06c75   guibg=NONE gui=NONE
hi javascriptImport       guifg=#c678dd   guibg=NONE gui=NONE
hi javascriptObjectLabel  guifg=#abb2bf  guibg=NONE gui=NONE
hi javascriptOpSymbol     guifg=#56b6c2   guibg=NONE gui=NONE
hi javascriptOpSymbols    guifg=#56b6c2   guibg=NONE gui=NONE
hi javascriptPropertyName guifg=#98c379   guibg=NONE gui=NONE
hi javascriptTemplateSB   guifg=#be5046 guibg=NONE gui=NONE
hi javascriptVariable     guifg=#c678dd   guibg=NONE gui=NONE
" }}}

" JSON highlighting -------------------------------------------------------{{{
hi jsonCommentError         guifg=#abb2bf  guibg=NONE gui=NONE
hi jsonKeyword              guifg=#e06c75   guibg=NONE gui=NONE
hi jsonQuote                guifg=#5c6370  guibg=NONE gui=NONE
hi jsonTrailingCommaError   guifg=#e06c75   guibg=NONE gui=reverse
hi jsonMissingCommaError    guifg=#e06c75   guibg=NONE gui=reverse
hi jsonNoQuotesError        guifg=#e06c75   guibg=NONE gui=reverse
hi jsonNumError             guifg=#e06c75   guibg=NONE gui=reverse
hi jsonString               guifg=#98c379   guibg=NONE gui=NONE
hi jsonBoolean              guifg=#c678dd   guibg=NONE gui=NONE
hi jsonNumber               guifg=#d19a66   guibg=NONE gui=NONE
hi jsonStringSQError        guifg=#e06c75   guibg=NONE gui=reverse
hi jsonSemicolonError       guifg=#e06c75   guibg=NONE gui=reverse
" }}}

" Markdown highlighting ---------------------------------------------------{{{
hi markdownUrl              guifg=#5c6370  guibg=NONE gui=NONE
hi markdownBold             guifg=#d19a66   guibg=NONE gui=bold
hi markdownItalic           guifg=#d19a66   guibg=NONE gui=bold
hi markdownCode             guifg=#98c379   guibg=NONE gui=NONE
hi markdownCodeBlock        guifg=#e06c75   guibg=NONE gui=NONE
hi markdownCodeDelimiter    guifg=#98c379   guibg=NONE gui=NONE
hi markdownHeadingDelimiter guifg=#be5046 guibg=NONE gui=NONE
hi markdownH1               guifg=#e06c75   guibg=NONE gui=NONE
hi markdownH2               guifg=#e06c75   guibg=NONE gui=NONE
hi markdownH3               guifg=#e06c75   guibg=NONE gui=NONE
hi markdownH3               guifg=#e06c75   guibg=NONE gui=NONE
hi markdownH4               guifg=#e06c75   guibg=NONE gui=NONE
hi markdownH5               guifg=#e06c75   guibg=NONE gui=NONE
hi markdownH6               guifg=#e06c75   guibg=NONE gui=NONE
hi markdownListMarker       guifg=#e06c75   guibg=NONE gui=NONE
" }}}

" PHP highlighting --------------------------------------------------------{{{
hi phpClass        guifg=#e5c07b guibg=NONE gui=NONE
hi phpFunction     guifg=#61afef   guibg=NONE gui=NONE
hi phpFunctions    guifg=#61afef   guibg=NONE gui=NONE
hi phpInclude      guifg=#c678dd   guibg=NONE gui=NONE
hi phpKeyword      guifg=#c678dd   guibg=NONE gui=NONE
hi phpParent       guifg=#5c6370  guibg=NONE gui=NONE
hi phpType         guifg=#c678dd   guibg=NONE gui=NONE
hi phpSuperGlobals guifg=#e06c75   guibg=NONE gui=NONE
" }}}

" Pug (Formerly Jade) highlighting ----------------------------------------{{{
hi pugAttributesDelimiter   guifg=#d19a66    guibg=NONE gui=NONE
hi pugClass                 guifg=#d19a66    guibg=NONE gui=NONE
hi pugDocType               guifg=#5c6370    guibg=NONE gui=NONE
hi pugTag                   guifg=#e06c75    guibg=NONE gui=NONE
" }}}

" PureScript highlighting -------------------------------------------------{{{
hi purescriptKeyword          guifg=#c678dd     guibg=NONE gui=NONE
hi purescriptModuleName       guifg=#abb2bf guibg=NONE gui=NONE
hi purescriptIdentifier       guifg=#abb2bf guibg=NONE gui=NONE
hi purescriptType             guifg=#e5c07b   guibg=NONE gui=NONE
hi purescriptTypeVar          guifg=#e06c75     guibg=NONE gui=NONE
hi purescriptConstructor      guifg=#e06c75     guibg=NONE gui=NONE
hi purescriptOperator         guifg=#abb2bf guibg=NONE gui=NONE
" }}}

" Python highlighting -----------------------------------------------------{{{
hi pythonImport               guifg=#c678dd     guibg=NONE gui=NONE
hi pythonBuiltin              guifg=#56b6c2     guibg=NONE gui=NONE
hi pythonStatement            guifg=#c678dd     guibg=NONE gui=NONE
hi pythonParam                guifg=#d19a66     guibg=NONE gui=NONE
hi pythonEscape               guifg=#e06c75     guibg=NONE gui=NONE
hi pythonSelf                 guifg=#828997     guibg=NONE gui=NONE
hi pythonClass                guifg=#61afef     guibg=NONE gui=NONE
hi pythonOperator             guifg=#c678dd     guibg=NONE gui=NONE
hi pythonEscape               guifg=#e06c75     guibg=NONE gui=NONE
hi pythonFunction             guifg=#61afef     guibg=NONE gui=NONE
hi pythonKeyword              guifg=#61afef     guibg=NONE gui=NONE
hi pythonModule               guifg=#c678dd     guibg=NONE gui=NONE
hi pythonStringDelimiter      guifg=#98c379     guibg=NONE gui=NONE
hi pythonSymbol               guifg=#56b6c2     guibg=NONE gui=NONE
" }}}

" Ruby highlighting -------------------------------------------------------{{{
hi rubyBlock                     guifg=#c678dd   guibg=NONE gui=NONE
hi rubyBlockParameter            guifg=#e06c75   guibg=NONE gui=NONE
hi rubyBlockParameterList        guifg=#e06c75   guibg=NONE gui=NONE
hi rubyCapitalizedMethod         guifg=#c678dd   guibg=NONE gui=NONE
hi rubyClass                     guifg=#c678dd   guibg=NONE gui=NONE
hi rubyConstant                  guifg=#e5c07b guibg=NONE gui=NONE
hi rubyControl                   guifg=#c678dd   guibg=NONE gui=NONE
hi rubyDefine                    guifg=#c678dd   guibg=NONE gui=NONE
hi rubyEscape                    guifg=#e06c75   guibg=NONE gui=NONE
hi rubyFunction                  guifg=#61afef   guibg=NONE gui=NONE
hi rubyGlobalVariable            guifg=#e06c75   guibg=NONE gui=NONE
hi rubyInclude                   guifg=#61afef   guibg=NONE gui=NONE
hi rubyIncluderubyGlobalVariable guifg=#e06c75   guibg=NONE gui=NONE
hi rubyInstanceVariable          guifg=#e06c75   guibg=NONE gui=NONE
hi rubyInterpolation             guifg=#56b6c2   guibg=NONE gui=NONE
hi rubyInterpolationDelimiter    guifg=#e06c75   guibg=NONE gui=NONE
hi rubyKeyword                   guifg=#61afef   guibg=NONE gui=NONE
hi rubyModule                    guifg=#c678dd   guibg=NONE gui=NONE
hi rubyPseudoVariable            guifg=#e06c75   guibg=NONE gui=NONE
hi rubyRegexp                    guifg=#56b6c2   guibg=NONE gui=NONE
hi rubyRegexpDelimiter           guifg=#56b6c2   guibg=NONE gui=NONE
hi rubyStringDelimiter           guifg=#98c379   guibg=NONE gui=NONE
hi rubySymbol                    guifg=#56b6c2   guibg=NONE gui=NONE
" }}}

" Spelling highlighting ---------------------------------------------------{{{
hi SpellBad     guifg=NONE guibg=#282c34 gui=undercurl
hi SpellLocal   guifg=NONE guibg=#282c34 gui=undercurl
hi SpellCap     guifg=NONE guibg=#282c34 gui=undercurl
hi SpellRare    guifg=NONE guibg=#282c34 gui=undercurl
" }}}

" Vim highlighting --------------------------------------------------------{{{
hi vimCommand      guifg=#c678dd  guibg=NONE gui=NONE
hi vimCommentTitle guifg=#5c6370 guibg=NONE gui=bold
hi vimComment guifg=#5c6370         guibg=NONE          gui=italic
hi vimFunction     guifg=#56b6c2  guibg=NONE gui=NONE
hi vimFuncName     guifg=#c678dd  guibg=NONE gui=NONE
hi vimHighlight    guifg=#61afef  guibg=NONE gui=NONE
hi vimLineComment  guifg=#5c6370 guibg=NONE gui=italic
hi vimParenSep     guifg=#828997 guibg=NONE gui=NONE
hi vimSep          guifg=#828997 guibg=NONE gui=NONE
hi vimUserFunc     guifg=#56b6c2  guibg=NONE gui=NONE
hi vimVar          guifg=#e06c75  guibg=NONE gui=NONE
" }}}

" XML highlighting --------------------------------------------------------{{{
hi xmlAttrib  guifg=#e5c07b guibg=NONE gui=NONE
hi xmlEndTag  guifg=#e06c75   guibg=NONE gui=NONE
hi xmlTag     guifg=#e06c75   guibg=NONE gui=NONE
hi xmlTagName guifg=#e06c75   guibg=NONE gui=NONE
" }}}

" ZSH highlighting --------------------------------------------------------{{{
hi zshCommands     guifg=#abb2bf guibg=NONE gui=NONE
hi zshDeref        guifg=#e06c75     guibg=NONE gui=NONE
hi zshShortDeref   guifg=#e06c75     guibg=NONE gui=NONE
hi zshFunction     guifg=#56b6c2     guibg=NONE gui=NONE
hi zshKeyword      guifg=#c678dd     guibg=NONE gui=NONE
hi zshSubst        guifg=#e06c75     guibg=NONE gui=NONE
hi zshSubstDelim   guifg=#5c6370    guibg=NONE gui=NONE
hi zshTypes        guifg=#c678dd     guibg=NONE gui=NONE
hi zshVariableDef  guifg=#d19a66     guibg=NONE gui=NONE
" }}}

" Rust highlighting -------------------------------------------------------{{{
hi rustExternCrate          guifg=#e06c75    guibg=NONE gui=bold
hi rustIdentifier           guifg=#61afef    guibg=NONE gui=NONE
hi rustDeriveTrait          guifg=#98c379    guibg=NONE gui=NONE
hi SpecialComment           guifg=#5c6370    guibg=NONE gui=NONE
hi rustCommentLine          guifg=#5c6370    guibg=NONE gui=NONE
hi rustCommentLineDoc       guifg=#5c6370    guibg=NONE gui=NONE
hi rustCommentLineDocError  guifg=#5c6370    guibg=NONE gui=NONE
hi rustCommentBlock         guifg=#5c6370    guibg=NONE gui=NONE
hi rustCommentBlockDoc      guifg=#5c6370    guibg=NONE gui=NONE
hi rustCommentBlockDocError guifg=#5c6370    guibg=NONE gui=NONE
" }}}

" man highlighting --------------------------------------------------------{{{
hi link manTitle String
hi manFooter guifg=#5c6370 guibg=NONE gui=NONE
" }}}

" my highlight groups --------------------------------------------------------{{{
" }}}

" Neovim Terminal Colors --------------------------------------------------{{{
let g:terminal_color_0  = "#353a44"
let g:terminal_color_8  = "#353a44"
let g:terminal_color_1  = "#e88388"
let g:terminal_color_9  = "#e88388"
let g:terminal_color_2  = "#a7cc8c"
let g:terminal_color_10 = "#a7cc8c"
let g:terminal_color_3  = "#ebca8d"
let g:terminal_color_11 = "#ebca8d"
let g:terminal_color_4  = "#72bef2"
let g:terminal_color_12 = "#72bef2"
let g:terminal_color_5  = "#d291e4"
let g:terminal_color_13 = "#d291e4"
let g:terminal_color_6  = "#65c2cd"
let g:terminal_color_14 = "#65c2cd"
let g:terminal_color_7  = "#e3e5e9"
let g:terminal_color_15 = "#e3e5e9"
"}}}

" ALE (Asynchronous Lint Engine) highlighting -----------------------------{{{
hi ALEWarningSign guifg=#e5c07b guibg=NONE gui=NONE
hi ALEErrorSign guifg=#e06c75   guibg=NONE gui=NONE
" }}}

set background=dark

" vim: set fdl=1 fdm=marker:
