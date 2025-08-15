require('rrethy.backpack').setup()

local current_file = string.sub(debug.getinfo(1).source, 2)
local treesitter = require('nvim-treesitter.configs')
local hotline = require('hotline')
local telescope = require('telescope')
local telescope_actions = require('telescope.actions')

vim.loader.enable()

vim.g.mapleader = ' '
vim.opt.termguicolors = true

File_watchers = File_watchers or {}
local watch_file_augroup = 'watch_file_augroup'
vim.api.nvim_create_augroup(watch_file_augroup, { clear = true })
vim.api.nvim_create_autocmd('VimLeave', {
    group = watch_file_augroup,
    callback = function()
        for _, watcher in pairs(File_watchers) do
            watcher:stop()
        end
    end
})
local function watch_file(fname, cb, time)
    if File_watchers[fname] then
        File_watchers[fname]:stop()
        File_watchers[fname] = nil
    end

    File_watchers[fname] = vim.uv.new_fs_poll()
    File_watchers[fname]:start(fname, time, vim.schedule_wrap(cb))
end

watch_file(current_file, function()
    dofile(current_file)
    vim.notify('Reloaded ' .. current_file, vim.log.levels.INFO)
end, 500)

-- this files holds a single line describing my terminal and Neovim colorscheme. e.g. base16-schemer-dark
local base16_theme_fname = vim.fn.expand(vim.env.XDG_CONFIG_HOME .. '/.base16_theme')
if Colorscheme_counter == nil then
    Colorscheme_counter = 0
end
local function notify_colorscheme_changes(name)
    Colorscheme_counter = Colorscheme_counter + 1
    vim.fn.writefile({ name }, base16_theme_fname)
    vim.uv.spawn('kitty', {
        args = {
            '@',
            'set-colors',
            '-c',
            '-a',
            string.format(vim.env.XDG_CONFIG_HOME .. '/kitty/themes/%s.conf', name)
        }
    }, nil)
end

watch_file(base16_theme_fname, function()
    if Colorscheme_counter > 0 then
        Colorscheme_counter = Colorscheme_counter - 1
    else
        local colorscheme = vim.fn.readfile(base16_theme_fname)[1]
        vim.cmd('colorscheme ' .. colorscheme)
        vim.notify('colorscheme: ' .. colorscheme, vim.log.levels.INFO)
    end
end, 500)
vim.keymap.set('n', '<leader>c', function()
    local colors = vim.fn.getcompletion('base16', 'color')
    local theme = require('telescope.themes').get_dropdown()
    local telescope_action_set = require('telescope.actions.set')
    local telescope_action_state = require('telescope.actions.state')
    require('telescope.pickers').new(theme, {
        prompt_title = 'Base16 Colorschemes',
        finder = require('telescope.finders').new_table({ results = colors }),
        sorter = require('telescope.config').values.generic_sorter(theme),
        attach_mappings = function(bufnr)
            telescope_actions.select_default:replace(function()
                local name = telescope_action_state.get_selected_entry().value
                vim.cmd('colorscheme ' .. name)
                notify_colorscheme_changes(name)
                telescope_actions.close(bufnr)
            end)
            telescope_action_set.shift_selection:enhance({
                post = function()
                    local name = telescope_action_state.get_selected_entry().value
                    vim.cmd('colorscheme ' .. name)
                    notify_colorscheme_changes(name)
                end
            })
            return true
        end
    }):find()
end)
vim.cmd('colorscheme ' .. vim.fn.readfile(base16_theme_fname)[1])
-- vim.cmd('hi DiffChange       guibg=NONE    guifg=NONE gui=NONE')
-- vim.cmd('hi DiffText         guibg=#342e3c guifg=NONE gui=NONE')
-- vim.cmd('hi DiffAdded        guibg=#2e3c34 guifg=NONE gui=NONE')
-- vim.cmd('hi DiffAdd          guibg=#2c3732 guifg=NONE gui=NONE')
-- vim.cmd('hi DiffDeleteAsAdd  guibg=#2c3732 guifg=NONE gui=NONE')
-- vim.cmd('hi DiffDelete       guibg=#3e2f32 guifg=NONE gui=NONE')
-- vim.cmd('hi DiffAddAsDelete  guibg=#3e2f32 guifg=NONE gui=NONE')
-- vim.cmd('hi DiffTextAdd      guibg=#3e543f guifg=NONE gui=NONE')
-- vim.cmd('hi DiffTextDelete   guibg=#693d3c guifg=NONE gui=NONE')
-- vim.cmd('hi DiffChangeAdd    guibg=#2c3732 guifg=NONE gui=NONE')
-- vim.cmd('hi DiffChangeDelete guibg=#3e2f32 guifg=NONE gui=NONE')

local ERROR_ICON = ''
local WARN_ICON = ''
local INFO_ICON = ''
local HINT_ICON = ''
vim.diagnostic.config({
    signs = {
        text = {
            [vim.diagnostic.severity.ERROR] = ERROR_ICON,
            [vim.diagnostic.severity.WARN] = WARN_ICON,
            [vim.diagnostic.severity.INFO] = INFO_ICON,
            [vim.diagnostic.severity.HINT] = HINT_ICON,
        },
        texthl = {
            [vim.diagnostic.severity.ERROR] = 'DiagnosticSignError',
            [vim.diagnostic.severity.WARN] = 'DiagnosticSignWarn',
            [vim.diagnostic.severity.INFO] = 'DiagnosticSignInfo',
            [vim.diagnostic.severity.HINT] = 'DiagnosticSignHint',
        },
    },
    virtual_text = {
        prefix = '',
        format = function(diagnostic)
            local icon = diagnostic.severity == vim.diagnostic.severity.ERROR and ERROR_ICON
                or diagnostic.severity == vim.diagnostic.severity.WARN and WARN_ICON
                or diagnostic.severity == vim.diagnostic.severity.INFO and INFO_ICON
                or diagnostic.severity == vim.diagnostic.severity.HINT and HINT_ICON
            return string.format("%s %s", icon, diagnostic.message)
        end,
    },
    handlers = {
        loclist = {
            open = true,
        },
    },
})

local notify = require('notify')
vim.notify = notify
vim.keymap.set('n', '<leader>n', notify.dismiss)
notify.setup({
    icons = {
        ERROR = ERROR_ICON,
        WARN = WARN_ICON,
        INFO = INFO_ICON,
        DEBUG = HINT_ICON,
        TRACE = HINT_ICON,
    }
})

require('diffview').setup({
    enhanced_diff_hl = true,
})
require 'treesitter-context'.setup({
    enable = true,
    max_lines = 4
})
require("ibl").setup({
    indent = { char = "│" },
    scope = {
        show_start = false,
        show_end = false,
    },
})
require('mason').setup()
require('gitsigns').setup({
    signcolumn = true,
    numhl = false,
})

vim.lsp.enable({
    'gopls',
    'lua_ls',
    'sorbet',
})
vim.lsp.config('gopls', {
    capabilities = {
        workspace = {
            didChangeWatchedFiles = {
                dynamicRegistration = false,
            }
        }
    },
    settings = {
        gopls = {
            analyses = {
                unusedparams = true,
            },
            staticcheck = true,
            gofumpt = true,
            hints = {
                assignVariableTypes = true,
                compositeLiteralFields = true,
                compositeLiteralTypes = true,
                constantValues = true,
                functionTypeParameters = true,
                parameterNames = true,
                rangeVariableTypes = true,
            },
        },
    },
})
vim.lsp.config('lua_ls', {
    settings = {
        Lua = {
            runtime = {
                version = 'LuaJIT',
                path = vim.split(package.path, ";"),
            },
            diagnostics = {
                enable = true,
                globals = {
                    'vim',
                },
            },
            workspace = {
                library = {
                    [vim.fn.expand('$VIMRUNTIME/lua')] = true,
                    [vim.fn.expand('$VIMRUNTIME/lua/vim/lsp')] = true,
                },
            },
        },
    },
})

-- vim.opt.foldmethod                              = 'expr'
-- vim.opt.foldexpr                                = 'nvim_treesitter#foldexpr()'
-- vim.opt.foldenable = false
-- vim.opt.foldtext                                = 'v:lua.vim.treesitter.foldtext()'
treesitter.setup {
    highlight = {
        enable = true,
        disable = { 'python' }
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
        },
    },
    defaults = {
        prompt_prefix = ' ',
        selection_caret = ' ',
        entry_prefix = ' ',
        color_devicons = true,
        mappings = {
            i = {
                ['<c-p>'] = telescope_actions.cycle_history_prev,
                ['<c-n>'] = telescope_actions.cycle_history_next,
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
vim.keymap.set('n', '<c-p>', function()
    require('telescope.builtin').find_files(require('telescope.themes').get_dropdown({ previewer = false }))
end)
vim.keymap.set('n', '<leader>b', function()
    require('telescope.builtin').buffers(require('telescope.themes').get_dropdown({ previewer = false }))
end)
vim.keymap.set('n', '<leader>h', require('telescope.builtin').help_tags)
vim.keymap.set('n', '<leader>g', require('telescope.builtin').live_grep)
vim.keymap.set('n', '<a-g>', function()
    vim.ui.input({ prompt = 'Directory to search: ', completion = 'dir' }, function(input)
        if input and #input > 0 then
            require('telescope.builtin').live_grep({ search_dirs = { input } })
        end
    end)
end)

if vim.fn.has('vim_starting') then
    vim.opt.tabstop = 4
    vim.opt.softtabstop = 4
    vim.opt.shiftwidth = 4
    vim.opt.expandtab = true
    vim.opt.foldlevel = 999
end
vim.opt.fillchars = 'diff: '
-- vim.opt.foldmethod = 'expr'
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
vim.opt.spell = true
-- vim.opt.shortmess:append('Ic')
vim.opt.startofline = false
vim.opt.backup = true
vim.opt.backupdir = vim.fn.expand('~/.local/share/nvim/backup')
vim.opt.lazyredraw = true
vim.opt.grepprg = 'rg --smart-case --vimgrep $*'
vim.opt.grepformat = '%f:%l:%c:%m'
vim.opt.cpoptions:append('>')
-- vim.opt.completeopt = 'menu,popup'
vim.opt.hlsearch = true
vim.opt.pumblend = 10
-- vim.opt.signcolumn = 'number'
vim.opt.signcolumn = 'yes:1'
vim.opt.dictionary:append('/usr/share/dict/words')
vim.opt.diffopt:append('hiddenoff')
vim.opt.showtabline = 1
vim.opt.timeoutlen = 250
-- vim.opt.ttimeoutlen = -1
vim.opt.equalalways = true
-- vim.opt.foldnestmax = 4
vim.opt.breakindent = true
vim.opt.sessionoptions:remove('folds')
vim.opt.modelines = 0
vim.opt.laststatus = 3
vim.opt.autoread = true
vim.opt.foldmethod = 'expr'
vim.opt.foldexpr = 'v:lua.vim.treesitter.foldexpr()'
vim.opt.foldtext = ''
vim.opt.fillchars:append('fold: ')
vim.opt.winborder = 'single'
-- vim.opt.guicursor:append('n-v-c:blinkon500-blinkoff500')
local function lsp_diagnostic_count(name, icon)
    return function()
        local count = #vim.diagnostic.get(0, { severity = name })
        if count > 0 then
            return string.format(' %s %d ', icon, count)
        end
        return ''
    end
end

vim.opt.winbar = hotline.format {
    -- '%=',
    '%5*',
    ' ',
    vim.fn.bufnr,
    ' ',
    function()
        local _, ok = pcall(require, 'nvim-web-devicons')
        if not ok then
            return ''
        end

        -- TODO: this doesn't work for ruby files??
        local icon, _ = require('nvim-web-devicons').get_icon(vim.fn.expand('%:t'), vim.bo.filetype)
        return string.format('%s', icon) .. ' '
    end,
    function()
        -- filetype
        return #vim.bo.filetype == 0 and '' or string.format('[%s]', vim.bo.filetype)
    end,
    '%m',
    ' ',
    function()
        if vim.bo.filetype == 'qf' then
            return string.format(
                '%s %s',
                vim.fn.getwininfo(vim.fn.win_getid(vim.fn.winnr()))[1].loclist and 'Location List' or 'Quickfix List',
                vim.w.quickfix_title
            )
        else
            -- filename tail
            return vim.fn.fnamemodify(vim.fn.bufname(), ':t')
        end
    end,
    ' ',
    function()
        -- whether file is readonly
        return vim.bo.readonly and '[readonly] ' or ''
    end,
    '%0*',
}
vim.opt.statusline = hotline.format {
    ' ',
    -- User1 hlgroup
    '%1*',
    lsp_diagnostic_count(vim.diagnostic.severity.ERROR, ERROR_ICON),
    -- User2 hlgroup
    '%2*',
    lsp_diagnostic_count(vim.diagnostic.severity.WARN, WARN_ICON),
    -- User3 hlgroup
    '%3*',
    lsp_diagnostic_count(vim.diagnostic.severity.INFO, INFO_ICON),
    -- User4 hlgroup
    '%4*',
    lsp_diagnostic_count(vim.diagnostic.severity.HINT, HINT_ICON),
    -- Reset hlgroup
    '%0*',
    -- Right alignment
    '%=',
    -- line num, col num, location in file as a percentage
    ' %20(%-9(%4l/%-4L%) %5( %-3c%) %-4(%3p%%%)%) ',
}

local init_lua_augroup = 'init_lua_augroup'
local function on_ft(ft, cb)
    vim.api.nvim_create_autocmd('FileType', {
        group = init_lua_augroup,
        pattern = ft,
        callback = cb,
    })
end

vim.api.nvim_create_augroup(init_lua_augroup, { clear = true })
on_ft('qf', function()
    vim.wo.winbar = ''
end)
on_ft('rust', function()
    vim.cmd('compiler cargo')
end)
on_ft('ruby', function()
    vim.bo.tabstop = 2
    vim.bo.softtabstop = 2
    vim.bo.shiftwidth = 2
    vim.bo.iskeyword = vim.bo.iskeyword .. ',!'
end)
on_ft({ 'c', 'cpp', 'java' }, function()
    vim.bo.commentstring = '// %s'
end)
on_ft('go', function()
    vim.bo.expandtab = false
end)
on_ft('toml', function()
    vim.bo.commentstring = '# %s'
end)
on_ft('Makefile', function()
    vim.bo.expandtab = false
end)
-- on_ft('help', function()
--     vim.opt.conceallevel = 0
-- end)
vim.api.nvim_create_autocmd('BufNewFile', {
    group = init_lua_augroup,
    pattern = { 'tex' },
    command = '0r!cat ~/.config/nvim/skeletons/latex.skel',
})
vim.api.nvim_create_autocmd('BufRead', {
    group = init_lua_augroup,
    pattern = { 'Kptfile', 'manifest.yaml.lock' },
    command = 'set filetype=yaml',
})
vim.api.nvim_create_autocmd('TextYankPost', {
    group = init_lua_augroup,
    callback = function()
        vim.hl.on_yank({ timeout = 250 })
    end,
})
vim.api.nvim_create_autocmd('DiagnosticChanged', {
    group = init_lua_augroup,
    callback = function()
        vim.cmd('redrawstatus')
    end,
})
vim.api.nvim_create_autocmd("LspAttach", {
    group = init_lua_augroup,
    callback = function(args)
        local client = assert(vim.lsp.get_client_by_id(args.data.client_id))
        vim.keymap.set('n', '<c-w><c-d>', vim.diagnostic.open_float, { buffer = true })
        vim.keymap.set('n', 'gd', function() vim.lsp.buf.type_definition({ loclist = true }) end, { buffer = true })
        vim.keymap.set('n', 'gD', function() vim.lsp.buf.declaration({ loclist = true }) end, { buffer = true })
        vim.keymap.set('n', 'gr', vim.lsp.buf.rename, { buffer = true })
        vim.keymap.set('n', 'gi', function() vim.lsp.buf.implementation({ loclist = true }) end, { buffer = true })
        vim.keymap.set('n', 'gu', function() vim.lsp.buf.references(nil, { loclist = true }) end, { buffer = true })
        vim.keymap.set('n', 'gO', function() vim.lsp.buf.document_symbol({ loclist = true }) end, { buffer = true })
        vim.keymap.set('n', 'grc', function() vim.lsp.buf.typehierarchy('subtypes') end, { buffer = true })
        vim.keymap.set('n', 'grp', function() vim.lsp.buf.typehierarchy('supertypes') end, { buffer = true })
        if client:supports_method('textDocument/completion') then
            vim.lsp.completion.enable(true, client.id, args.buf, { autotrigger = true })
        end
        if client:supports_method('textDocument/inlayHint') then
            vim.lsp.inlay_hint.enable(false, { bufnr = args.buf })
            vim.keymap.set('n', 'yoi', function()
                vim.lsp.inlay_hint.enable(not vim.lsp.inlay_hint.is_enabled({ bufnr = args.buf }), { bufnr = args.buf })
            end, { buffer = true })
        end
        if not client:supports_method('textDocument/willSaveWaitUntil')
            and client:supports_method('textDocument/formatting') then
            vim.api.nvim_create_autocmd('BufWritePre', {
                group = vim.api.nvim_create_augroup(init_lua_augroup, { clear = false }),
                buffer = args.buf,
                callback = function()
                    vim.lsp.buf.format({ bufnr = args.buf, id = client.id, timeout_ms = 1000 })
                end,
            })
        end
    end,
})

vim.fn.mkdir(vim.fn.stdpath('data') .. '/backup/', 'p')

vim.keymap.set('n', 'j', 'gj')
vim.keymap.set('n', 'k', 'gk')
vim.keymap.set('n', 'yow', function()
    if vim.wo.wrap then
        vim.wo.wrap = false
        vim.wo.linebreak = false
    else
        vim.wo.wrap = true
        vim.wo.linebreak = true
    end
end)

vim.keymap.set('n', 'yon', function()
    vim.wo.number = not vim.wo.number
end)
vim.keymap.set('n', 'yor', function()
    vim.wo.relativenumber = not vim.wo.relativenumber
end)
vim.keymap.set('n', 'yoc', function()
    vim.wo.cursorline = not vim.wo.cursorline
end)
vim.keymap.set('n', 'yos', function()
    if vim.wo.spell then
        vim.wo.spell = false
        vim.notify("'spell'", vim.log.levels.ERROR)
    else
        vim.wo.spell = true
        vim.notify("'spell'", vim.log.levels.INFO)
    end
end)
vim.keymap.set('n', 'yob', function()
    if vim.wo.scrollbind then
        vim.wo.scrollbind = false
        vim.notify("'scrollbind'", vim.log.levels.ERROR)
    else
        vim.wo.scrollbind = true
        vim.notify("'scrollbind'", vim.log.levels.INFO)
    end
end)
vim.keymap.set('n', 'yoh', function()
    if vim.o.hlsearch then
        vim.o.hlsearch = false
        vim.notify("'hlsearch'", vim.log.levels.ERROR)
    else
        vim.o.hlsearch = true
        vim.notify("'hlsearch'", vim.log.levels.INFO)
    end
end)

vim.keymap.set('n', '<c-w>t', '<cmd>tabnew<cr>')
-- clear line
vim.keymap.set('n', 'cl', '0D')
vim.keymap.set('n', "'", '`')
-- like <c-e> and <c-y> but for horizontal
vim.keymap.set('n', '<A-l>', '2zl')
vim.keymap.set('n', '<A-h>', '2zh')
vim.keymap.set('n', 'g8', '<cmd>norm! *N<cr>')
-- gt and gT suck
vim.keymap.set('n', '<left>', 'gT')
vim.keymap.set('n', '<right>', 'gt')
-- this gets even better if you map right shift to backspace
vim.keymap.set('n', '<backspace>', '<c-^>')
-- <leader>r replaces this for treesitter supported languages
vim.keymap.set('n', '<c-s>', [[:%s/\C\<<c-r><c-w>\>/]])
vim.keymap.set('n', '<c-f>', [[:call search('\v(^|\W)\zs\w', 'Wz')<CR>]], { silent = true })
vim.keymap.set('n', '<c-b>', [[:call search('\v(^|\W)\zs\w', 'bW')<CR>]], { silent = true })
vim.keymap.set('n', 'g>', '<cmd>20messages<cr>')
vim.keymap.set('n', 'n', '"Nn"[v:searchforward]', { expr = true })
vim.keymap.set('n', 'N', '"nN"[v:searchforward]', { expr = true })
vim.keymap.set('n', ';', 'getcharsearch().forward ? ";" : ","', { expr = true })
vim.keymap.set('n', ',', 'getcharsearch().forward ? "," : ";"', { expr = true })
vim.keymap.set('n', 'gp', '`[v`]')
vim.keymap.set('n', '<c-q>l', function()
    vim.fn.setloclist(vim.fn.winnr(), vim.fn.getqflist())
    vim.cmd('cclose')
    vim.cmd('lopen')
end)

vim.keymap.set('n', '<c-t><c-f>', '<cmd>TestFile<cr>')
vim.keymap.set('n', '<c-t><c-n>', '<cmd>TestNearest<cr>')
vim.keymap.set('n', '<c-t><c-l>', '<cmd>TestLast<cr>')
vim.keymap.set('n', '<leader>m', '<cmd>mksession!<cr>')
vim.keymap.set('n', '<leader>e', ':e %%', { remap = true })

vim.keymap.set('n', '<leader>1', '1gt')
vim.keymap.set('n', '<leader>2', '2gt')
vim.keymap.set('n', '<leader>3', '3gt')
vim.keymap.set('n', '<leader>4', '4gt')
vim.keymap.set('n', '<leader>5', '5gt')
vim.keymap.set('n', '<leader>6', '6gt')
vim.keymap.set('n', '<leader>7', '7gt')
vim.keymap.set('n', '<leader>8', '8gt')
vim.keymap.set('n', '<leader>9', '9gt')

vim.keymap.set('n', '[a', '<cmd>previous<cr>')
vim.keymap.set('n', ']a', '<cmd>next<cr>')
vim.keymap.set('n', '[A', '<cmd>first<cr>')
vim.keymap.set('n', ']A', '<cmd>last<cr>')

vim.keymap.set('n', '[b', '<cmd>bprevious<cr>')
vim.keymap.set('n', ']b', '<cmd>bnext<cr>')
vim.keymap.set('n', '[B', '<cmd>bfirst<cr>')
vim.keymap.set('n', ']B', '<cmd>blast<cr>')

vim.keymap.set('n', '<up>', function()
    local ok, _ = pcall(vim.cmd, 'lprevious')
    if ok then
        pcall(vim.cmd, 'norm! zz')
    end
end)
vim.keymap.set('n', '<down>', function()
    local ok, _ = pcall(vim.cmd, 'lnext')
    if ok then
        pcall(vim.cmd, 'norm! zz')
    end
end)
vim.keymap.set('n', '[L', '<cmd>lfirst<cr>')
vim.keymap.set('n', ']L', '<cmd>llast<cr>')

vim.keymap.set('n', '[q', '<cmd>cprevious<cr>')
vim.keymap.set('n', ']q', '<cmd>cnext<cr>')
vim.keymap.set('n', '[Q', '<cmd>cfirst<cr>')
vim.keymap.set('n', ']Q', '<cmd>clast<cr>')

vim.keymap.set('n', '[t', '<cmd>tprevious<cr>')
vim.keymap.set('n', ']t', '<cmd>tnext<cr>')
vim.keymap.set('n', '[T', '<cmd>tfirst<cr>')
vim.keymap.set('n', ']T', '<cmd>tlast<cr>')

vim.keymap.set('n', '<c-l>', '<c-w>l')
vim.keymap.set('n', '<c-k>', '<c-w>k')
vim.keymap.set('n', '<c-j>', '<c-w>j')
vim.keymap.set('n', '<c-h>', '<c-w>h')
vim.keymap.set('n', '<c-w>l', function() vim.cmd('lclose') end)
vim.keymap.set('n', '<c-w>q', function() vim.cmd('cclose') end)
vim.keymap.set('n', '<c-bs>', function() vim.cmd('b term') end)
vim.keymap.set('n', 'g;', '<cmd>norm! g;zz<cr>')
vim.keymap.set('n', 'g,', '<cmd>norm! g,zz<cr>')

vim.keymap.set('i', 'jk', '<esc>')
vim.keymap.set('i', 'kj', '<esc>')
vim.keymap.set('i', 'JK', '<esc>')
vim.keymap.set('i', 'KJ', '<esc>')
vim.keymap.set('i', 'Jk', '<esc>')
vim.keymap.set('i', 'jK', '<esc>')
vim.keymap.set('i', 'Kj', '<esc>')
vim.keymap.set('i', 'kJ', '<esc>')

vim.keymap.set('i', '<c-a>', '<esc>gI')
vim.keymap.set('i', '<c-e>', '<esc>A')
vim.keymap.set('c', '<c-a>', '<home>')
vim.keymap.set('c', '<c-e>', '<end>')

vim.keymap.set('o', 'A', '<cmd>normal! ggVG<cr>')

vim.keymap.set('v', '<c-g>', '"*y')
vim.keymap.set('v', 'gn', ':normal! ')

vim.keymap.set('c', '%%', 'getcmdtype() == ":" ? expand("%:h")."/" : "%%"', { expr = true })
-- vim.keymap.set('c', '<c-k>', '<>') TODO get this delete from cursor to end of line
vim.keymap.set('c', 'qq', '"q!"', { expr = true })
vim.keymap.set('c', '<Tab>', 'getcmdtype() == "/" || getcmdtype() == "?" ? "<CR>/<C-r>/" : "<C-z>"', { expr = true })
vim.keymap.set('c', '<S-Tab>', 'getcmdtype() == "/" || getcmdtype() == "?" ? "<CR>?<C-r>/" : "<S-Tab>"', { expr = true })

vim.keymap.set('t', '<esc>', '<c-\\><c-n>')

-- vim.keymap.set('n', 'gr', function()
--     local lsp_support = false
--     for _, client in pairs(vim.lsp.get_clients({ bufnr = 0 })) do
--         if client and client.supports_method('textDocument/rename') then
--             lsp_support = true
--         end
--     end
--     if lsp_support then
--         vim.lsp.buf.rename()
--     else
--         require('nvim-treesitter-refactor.smart_rename').smart_rename(vim.fn.bufnr())
--     end
-- end)

vim.cmd('command! WS write|source %')
-- vim.cmd('command! StripWhitespace %s/\\v\\s+$//g')
vim.cmd('command! Yankfname let @* = expand("%")')

vim.g.qf_disable_statusline = true
vim.g.Eunuch_find_executable = 'fd' -- I use my fork of vim-eunuch
vim.g.loaded_netrwPlugin = true     -- don't load netrw
vim.g.netrw_banner = false
vim.g.tex_flavor = 'latex'
vim.g.vimtex_view_method = 'skim'
vim.g.vimtex_quickfix_mode = true
vim.g.vimtex_compiler_latexmk = {
    options = { '-pdf', '-shell-escape', '-verbose', '-file-line-error', '-synctex=1', '-interaction=nonstopmode' }
}
vim.g.loaded_ruby_provider = false
vim.g.vimsyn_embed = 'l'

-- vim.api.nvim_create_user_command('GH', function()
--     vim.api.nvim_open_win(-1, true, {})
-- end, { bang = true })
