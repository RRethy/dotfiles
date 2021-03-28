vim.call('backpack#init')

local tsconfigs   = require('nvim-treesitter.configs')
local colorscheme = require('colorscheme')         -- base16 colorscheme library
local hotline     = require('hotline')             -- minimal statusline/tabline lua wrapper
local illuminate  = require('illuminate')          -- improved textDocument/documentHighlight for lsp
local sourcerer   = require('sourcerer')           -- sources my init.lua across Neovim instances
local kitty       = require('rrethy.kitty')        -- controls for kitty terminal
local lsp         = require('rrethy.lsp')          -- my lsp configurations
local notif       = require('rrethy.notification') -- publish notifications in floats
local nvim        = require('rrethy.nvim')         -- mapping and option wrappers

vim.g.mapleader = ' '

local themes = vim.tbl_keys(colorscheme.colorschemes)
table.sort(themes)
vim.tbl_add_reverse_lookup(themes)
local theme_index = themes['gruvbox-dark-pale']
colorscheme.setup(themes[theme_index])
kitty.set_colors(themes[theme_index])
nvim.nnoremap('<c-f>', function()
    theme_index = (theme_index % #themes) + 1
    colorscheme.setup(themes[theme_index])
    kitty.set_colors(themes[theme_index])
    notif.notify(themes[theme_index])
end)
nvim.nnoremap('<c-b>', function()
    theme_index = ((theme_index - 2) % #themes) + 1
    colorscheme.setup(themes[theme_index])
    kitty.set_colors(themes[theme_index])
    notif.notify(themes[theme_index])
end)

lsp.setup {
    'sumneko_lua',
    'rust_analyzer',
    'gopls',
    'dartls',
    'cssls',
    'jsonls',
    'vimls',
}

tsconfigs.setup {
    ensure_installed = "all",
    highlight = {
        enable = true,
    },
}

sourcerer.setup()

if vim.fn.isdirectory('/usr/local/opt/fzf') then
    nvim.set('runtimepath+=/usr/local/opt/fzf')
end
nvim.set('inccommand=nosplit')
nvim.set('ignorecase')
nvim.set('smartcase')
nvim.set('number')
nvim.set('numberwidth=3')
nvim.set('updatetime=250')
nvim.set('noshowcmd')
nvim.set('iskeyword+=-')
nvim.set('hidden')
nvim.set('tabstop=4')
nvim.set('softtabstop=4')
nvim.set('shiftround')
nvim.set('shiftwidth=4')
nvim.set('expandtab')
nvim.set('nowrap')
nvim.set('mouse=a')
nvim.set('sidescroll=10')
nvim.set('scrolloff=1')
nvim.set('whichwrap=[,]')
nvim.set('cmdheight=1')
nvim.set('splitright')
nvim.set('noshowmode')
nvim.set('noruler')
nvim.set('showmatch')
nvim.set('matchtime=5')
nvim.set('spelllang=en_ca')
nvim.set('shortmess+=Ic')
nvim.set('nostartofline')
nvim.set('backup')
nvim.set('backupdir=~/.local/share/nvim/backup')
nvim.set('lazyredraw')
nvim.set('grepprg=rg\\ --smart-case\\ --vimgrep\\ $*')
nvim.set('grepformat=%f:%l:%c:%m')
nvim.set('cpoptions+=>')
nvim.set('completeopt=menu')
nvim.set('hlsearch')
nvim.set('pumblend=10')
nvim.set('signcolumn=number')
nvim.set('dictionary+=/usr/share/dict/words')
nvim.set('diffopt+=hiddenoff')
nvim.set('showtabline=1')
nvim.set('timeoutlen=250')
nvim.set('ttimeoutlen=-1')
nvim.set('equalalways')
nvim.set('termguicolors')

vim.o.statusline = hotline.format {
    ' ',
    function() return string.format('%d', vim.fn.bufnr()) end,
    ' ',
    function() return #vim.bo.filetype == 0 and '' or string.format('[%s]', vim.bo.filetype) end,
    ' ',
    function() return string.format('%s', vim.fn.fnamemodify(vim.fn.bufname(), ':t')) end,
    ' ',
    function() return vim.bo.readonly and '[readonly]' or '' end,
    '%1*',
    function() return not vim.tbl_isempty(vim.lsp.buf_get_clients(0)) and string.format('  %d ', vim.lsp.diagnostic.get_count(0, 'Error')) or '' end,
    '%2*',
    function() return not vim.tbl_isempty(vim.lsp.buf_get_clients(0)) and string.format('  %d ', vim.lsp.diagnostic.get_count(0, 'Warning')) or '' end,
    '%3*',
    function() return not vim.tbl_isempty(vim.lsp.buf_get_clients(0)) and string.format('  %d ', vim.lsp.diagnostic.get_count(0, 'Information')) or '' end,
    '%4*',
    function() return not vim.tbl_isempty(vim.lsp.buf_get_clients(0)) and string.format('  %d ', vim.lsp.diagnostic.get_count(0, 'Hint')) or '' end,
    '%0*',
    '%=',
    ' %20(%-9(%4l/%-4L%) %5( %-3c%) %-4(%3p%%%)%) ',
}

vim.cmd [[ augroup rrethy ]]
vim.cmd [[ autocmd! ]]
vim.cmd [[     autocmd FileType c,cpp,java setlocal commentstring=//\ %s ]]
vim.cmd [[     autocmd TextYankPost * lua require'vim.highlight'.on_yank({timeout=250}) ]]
vim.cmd [[     autocmd BufNewFile *.tex 0r!cat ~/.config/nvim/skeletons/latex.skel ]]
vim.cmd [[ augroup END ]]

vim.fn.mkdir(vim.env.HOME..'/.local/share/nvim/backup/', 'p')

nvim.nnoremap('<a-n>', function() illuminate.next_reference{wrap=true} end)
nvim.nnoremap('<a-p>', function() illuminate.next_reference{reverse=true,wrap=true} end)

nvim.nnoremap('yow', function()
    if nvim.wo.wrap then
        nvim.wo.wrap = false
        nvim.wo.linebreak = false
        nvim.api.nvim_buf_del_keymap(0, 'n', 'j')
        nvim.api.nvim_buf_del_keymap(0, 'n', 'k')
    else
        nvim.wo.wrap = true
        nvim.wo.linebreak = true
        nvim.nnoremap('j', 'gj', {'buffer'})
        nvim.nnoremap('k', 'gk', {'buffer'})
    end
end)

local toggle = require('rrethy.toggle')
nvim.nnoremap('yon', function() toggle.toggle_opt('number', 'win') end)
nvim.nnoremap('yor', function() toggle.toggle_opt('relativenumber', 'win') end)
nvim.nnoremap('yoc', function() toggle.toggle_opt('cursorcolumn', 'win') end)
nvim.nnoremap('yoh', function() toggle.echom_toggle_opt('hlsearch', 'global') end)
nvim.nnoremap('yos', function() toggle.echom_toggle_opt('spell', 'win') end)
nvim.nnoremap('yob', function() toggle.echom_toggle_opt('scrollbind', 'win') end)

nvim.nnoremap('<c-w>t', '<cmd>tabnew<cr>')
nvim.nnoremap('cl', '0D')
nvim.nnoremap('Y', 'y$')
nvim.nnoremap("'", '`')
nvim.nnoremap('<A-l>', '2zl')
nvim.nnoremap('<A-h>', '2zh')
nvim.nnoremap('g8', '<cmd>norm! *N<cr>')
nvim.nnoremap('<left>', 'gT')
nvim.nnoremap('<right>', 'gt')
nvim.nnoremap('<backspace>', '<c-^>')
nvim.nnoremap('<c-s>', [[:%s/\C\<<c-r><c-w>\>/]])
nvim.nnoremap('<c-p>', '<cmd>Files<cr>')
nvim.nnoremap('g>', '<cmd>20messages<cr>')
nvim.nnoremap('n', '"Nn"[v:searchforward]', {'expr'})
nvim.nnoremap('N', '"nN"[v:searchforward]', {'expr'})

nvim.nnoremap('<leader>t', '<cmd>TestNearest<cr>')
nvim.nnoremap('<leader>T', '<cmd>TestFile<cr>')
nvim.nnoremap('<leader>g', '<cmd>TestVisit<cr>')
nvim.nnoremap('<leader>l', '<cmd>TestLast<cr>')
nvim.nnoremap('<leader>h', '<cmd>Helptags<cr>')
nvim.nnoremap('<leader>n', '<cmd>nohlsearch<cr>')
nvim.nnoremap('<leader>*', '<cmd>lgrep <cword><cr>')
nvim.nnoremap('<leader>m', '<cmd>mksession!<cr>')
nvim.nnoremap('<leader>r', '<cmd>redraw!<cr>')
nvim.nnoremap('<leader>s', '<cmd>.!zsh<cr>')
nvim.xnoremap('<leader>s', "<cmd>'<,'>!zsh<cr>")
nvim.nmap('<leader>e', ':e %%')

nvim.nnoremap('<leader>1', '1gt')
nvim.nnoremap('<leader>2', '2gt')
nvim.nnoremap('<leader>3', '3gt')
nvim.nnoremap('<leader>4', '4gt')
nvim.nnoremap('<leader>5', '5gt')
nvim.nnoremap('<leader>6', '6gt')
nvim.nnoremap('<leader>7', '7gt')
nvim.nnoremap('<leader>8', '8gt')
nvim.nnoremap('<leader>9', '9gt')

nvim.nnoremap(']d', function() vim.lsp.diagnostic.goto_next() end)
nvim.nnoremap('[d', function() vim.lsp.diagnostic.goto_prev() end)

nvim.nnoremap('[a', '<cmd>previous<cr>')
nvim.nnoremap(']a', '<cmd>next<cr>')
nvim.nnoremap('[A', '<cmd>first<cr>')
nvim.nnoremap(']A', '<cmd>last<cr>')

nvim.nnoremap('[b', '<cmd>bprevious<cr>')
nvim.nnoremap(']b', '<cmd>bnext<cr>')
nvim.nnoremap('[B', '<cmd>bfirst<cr>')
nvim.nnoremap(']B', '<cmd>blast<cr>')

nvim.nnoremap('<up>', '<cmd>lprevious<cr>')
nvim.nnoremap('<down>', '<cmd>lnext<cr>')
nvim.nnoremap('[L', '<cmd>lfirst<cr>')
nvim.nnoremap(']L', '<cmd>llast<cr>')

nvim.nnoremap('[q', '<cmd>cprevious<cr>')
nvim.nnoremap(']q', '<cmd>cnext<cr>')
nvim.nnoremap('[Q', '<cmd>cfirst<cr>')
nvim.nnoremap(']Q', '<cmd>clast<cr>')

nvim.nnoremap('[t', '<cmd>tprevious<cr>')
nvim.nnoremap(']t', '<cmd>tnext<cr>')
nvim.nnoremap('[T', '<cmd>tfirst<cr>')
nvim.nnoremap(']T', '<cmd>tlast<cr>')

nvim.nnoremap('<c-l>', '<c-w>l')
nvim.nnoremap('<c-k>', '<c-w>k')
nvim.nnoremap('<c-j>', '<c-w>j')
nvim.nnoremap('<c-h>', '<c-w>h')

nvim.inoremap('jk', '<esc>')
nvim.inoremap('kj', '<esc>')
nvim.inoremap('JK', '<esc>')
nvim.inoremap('KJ', '<esc>')
nvim.inoremap('Jk', '<esc>')
nvim.inoremap('jK', '<esc>')
nvim.inoremap('Kj', '<esc>')
nvim.inoremap('kJ', '<esc>')

nvim.onoremap('A', '<cmd>normal! ggVG<cr>')

nvim.vnoremap('<c-g>', '"*y')
nvim.vnoremap('gn', ':norma ')

nvim.cnoremap('%%', 'getcmdtype() == ":" ? expand("%:h")."/" : "%%"', {'expr'})
nvim.cnoremap('<c-a>', '<home>')
nvim.cnoremap('<c-e>', '<end>')
nvim.cnoremap('qq', '"q!"', {'expr'})

nvim.tnoremap('<esc>', '<c-\\><c-n>')

nvim.tmap('gt', '"<c-\\><c-n>gt"', {'expr'})

-- vim.cmd('command! -bar WS if &ft == "lua" | lua package.loaded[ | elseif &ft == "vim" | write|source % | endif')
vim.cmd('command! StripWhitespace %s/\\v\\s+$//g')
vim.cmd('command! Yankfname let @* = expand("%:p")')
vim.cmd('command! LlistToQlist call setqflist(getloclist(winnr()))')

vim.g.qf_disable_statusline = true -- This should be the default
vim.g.Eunuch_find_executable = 'fd' -- I use my fork of vim-eunuch
vim.g.Illuminate_ftblacklist = {'.*'} -- Only use lsp highlighting from the plugin
vim.g.netrw_banner = false
vim.g.Hexokinase_highlighters = {'backgroundfull'}
vim.g.Hexokinase_optInPatterns = {'full_hex', 'triple_hex', 'rgb', 'rgba', 'hsl', 'hsla'}
vim.g.tex_flavor = 'latex'
vim.g.vimtex_view_method = 'skim'
vim.g.vimtex_quickfix_mode = true
vim.g['test#strategy'] = 'neovim'
vim.g.tex_flavor = 'latex'

vim.cmd [[ command! -range=% -nargs=1 Align lua require'align'.align(<f-args>) ]]
