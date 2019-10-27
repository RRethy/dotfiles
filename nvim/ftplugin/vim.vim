" set foldmethod=expr
" set foldlevel=2
set foldexpr=getline(v:lnum-1)=~#'^fu'&&getline(v:lnum)!~#'^endf'?'>1':getline(v:lnum)=~#'^endf'?'<1':'='
