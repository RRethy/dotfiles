fun utils#pad(padding)
  exe 'norm i' . a:padding . 'la' . a:padding . '' . repeat('h', strlen(a:padding))
endf
