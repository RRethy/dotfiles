call matchadd('CursorLine', '\v\s+$', 1, 1254)

command! StripWhitespace  %s/\v\s+$//g
