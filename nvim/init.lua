require('rrethy.backpack').setup()

local treesitter = require('nvim-treesitter.configs')
local hotline = require('hotline')
local notify = require('notify')
local lspconfig = require('lspconfig')
local telescope = require('telescope')
local telescope_builtin = require('telescope.builtin')
local telescope_actions = require('telescope.actions')
local lsp_installer = require('nvim-lsp-installer')
local log = require('vim.lsp.log')

vim.g.mapleader = ' '

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

    File_watchers[fname] = vim.loop.new_fs_poll()
    File_watchers[fname]:start(fname, time, vim.schedule_wrap(cb))
end

local init_lua = vim.fn.stdpath('config') .. '/init.lua'
watch_file(init_lua, function()
    dofile(init_lua)
    vim.notify('Reloaded init.lua', vim.lsp.log_levels.INFO)
end, 500)

-- this files holds a single line describing my terminal and Neovim colorscheme. e.g. base16-schemer-dark
local base16_theme_fname = vim.fn.expand(vim.env.XDG_CONFIG_HOME .. '/.base16_theme')
if Colorscheme_counter == nil then
    Colorscheme_counter = 0
end
local function notify_colorscheme_changes(name)
    Colorscheme_counter = Colorscheme_counter + 1
    vim.fn.writefile({ name }, base16_theme_fname)
    vim.loop.spawn('kitty', {
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
        vim.notify('colorscheme: ' .. colorscheme, vim.lsp.log_levels.INFO)
    end
end, 500)
vim.keymap.set('n', '<leader>c', function()
    local colors                 = vim.fn.getcompletion('base16', 'color')
    local theme                  = require('telescope.themes').get_dropdown()
    local telescope_action_set   = require('telescope.actions.set')
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

local ERROR_ICON   = ''
local WARNING_ICON = ''
local INFO_ICON    = ''
local HINT_ICON    = ''
vim.cmd(string.format('sign define DiagnosticSignError text=%s texthl=DiagnosticSignError linehl= numhl=', ERROR_ICON))
vim.cmd(string.format('sign define DiagnosticSignWarn  text=%s texthl=DiagnosticSignWarn  linehl= numhl=', WARNING_ICON))
vim.cmd(string.format('sign define DiagnosticSignInfo  text=%s texthl=DiagnosticSignInfo  linehl= numhl=', INFO_ICON))
vim.cmd(string.format('sign define DiagnosticSignHint  text=%s texthl=DiagnosticSignHint  linehl= numhl=', HINT_ICON))

-- vim.notify = notify
vim.keymap.set('n', '<leader>n', notify.dismiss)
notify.setup({
    icons = {
        ERROR = ERROR_ICON,
        WARN = WARNING_ICON,
        INFO = INFO_ICON,
        DEBUG = HINT_ICON,
        TRACE = HINT_ICON,
    }
})

require('indent_blankline').setup({
    show_current_context = true,
    indent_blankline_char = '│',
    indent_blankline_filetype = { 'rust', 'go', 'lua', 'json', 'ruby' },
    indent_blankline_use_treesitter = true,
})

require('Comment').setup()

require('nvim-autopairs').setup({
    check_ts = true,
})

local function on_attach(client, bufnr)
    -- vim.lsp.set_log_level("debug")
    vim.keymap.set('n', ']d', vim.diagnostic.goto_next, { buffer = true })
    vim.keymap.set('n', '[d', vim.diagnostic.goto_prev, { buffer = true })
    vim.keymap.set('n', '\\d', vim.diagnostic.open_float, { buffer = true })
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, { buffer = true })
    vim.keymap.set('n', '<c-]>', vim.lsp.buf.definition, { buffer = true })
    vim.keymap.set('n', 'gd', vim.lsp.buf.type_definition, { buffer = true })
    vim.keymap.set('i', '<c-s>', vim.lsp.buf.signature_help, { buffer = true })
    vim.keymap.set('n', 'gr', vim.lsp.buf.rename, { buffer = true })
    vim.keymap.set('n', 'gi', vim.lsp.buf.implementation, { buffer = true })
    vim.keymap.set('n', 'gu', vim.lsp.buf.references, { buffer = true })
    vim.keymap.set('n', '<leader>s', require('telescope.builtin').lsp_dynamic_workspace_symbols, { buffer = true })
    vim.keymap.set('n', '<leader>d', require('telescope.builtin').lsp_document_symbols, { buffer = true })
    if client and client.supports_method('textDocument/formatting') then
        local lsp_augroup = 'rrethy_lsp_augroup' .. bufnr
        vim.api.nvim_create_augroup(lsp_augroup, { clear = true })
        vim.api.nvim_create_autocmd('BufWritePre', {
            group = lsp_augroup,
            buffer = bufnr,
            callback = function()
                if not DISABLE_FMT then
                    vim.lsp.buf.format({ timeout_ms = 3000 })
                end
            end
        })
    end
    vim.bo.omnifunc = 'v:lua.vim.lsp.omnifunc'
    require('illuminate').on_attach(client)
end

lsp_installer.setup({})
local default_lsp_config = {
    on_attach = on_attach,
    flags = {
        debounce_text_changes = 500,
    },
}
lspconfig.rust_analyzer.setup(vim.tbl_extend("force", default_lsp_config, {
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
}))
lspconfig.gopls.setup(default_lsp_config)
lspconfig.sorbet.setup(default_lsp_config)
lspconfig.sumneko_lua.setup(vim.tbl_extend("force", default_lsp_config, {
    settings = {
        Lua = {
            format = {
                enable = true,
                defaultConfig = {
                    indent_style = "space",
                    indent_size = "4",
                },
            },
            runtime = {
                version = 'LuaJIT',
                path = vim.split(package.path, ";"),
            },
            diagnostics = {
                enable = true,
                globals = {
                    'vim',
                    'describe',
                    'it',
                    'before_each',
                    'after_each',
                    'teardown',
                    'pending',
                    'bit',
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
}))
lspconfig.dartls.setup(vim.tbl_extend("force", default_lsp_config, {
    init_options = {
        closingLabels = true,
    },
}))

local function location_handler(_, result, ctx, _, config)
    if result == nil or vim.tbl_isempty(result) then
        local _ = log.info() and log.info(ctx.method, 'No location found')
        return nil
    end
    local client = vim.lsp.get_client_by_id(ctx.client_id)

    if vim.tbl_islist(result) then
        vim.lsp.util.jump_to_location(result[1], client.offset_encoding)

        if #result > 1 then
            config = config or {}
            if config.loclist then
                vim.fn.setloclist(0, {}, ' ', {
                    title = 'LSP locations',
                    items = vim.lsp.util.locations_to_items(result, client.offset_encoding)
                })
                vim.cmd("botright lopen")
            else
                vim.fn.setqflist({}, ' ', {
                    title = 'LSP locations',
                    items = vim.lsp.util.locations_to_items(result, client.offset_encoding)
                })
                vim.cmd("botright copen")
            end
        end
    else
        vim.lsp.util.jump_to_location(result, client.offset_encoding)
    end
end

vim.lsp.handlers['textDocument/signatureHelp']  = vim.lsp.with(
    vim.lsp.handlers['signature_help'], {
    border = 'single',
    close_events = { "CursorMoved", "BufHidden" },
}
)
vim.lsp.handlers['textDocument/hover']          = vim.lsp.with(vim.lsp.handlers['hover'], { border = 'single' })
vim.lsp.handlers['textDocument/references']     = vim.lsp.with(vim.lsp.handlers['textDocument/references'],
    { loclist = true })
vim.lsp.handlers['textDocument/typeDefinition'] = vim.lsp.with(location_handler, { loclist = true })
vim.lsp.handlers['textDocument/declaration']    = vim.lsp.with(location_handler, { loclist = true })
vim.lsp.handlers['textDocument/definition']     = vim.lsp.with(location_handler, { loclist = true })
vim.lsp.handlers['textDocument/implementation'] = vim.lsp.with(location_handler, { loclist = true })

treesitter.setup {
    highlight = {
        enable = true,
        disable = { 'latex', 'haskell', 'python' },
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
    textobjects = {
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
    endwise = {
        enable = true,
    },
    textsubjects = {
        enable = true,
        prev_selection = ',',
        keymaps = {
            ['.'] = 'textsubjects-smart',
            [';'] = 'textsubjects-container-outer',
            ['i;'] = 'textsubjects-container-inner',
        },
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
        prompt_prefix = " ",
        selection_caret = " ",
        entry_prefix = " ",
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
    telescope_builtin.find_files(require('telescope.themes').get_dropdown({ previewer = false }))
end)
vim.keymap.set('n', '<leader>b', function()
    telescope_builtin.buffers(require("telescope.themes").get_dropdown({ previewer = false }))
end)
vim.keymap.set('n', '<leader>h', telescope_builtin.help_tags)
vim.keymap.set('n', '<leader>g', telescope_builtin.live_grep)

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
vim.opt.laststatus = 3
local function lsp_diagnostic_count(name, icon)
    return function()
        if vim.tbl_isempty(vim.lsp.buf_get_clients(0)) then
            return ''
        else
            local count = #vim.diagnostic.get(0, { severity = name })
            if count > 0 then
                return string.format(' %s %d ', icon, count)
            end
            return ''
        end
    end
end

vim.opt.winbar = hotline.format {
    -- '%=',
    '%5*',
    ' ',
    vim.fn.bufnr,
    ' ',
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
    lsp_diagnostic_count(vim.diagnostic.severity.Warning, WARNING_ICON),
    -- User3 hlgroup
    '%3*',
    lsp_diagnostic_count(vim.diagnostic.severity.Information, INFO_ICON),
    -- User4 hlgroup
    '%4*',
    lsp_diagnostic_count(vim.diagnostic.severity.Hint, HINT_ICON),
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
vim.api.nvim_create_autocmd('BufNewFile', {
    group = init_lua_augroup,
    pattern = { 'tex' },
    command = '0r!cat ~/.config/nvim/skeletons/latex.skel',
})
vim.api.nvim_create_autocmd('TextYankPost', {
    group = init_lua_augroup,
    callback = function()
        vim.highlight.on_yank({ timeout = 250 })
    end,
})

vim.fn.mkdir(vim.fn.stdpath('data') .. '/backup/', 'p')

vim.keymap.set('n', '<a-n>', function()
    require('illuminate').next_reference({ wrap = true })
end)
vim.keymap.set('n', '<a-p>', function()
    require('illuminate').next_reference({ reverse = true, wrap = true })
end)
vim.keymap.set('n', '<a-i>', require('illuminate').toggle_pause)

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
    if vim.wo.number then
        vim.wo.number = false
    else
        vim.wo.number = true
    end
end)
vim.keymap.set('n', 'yor', function()
    if vim.wo.relativenumber then
        vim.wo.relativenumber = false
    else
        vim.wo.relativenumber = true
    end
end)
vim.keymap.set('n', 'yoc', function()
    if vim.wo.cursorcolumn then
        vim.wo.cursorcolumn = false
    else
        vim.wo.cursorcolumn = true
    end
end)
vim.keymap.set('n', 'yos', function()
    if vim.wo.spell then
        vim.wo.spell = false
        vim.notify("'spell'", vim.lsp.log_levels.ERROR)
    else
        vim.wo.spell = true
        vim.notify("'spell'", vim.lsp.log_levels.INFO)
    end
end)
vim.keymap.set('n', 'yob', function()
    if vim.wo.scrollbind then
        vim.wo.scrollbind = false
        vim.notify("'scrollbind'", vim.lsp.log_levels.ERROR)
    else
        vim.wo.scrollbind = true
        vim.notify("'scrollbind'", vim.lsp.log_levels.INFO)
    end
end)
vim.keymap.set('n', 'yoh', function()
    if vim.o.hlsearch then
        vim.o.hlsearch = false
        vim.notify("'hlsearch'", vim.lsp.log_levels.ERROR)
    else
        vim.o.hlsearch = true
        vim.notify("'hlsearch'", vim.lsp.log_levels.INFO)
    end
end)

vim.keymap.set('n', '<c-w>t', '<cmd>tabnew<cr>')
-- clear line
vim.keymap.set('n', 'cl', '0D')
-- why isn't this default??? maybe it's because of old keyboard configuration
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
vim.keymap.set('n', 'g>', '<cmd>20messages<cr>')
vim.keymap.set('n', 'n', '"Nn"[v:searchforward]', { expr = true })
vim.keymap.set('n', 'N', '"nN"[v:searchforward]', { expr = true })
vim.keymap.set('n', ';', 'getcharsearch().forward ? ";" : ","', { expr = true })
vim.keymap.set('n', ',', 'getcharsearch().forward ? "," : ";"', { expr = true })
vim.keymap.set('n', 'gp', '`[v`]')

vim.keymap.set('n', '<leader>tf', '<cmd>TestFile<cr>')
vim.keymap.set('n', '<leader>tn', '<cmd>TestNearest<cr>')
vim.keymap.set('n', '<leader>tl', '<cmd>TestLast<cr>')
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

vim.keymap.set('n', '<up>', '<cmd>lprevious<cr>')
vim.keymap.set('n', '<down>', '<cmd>lnext<cr>')
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

vim.keymap.set('n', '<c-w>l', function()
    vim.cmd('lclose')
end)
vim.keymap.set('n', '<c-w>q', function()
    vim.cmd('cclose')
end)

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

vim.keymap.set('o', 'A', '<cmd>normal! ggVG<cr>')

vim.keymap.set('v', '<c-g>', '"*y')
vim.keymap.set('v', 'gn', ':normal! ')

vim.keymap.set('c', '%%', 'getcmdtype() == ":" ? expand("%:h")."/" : "%%"', { expr = true })
vim.keymap.set('c', '<c-a>', '<home>')
vim.keymap.set('c', '<c-e>', '<end>')
-- vim.keymap.set('c', '<c-k>', '<>') TODO get this delete from cursor to end of line
vim.keymap.set('c', 'qq', '"q!"', { expr = true })
vim.keymap.set('c', '<Tab>', 'getcmdtype() == "/" || getcmdtype() == "?" ? "<CR>/<C-r>/" : "<C-z>"', { expr = true })
vim.keymap.set('c', '<S-Tab>', 'getcmdtype() == "/" || getcmdtype() == "?" ? "<CR>?<C-r>/" : "<S-Tab>"', { expr = true })

vim.keymap.set('t', '<esc>', '<c-\\><c-n>')

vim.keymap.set('t', 'gt', '"<c-\\><c-n>gt"', { expr = true, remap = true })

vim.cmd('command! WS write|source %')
vim.cmd('command! StripWhitespace %s/\\v\\s+$//g')
vim.cmd('command! Yankfname let @* = expand("%")')
vim.cmd('command! LlistToQlist call setqflist(getloclist(winnr()))')
vim.cmd('command! ClistToLlist call setloclist(winnr(), getqflist())')

vim.g.qf_disable_statusline = true -- This should be the default
vim.g.Eunuch_find_executable = 'fd' -- I use my fork of vim-eunuch
vim.g.Illuminate_ftwhitelist = { 'vim' } -- Only use lsp highlighting from the plugin
vim.g.netrw_banner = false
vim.g.Hexokinase_highlighters = { 'backgroundfull' }
vim.g.Hexokinase_optInPatterns = { 'full_hex', 'triple_hex', 'rgb', 'rgba', 'hsl', 'hsla' }
vim.g.Hexokinase_refreshEvents = { 'BufRead', 'BufWrite' }
vim.g.tex_flavor = 'latex'
vim.g.vimtex_view_method = 'skim'
vim.g.vimtex_quickfix_mode = true
vim.g.vimtex_compiler_latexmk = {
    options = { '-pdf', '-shell-escape', '-verbose', '-file-line-error', '-synctex=1', '-interaction=nonstopmode' }
}
vim.g['test#strategy'] = 'neovim'
vim.g.tex_flavor = 'latex'
vim.g.loaded_ruby_provider = false
vim.g.Illuminate_delay = 100
vim.g.vimsyn_embed = 'l'
