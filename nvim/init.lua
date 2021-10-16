_G.nvim = require('rrethy.nvim')

require('rrethy.backpack').setup()

local treesitter = require('nvim-treesitter.configs')
local hotline    = require('hotline') -- minimal statusline/tabline lua wrapper
local sourcerer  = require('sourcerer') -- sources my init.lua across Neovim instances

local telescope              = require('telescope')
local telescope_builtin      = require('telescope.builtin')
local telescope_action_set   = require('telescope.actions.set')
local telescope_actions      = require('telescope.actions')
local telescope_action_state = require('telescope.actions.state')

vim.g.mapleader = ' '

sourcerer.setup()

-- this avoids loading the same colorscheme twice on startup:
-- See https://github.com/neovim/neovim/issues/9311
-- vim.cmd('syntax on')
-- this files holds a single line describing my terminal and Neovim colorscheme. e.g.
--   base16-schemer-dark
local base16_theme_fname = vim.fn.expand(vim.env.XDG_CONFIG_HOME..'/.base16_theme')
local function set_colorscheme(name)
    vim.fn.writefile({name}, base16_theme_fname)
    vim.cmd('colorscheme '..name)
    vim.loop.spawn('kitty', {
        args = {
            '@',
            'set-colors',
            '-c',
            '-a',
            string.format(vim.env.HOME..'/base16-kitty/colors/%s.conf', name)
        }
    }, nil)
end
set_colorscheme(vim.fn.readfile(base16_theme_fname)[1])
nvim.nnoremap('<leader>c', function()
    local colors = vim.fn.getcompletion('base16', 'color')
    local theme = require('telescope.themes').get_dropdown()
    require('telescope.pickers').new(theme, {
        prompt = 'Change Base16 Colorscheme',
        finder = require('telescope.finders').new_table {
            results = colors
        },
        sorter = require('telescope.config').values.generic_sorter(theme),
        attach_mappings = function(bufnr)
            telescope_actions.select_default:replace(function()
                set_colorscheme(telescope_action_state.get_selected_entry().value)
                telescope_actions.close(bufnr)
            end)
            telescope_action_set.shift_selection:enhance({
                post = function()
                    set_colorscheme(telescope_action_state.get_selected_entry().value)
                end
            })
            return true
        end
    }):find()
end)

require('rrethy.lsp').setup {
    servers = {
        rust_analyzer = {
            settings = {
                ["rust-analyzer"] = {
                    cargo = {
                        loadOutDirsFromCheck = true
                    },
                    procMacro = {
                        enable = true
                    },
                },
            }
        },
        gopls = {},
        sorbet = {},
        -- solargraph = {},
        sumneko_lua = {
            cmd = {
                nvim.env.HOME..'/lua/lua-language-server'..'/bin/macOS/lua-language-server',
                '-E',
                nvim.env.HOME..'/lua/lua-language-server'..'/main.lua',
            },
            settings = {
                Lua = {
                    runtime = {
                        version = 'LuaJIT',
                        path = vim.split(package.path, ";"),
                    },
                    diagnostics = {
                        enable = true,
                        globals = {'vim', 'describe', 'it', 'before_each', 'after_each', 'teardown', 'pending', 'bit'},
                    },
                    workspace = {
                        library = {
                            [vim.fn.expand('$VIMRUNTIME/lua')] = true,
                            [vim.fn.expand('$VIMRUNTIME/lua/vim/lsp')] = true,
                        },
                    },
                },
            },
        },
        vimls = {},
        dartls = {
            init_options = {
                closingLabels = true,
            },
        },
    },
    handlers = {
        ['textDocument/signatureHelp'] = vim.lsp.with(
            vim.lsp.handlers.signature_help, {
                border = 'single',
                close_events = {"CursorMoved", "BufHidden", "InsertCharPre"},
            }
        ),
        ['textDocument/hover'] = vim.lsp.with(
            vim.lsp.handlers.hover, {
                border = 'single'
            }
        ),
    },
}

treesitter.setup {
    highlight = {
        enable = true,
        disable = { 'latex', 'haskell' },
    },
    playground = {
        enable = true,
    },
    refactor = {
        -- smart_rename = {
        --     enable = true,
        --     keymaps = {
        --         smart_rename = "<leader>r",
        --     },
        -- },
    },
    indent = {
        enable = true -- this is pretty buggy
    },
    textobjects = {
        select = {
            enable = true,
            lookahead = true,
            keymaps = {
                ['af'] = '@function.outer',
                ['if'] = '@function.inner',
            }
        },
        move = {
            enable = true,
            goto_next_start = {
                [']m'] = '@function.outer',
            },
            goto_previous_start = {
                ['[m'] = '@function.outer',
            },
        },
    },
    textsubjects = {
        enable = true,
        keymaps = {
            ['.'] = 'textsubjects-smart',
            [';'] = 'textsubjects-container-outer',
        }
    },
    endwise = {
        enable = true,
    },
}

telescope.setup {
    extensions = {
        fzy_native = {
            override_generic_sorter = false,
            override_file_sorter = true,
        },
        fzf = {
            override_generic_sorter = true,
            override_file_sorter = false,
        }
    },
    defaults = {
        mappings = {
            i = {
                ['<esc>'] = telescope_actions.close,
                ['<c-u>'] = false, -- inoremap'd to clear line
                ['<c-a>'] = false, -- inoremap'd to move to start of line
                ['<c-e>'] = false, -- inoremap'd to move to end of line
                ['<c-w>'] = false, -- inoremap'd to delete previous word
                ['<c-b>'] = telescope_actions.preview_scrolling_up,
                ['<c-f>'] = telescope_actions.preview_scrolling_down,
                ['<c-l>'] = telescope_actions.smart_send_to_loclist,
            }
        }
    },
}
telescope.load_extension('fzy_native')
telescope.load_extension('fzf')
nvim.nnoremap('<c-p>',     function() telescope_builtin.find_files(require('telescope.themes').get_dropdown({previewer=false})) end)
nvim.nnoremap('<leader>b', function() telescope_builtin.buffers(require("telescope.themes").get_dropdown({previewer=false})) end)
nvim.nnoremap('<leader>h', function() telescope_builtin.help_tags() end)
nvim.nnoremap('<leader>g', function() telescope_builtin.live_grep(require("telescope.themes").get_ivy()) end)

-- require('lint').linters.rubocop = {
--   cmd = 'rubocop',
--   stdin = false,
--   args = {}, -- list of arguments. Can contain functions with zero arguments that will be evaluated once the linter is used.
--   stream = nil, -- ('stdout' | 'stderr') configure the stream to which the linter outputs the linting result.
--   ignore_exitcode = false, -- set this to true if the linter exits with a code != 0 and that's considered normal.
--   -- parser = your_parse_function
-- }
-- require('lint').linters_by_ft = {
--   ruby = {'rubocop',}
-- }

vim.cmd('hi DiffAdd     guibg=#2e3c34 guifg=NONE gui=NONE')
vim.cmd('hi DiffChange  guibg=NONE    guifg=NONE gui=NONE')
vim.cmd('hi DiffDelete  guibg=#342426 guifg=NONE gui=NONE')
vim.cmd('hi DiffText    guibg=#342e3c guifg=NONE gui=NONE')
vim.cmd('hi DiffAdded   guibg=#2e3c34 guifg=NONE gui=NONE')

if vim.fn.has('vim_starting') then
    vim.opt.tabstop = 4
    vim.opt.softtabstop = 4
    vim.opt.shiftwidth = 4
    vim.opt.expandtab = true
    vim.opt.foldlevel = 999
end
vim.opt.fillchars = 'diff: '
vim.opt.foldmethod = 'expr'
vim.opt.foldexpr = 'nvim_treesitter#foldexpr()'
vim.opt.inccommand = 'nosplit'
vim.opt.ignorecase = true
vim.opt.smartcase = true
vim.opt.number = true
vim.opt.numberwidth = 3
vim.opt.updatetime = 250
vim.opt.showcmd = false
vim.opt.iskeyword:append('-')
vim.opt.hidden = true
vim.opt.shiftround = true
vim.opt.wrap = false
vim.opt.mouse = 'a'
vim.opt.sidescroll = 10
vim.opt.scrolloff = 1
vim.opt.whichwrap = '[,]'
vim.opt.cmdheight = 1
vim.opt.splitright = true
vim.opt.showmode = false
vim.opt.ruler = false
vim.opt.showmatch = true
vim.opt.matchtime = 5
vim.opt.spelllang = 'en_ca'
vim.opt.shortmess:append('Ic')
vim.opt.startofline = false
vim.opt.backup = true
vim.opt.backupdir = vim.fn.expand('~/.local/share/nvim/backup')
vim.opt.lazyredraw = true
vim.opt.grepprg = 'rg --smart-case --vimgrep $*'
vim.opt.grepformat = '%f:%l:%c:%m'
vim.opt.cpoptions:append('>')
vim.opt.completeopt = 'menu'
vim.opt.hlsearch = true
vim.opt.pumblend = 10
vim.opt.signcolumn = 'number'
vim.opt.dictionary:append('/usr/share/dict/words')
vim.opt.diffopt:append('hiddenoff')
vim.opt.showtabline = 1
vim.opt.timeoutlen = 250
vim.opt.ttimeoutlen = -1
vim.opt.equalalways = true
vim.opt.termguicolors = true
vim.opt.foldnestmax = 4
vim.opt.breakindent = true
vim.opt.sessionoptions:remove('folds')
vim.opt.modelines = 0
local function lsp_diagnostic_count(name, icon)
    if vim.tbl_isempty(vim.lsp.buf_get_clients(0)) then
        return ''
    else
        local count = vim.lsp.diagnostic.get_count(0, name)
        if count > 0 then
            return string.format(' %s %d ', icon, count)
        end
        return ''
    end
end
vim.opt.statusline = hotline.format {
    ' ',
    function()
        -- buffer number
        return string.format('%d', vim.fn.bufnr())
    end,
    ' ',
    function()
        -- filetype
        return #vim.bo.filetype == 0 and '' or string.format('[%s]', vim.bo.filetype)
    end,
    ' ',
    function()
        -- filename tail
        return string.format('%s', vim.fn.fnamemodify(vim.fn.bufname(), ':t'))
    end,
    ' ',
    function()
        -- whether file is readonly
        return vim.bo.readonly and '[readonly]' or ''
    end,
    -- User1 hlgroup
    '%1*',
    function() return lsp_diagnostic_count('Error', '') end,
    -- User2 hlgroup
    '%2*',
    function() return lsp_diagnostic_count('Warning', '') end,
    -- User3 hlgroup
    '%3*',
    function() return lsp_diagnostic_count('Information', '') end,
    -- User4 hlgroup
    '%4*',
    function() return lsp_diagnostic_count('Hint', '') end,
    -- Reset hlgroup
    '%0*',
    -- Right alignment
    '%=',
    -- line num, col num, location in file as a percentage
    ' %20(%-9(%4l/%-4L%) %5( %-3c%) %-4(%3p%%%)%) ',
}

vim.cmd [[ augroup rrethy ]]
vim.cmd [[ autocmd! ]]
vim.cmd [[     autocmd FileType c,cpp,java setlocal commentstring=//\ %s ]]
vim.cmd [[     autocmd FileType go setlocal noexpandtab ]]
vim.cmd [[     autocmd FileType toml setlocal commentstring=#\ %s ]]
vim.cmd [[     autocmd TextYankPost * lua require'vim.highlight'.on_yank({timeout=250}) ]]
vim.cmd [[     autocmd BufNewFile *.tex 0r!cat ~/.config/nvim/skeletons/latex.skel ]]
-- vim.cmd [[     autocmd BufWritePost <buffer> lua require('lint').try_lint() ]]
vim.cmd [[ augroup END ]]

vim.fn.mkdir(vim.fn.stdpath('data')..'/backup/', 'p')

nvim.nnoremap('<a-n>', function() require('illuminate').next_reference({wrap = true}) end)
nvim.nnoremap('<a-p>', function() require('illuminate').next_reference({reverse = true, wrap = true}) end)
nvim.nnoremap('<a-i>', function() require('illuminate').toggle_pause() end)

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
nvim.nnoremap('yon', function()
    if vim.wo.number then vim.wo.number = false else vim.wo.number = true end
end)
nvim.nnoremap('yor', function()
    if vim.wo.relativenumber then vim.wo.relativenumber = false else vim.wo.relativenumber = true end
end)
nvim.nnoremap('yoc', function()
    if vim.wo.cursorcolumn then vim.wo.cursorcolumn = false else vim.wo.cursorcolumn = true end
end)
nvim.nnoremap('yoh', function() toggle.echom_toggle_opt('hlsearch', 'global') end)
nvim.nnoremap('yos', function() toggle.echom_toggle_opt('spell', 'win') end)
nvim.nnoremap('yob', function() toggle.echom_toggle_opt('scrollbind', 'win') end)
nvim.nnoremap('yoh', function()
    if vim.o.hlsearch then
        vim.o.hlsearch = false
        vim.api.nvim_err_writeln("'hlsearch'")
    else
        vim.o.hlsearch = true
        print("'hlsearch'")
    end
end)

nvim.nnoremap('<c-w>t', '<cmd>tabnew<cr>')
-- clear line
nvim.nnoremap('cl', '0D')
-- why isn't this default???
nvim.nnoremap('Y', 'y$')
-- why isn't this default??? maybe it's because of old keyboard configuration
nvim.nnoremap("'", '`')
-- like <c-e> and <c-y> but for horizontal
nvim.nnoremap('<A-l>', '2zl')
nvim.nnoremap('<A-h>', '2zh')
nvim.nnoremap('g8', '<cmd>norm! *N<cr>')
-- gt and gT suck
nvim.nnoremap('<left>', 'gT')
nvim.nnoremap('<right>', 'gt')
-- this gets even better if you map right shift to backspace
nvim.nnoremap('<backspace>', '<c-^>')
-- <leader>r replaces this for treesitter supported languages
nvim.nnoremap('<c-s>', [[:%s/\C\<<c-r><c-w>\>/]])
nvim.nnoremap('g>', '<cmd>20messages<cr>')
-- this can be modified for f and , but I don't like it
nvim.nnoremap('n', '"Nn"[v:searchforward]', {'expr'})
nvim.nnoremap('N', '"nN"[v:searchforward]', {'expr'})
-- This is probably good but I couldn't get used to it
-- nvim.nnoremap('0', "getline('.')[0 : col('.') - 2] =~# '^\\s\\+$' ? '0' : '^'", {'silent', 'expr'})
nvim.nnoremap('gp', '`[v`]')

nvim.nnoremap('<leader>tf', '<cmd>TestFile<cr>')
nvim.nnoremap('<leader>tn', '<cmd>TestNearest<cr>')
nvim.nnoremap('<leader>tl', '<cmd>TestLast<cr>')
nvim.nnoremap('<leader>m', '<cmd>mksession!<cr>')
-- nvim.nnoremap('<leader>r', '<cmd>redraw!<cr>')
-- nvim.nnoremap('<leader>n', '<cmd>nohlsearch<cr>')
-- nvim.nnoremap('<leader>*', '<cmd>lgrep <cword><cr>')
-- nvim.nnoremap('<leader>s', '<cmd>.!zsh<cr>')
-- nvim.xnoremap('<leader>s', "<cmd>'<,'>!zsh<cr>")
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

nvim.nnoremap('<c-c>l', '<cmd>lclose<cr>')
nvim.nnoremap('<c-c>c', '<cmd>cclose<cr>')

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
nvim.inoremap('90', '()')
nvim.inoremap('<c-a>', '<esc>gI')
nvim.inoremap('<c-e>', '<esc>A')

nvim.onoremap('A', '<cmd>normal! ggVG<cr>')

nvim.vnoremap('<c-g>', '"*y')
nvim.vnoremap('gn', ':norma ')

nvim.cnoremap('%%', 'getcmdtype() == ":" ? expand("%:h")."/" : "%%"', {'expr'})
nvim.cnoremap('<c-a>', '<home>')
nvim.cnoremap('<c-e>', '<end>')
nvim.cnoremap('qq', '"q!"', {'expr'})
nvim.cnoremap('<Tab>', 'getcmdtype() == "/" || getcmdtype() == "?" ? "<CR>/<C-r>/" : "<C-z>"', {'expr'})
nvim.cnoremap('<S-Tab>', 'getcmdtype() == "/" || getcmdtype() == "?" ? "<CR>?<C-r>/" : "<S-Tab>"', {'expr'})

nvim.tnoremap('<esc>', '<c-\\><c-n>')

nvim.tmap('gt', '"<c-\\><c-n>gt"', {'expr'})

vim.cmd('command! WS write|source %')
vim.cmd('command! StripWhitespace %s/\\v\\s+$//g')
vim.cmd('command! Yankfname let @* = expand("%")')
vim.cmd('command! LlistToQlist call setqflist(getloclist(winnr()))')
vim.cmd('command! -range=% -nargs=1 Align lua require("align").align(<f-args>)')

vim.g.qf_disable_statusline = true -- This should be the default
vim.g.Eunuch_find_executable = 'fd' -- I use my fork of vim-eunuch
vim.g.Illuminate_ftblacklist = {'.*'} -- Only use lsp highlighting from the plugin
vim.g.netrw_banner = false
vim.g.Hexokinase_highlighters = {'backgroundfull'}
vim.g.Hexokinase_optInPatterns = {'full_hex', 'triple_hex', 'rgb', 'rgba', 'hsl', 'hsla'}
vim.g.Hexokinase_refreshEvents = {'BufRead', 'BufWrite'}
vim.g.tex_flavor = 'latex'
vim.g.vimtex_view_method = 'skim'
vim.g.vimtex_quickfix_mode = true
vim.g.vimtex_compiler_latexmk = {
    options = {'-pdf', '-shell-escape', '-verbose', '-file-line-error', '-synctex=1', '-interaction=nonstopmode'}
}
vim.g['test#strategy'] = 'neovim'
vim.g.tex_flavor = 'latex'
vim.g.indent_blankline_char = '│'
vim.g.indent_blankline_filetype = {'rust', 'go', 'lua', 'json', 'ruby'}
vim.g.indent_blankline_use_treesitter = true
vim.g.loaded_ruby_provider = false
vim.g.Illuminate_delay = 100
vim.g.vimsyn_embed = 'l'
