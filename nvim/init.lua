_G.nvim = require('rrethy.nvim')

require('rrethy.backpack').setup()
vim.cmd('packadd! cfilter')

local treesitter           = require('nvim-treesitter.configs')
local hotline              = require('hotline') -- minimal statusline/tabline lua wrapper
local sourcerer            = require('sourcerer') -- sources my init.lua across Neovim instances
local illuminate           = require('illuminate')
local lsp                  = require('lspconfig')
local telescope            = require('telescope')
local telescope_builtin    = require('telescope.builtin')
local telescope_themes     = require('rrethy.telescope_themes')
local telescope_action_set = require('telescope.actions.set')
local telescope_actions    = require('telescope.actions')
local action_state         = require('telescope.actions.state')
local join_lines           = require('rrethy.join_lines')

vim.g.mapleader = ' '

sourcerer.setup()

local base16_theme_fname = vim.fn.expand('~/.config/.base16_theme')
vim.cmd('colorscheme '..vim.fn.readfile(base16_theme_fname)[1])
local function set_colorscheme(name)
    vim.fn.writefile({name}, base16_theme_fname)
    vim.cmd('colorscheme '..name)
    vim.loop.spawn('kitty', {
        args = {
            '@',
            '--to',
            vim.env.KITTY_LISTEN_ON,
            'set-colors',
            '-c',
            string.format('~/.config/kitty/base16-kitty/colors/%s.conf', name)
        }
    }, nil)
end
nvim.nnoremap('<leader>c', function()
    return telescope_builtin.colorscheme(telescope_themes.get_dropdown({
        prompt_title = 'Change Colorscheme',
        attach_mappings = function(bufnr)
            telescope_actions.select_default:replace(function()
                set_colorscheme(action_state.get_selected_entry().value)
                telescope_actions.close(bufnr)
            end)
            telescope_action_set.shift_selection:enhance({
                post = function()
                    set_colorscheme(action_state.get_selected_entry().value)
                end
            })
        return true
    end}))
end)

vim.lsp.util.close_preview_autocmd = function(events, winnr)
    -- I prefer to keep the preview (especially for signature_help) open while typing in insert mode
    events = vim.tbl_filter(function(v) return v ~= 'CursorMovedI' and v ~= 'BufLeave' end, events)
    vim.api.nvim_command("autocmd "..table.concat(events, ',').." <buffer> ++once lua pcall(vim.api.nvim_win_close, "..winnr..", true)")
end
vim.lsp.handlers['textDocument/signatureHelp'] = vim.lsp.with(
    require('rrethy.signature_help').signature_help, {
        border = 'single',
    }
)
vim.lsp.handlers['textDocument/hover'] = vim.lsp.with(
    vim.lsp.handlers.hover, {
        border = 'single',
    }
)
-- Puts the results in the location list instead of quickfix list
vim.lsp.handlers['textDocument/definition'] = function(_, method, result)
    if result == nil or vim.tbl_isempty(result) then
        local _ = require('vim.lsp.log').info() and require('vim.lsp.log').info(method, 'No location found')
        return nil
    end

    if vim.tbl_islist(result) then
        vim.lsp.util.jump_to_location(result[1])

        if #result > 1 then
            vim.lsp.util.set_loclist(vim.lsp.util.locations_to_items(result))
            vim.api.nvim_command("lopen")
            vim.api.nvim_command("wincmd p")
        end
    else
        vim.lsp.util.jump_to_location(result)
    end
end

-- rust-analyzer specific lsp method
vim.lsp.handlers['experimental/joinLines'] = join_lines.handler

-- TODO client.supports_method always returns true lol
local function lsp_on_attach(client, _)
    if client.supports_method('textDocument/hover') then
        nvim.nnoremap('K', '<cmd>lua vim.lsp.buf.hover()<cr>')
    end
    if client.supports_method('textDocument/definition') then
        nvim.nnoremap('<c-]>', '<cmd>lua vim.lsp.buf.definition()<cr>')
    end
    if client.supports_method('textDocument/formatting') then
        nvim.api.nvim_command('autocmd BufWritePre <buffer> lua vim.lsp.buf.formatting_sync(nil, 3000)')
    end
    if client.supports_method('textDocument/completion') then
        nvim.bo.omnifunc = 'v:lua.vim.lsp.omnifunc'
    end
    if client.supports_method('textDocument/signatureHelp') then
        nvim.inoremap('<c-s>', function()
            vim.lsp.buf.signature_help()
        end, {'buffer'})
    end
    if client.supports_method('textDocument/rename') then
        nvim.nnoremap('<leader>r', function()
            vim.lsp.buf.rename()
        end)
    end
    -- if client.supports_method('experimental/joinLines') then
    --     nvim.nnoremap('J', function()
    --         join_lines.join_lines()
    --     end)
    -- end
    illuminate.on_attach(client)
end

lsp.rust_analyzer.setup {
    settings = {
        ["rust-analyzer"] = {
            cargo = {
                loadOutDirsFromCheck = true
            },
            procMacro = {
                enable = true
            },
        },
    },
    on_attach = lsp_on_attach
}

lsp.vimls.setup {
    on_attach = lsp_on_attach
}

lsp.dartls.setup {
    init_options = {
        closingLabels = true,
    },
    on_attach = lsp_on_attach
}

lsp.gopls.setup {
    on_attach = lsp_on_attach
}

local sumneko_dir = nvim.env.HOME..'/lua/lua-language-server'
lsp.sumneko_lua.setup {
    cmd = {
        sumneko_dir..'/bin/macOS/lua-language-server',
        '-E',
        sumneko_dir..'/main.lua',
    },
    settings = {
        Lua = {
            runtime = {
                version = 'LuaJIT',
                path = nvim.split(package.path, ";"),
            },
            diagnostics = {
                enable = true,
                globals = {'vim', 'describe', 'it', 'before_each', 'after_each', 'teardown', 'pending', 'bit'},
            },
        },
    },
    on_attach = lsp_on_attach
}

treesitter.setup {
    ensure_installed = 'all',
    highlight = {
        enable = true,
        disable = { 'latex' },
    },
    playground = {
        enable = true,
    },
    refactor = {
        smart_rename = {
            enable = true,
            keymaps = {
                smart_rename = "<leader>r",
            },
        },
    },
    indent = {
        enable = true -- this is pretty buggy
    },
    textobjects = {
        select = {
            enable = true,
            lookahead = true,
            keymaps = {
                ['ae'] = '@call.outer',
                ['ie'] = '@call.inner',
                ['af'] = '@function.outer',
                ['if'] = '@function.inner',
                ['ac'] = '@comment.outer',
                -- ['is'] = '@scope.inner',
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
    }
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
                ['<C-u>'] = false, -- inoremap'd to clear line
                ['<C-a>'] = false, -- inoremap'd to move to start of line
                ['<C-e>'] = false, -- inoremap'd to move to end of line
                ['<C-w>'] = false, -- inoremap'd to delete previous word
                ['<C-b>'] = telescope_actions.preview_scrolling_up,
                ['<C-f>'] = telescope_actions.preview_scrolling_down,
            }
        }
    },
}
telescope.load_extension('fzy_native')
telescope.load_extension('fzf')
nvim.nnoremap('<c-p>', function() telescope_builtin.find_files(telescope_themes.get_dropdown({previewer=false})) end)
nvim.nnoremap('<leader>h', function() telescope_builtin.help_tags(telescope_themes.get_dropdown({previewer=false})) end)
nvim.nnoremap('<leader>g', function() telescope_builtin.live_grep() end)
nvim.nnoremap('<leader>s', function() telescope_builtin.lsp_dynamic_workspace_symbols() end)
nvim.nnoremap('<leader>d', function() telescope_builtin.lsp_document_symbols() end)

vim.opt.inccommand = 'nosplit'
vim.opt.ignorecase = true
vim.opt.smartcase = true
vim.opt.number = true
vim.opt.numberwidth = 3
vim.opt.updatetime = 250
vim.opt.showcmd = false
vim.opt.iskeyword:append('-')
vim.opt.hidden = true
vim.opt.tabstop = 4
vim.opt.softtabstop = 4
vim.opt.shiftround = true
vim.opt.shiftwidth = 4
vim.opt.expandtab = true
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
    function()
        -- LSP Error count or empty string
        return not vim.tbl_isempty(vim.lsp.buf_get_clients(0)) and
            string.format('  %d ', vim.lsp.diagnostic.get_count(0, 'Error')) or
            ''
    end,
    -- User2 hlgroup
    '%2*',
    function()
        -- LSP Warning count or empty string
        return not vim.tbl_isempty(vim.lsp.buf_get_clients(0)) and
            string.format('  %d ', vim.lsp.diagnostic.get_count(0, 'Warning')) or
            ''
    end,
    -- User3 hlgroup
    '%3*',
    function()
        -- LSP Information count or empty string
        return not vim.tbl_isempty(vim.lsp.buf_get_clients(0)) and
            string.format('  %d ', vim.lsp.diagnostic.get_count(0, 'Information')) or
            ''
    end,
    -- User4 hlgroup
    '%4*',
    function()
        -- LSP Hint count or empty string
        return not vim.tbl_isempty(vim.lsp.buf_get_clients(0)) and
            string.format('  %d ', vim.lsp.diagnostic.get_count(0, 'Hint')) or
            ''
    end,
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
vim.cmd [[     autocmd FileType toml setlocal commentstring=#\ %s ]]
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
nvim.nnoremap('g>', '<cmd>20messages<cr>')
nvim.nnoremap('n', '"Nn"[v:searchforward]', {'expr'})
nvim.nnoremap('N', '"nN"[v:searchforward]', {'expr'})
nvim.nnoremap('0', "getline('.')[0 : col('.') - 2] =~# '^\\s\\+$' ? '0' : '^'", {'silent', 'expr'})

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
